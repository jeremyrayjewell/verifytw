import { createReadStream } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import {
  MOF_SOURCE_NAME_EN,
  MOF_SOURCE_NAME_ZH,
  normalizeMofTaxRegistrationRecord,
  type MofTaxRegistrationRecordRaw,
  type NormalizedMofTaxRegistrationRecord,
} from '../src/lib/sources/mof';

interface CliOptions {
  input: string;
  output: string;
  limit?: number;
}

interface OutputShape {
  metadata: {
    sourceNameZh: string;
    sourceNameEn: string;
    generatedAt: string;
    recordCount: number;
  };
  records: Record<string, NormalizedMofTaxRegistrationRecord>;
}

function parseCliArgs(argv: string[]): CliOptions {
  const args = [...argv];
  let input = '';
  let output = '';
  let limit: number | undefined;
  const positionalArgs: string[] = [];

  while (args.length > 0) {
    const arg = args.shift();

    if (!arg) {
      continue;
    }

    if (arg === '--input') {
      input = args.shift() ?? '';
      continue;
    }

    if (arg === '--output') {
      output = args.shift() ?? '';
      continue;
    }

    if (arg === '--limit') {
      const rawLimit = args.shift();
      const parsed = Number(rawLimit);
      if (!rawLimit || !Number.isFinite(parsed) || parsed <= 0) {
        throw new Error('`--limit` must be a positive number.');
      }
      limit = parsed;
      continue;
    }

    positionalArgs.push(arg);
  }

  if (!input && positionalArgs[0]) {
    input = positionalArgs[0];
  }

  if (!output && positionalArgs[1]) {
    output = positionalArgs[1];
  }

  if (limit === undefined && positionalArgs[2]) {
    const parsed = Number(positionalArgs[2]);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error('`--limit` must be a positive number.');
    }
    limit = parsed;
  }

  if (!input || !output) {
    throw new Error('Usage: --input <path> --output <path> [--limit <number>]');
  }

  return { input, output, limit };
}

function stripUtf8Bom(content: string): string {
  return content.charCodeAt(0) === 0xfeff ? content.slice(1) : content;
}

function parseCsvLine(content: string): string[] {
  const values: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let index = 0; index < content.length; index += 1) {
    const char = content[index];
    const next = content[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentField += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(currentField);
      currentField = '';
      continue;
    }

    currentField += char;
  }

  values.push(currentField);
  return values;
}

function isDateMarkerRow(values: string[]): boolean {
  const [first = '', ...rest] = values;
  return /^\d{2}-[A-Z]{3}-\d{2}$/i.test(first.trim()) && rest.every((value) => value.trim() === '');
}

function toRawRecord(headers: string[], values: string[]): MofTaxRegistrationRecordRaw {
  return headers.reduce<MofTaxRegistrationRecordRaw>((record, header, index) => {
    record[header as keyof MofTaxRegistrationRecordRaw] = values[index]?.trim() ?? '';
    return record;
  }, {});
}

async function buildIndex(options: CliOptions) {
  const inputPath = path.resolve(options.input);
  const outputPath = path.resolve(options.output);
  const outputDir = path.dirname(outputPath);
  const stream = createReadStream(inputPath, { encoding: 'utf8' });
  const lineReader = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let headers: string[] | null = null;
  const records: Record<string, NormalizedMofTaxRegistrationRecord> = {};
  let skippedRowCount = 0;
  let processedValidRows = 0;

  for await (const rawLine of lineReader) {
    const line = headers ? rawLine : stripUtf8Bom(rawLine);
    if (!line.trim()) {
      continue;
    }

    const row = parseCsvLine(line);

    if (!headers) {
      headers = row.map((header) => header.trim());
      continue;
    }

    if (isDateMarkerRow(row)) {
      skippedRowCount += 1;
      continue;
    }

    const rawRecord = toRawRecord(headers, row);
    const businessId = rawRecord['統一編號']?.trim() ?? '';

    if (!/^\d{8}$/.test(businessId)) {
      skippedRowCount += 1;
      continue;
    }

    const normalizedRecord = normalizeMofTaxRegistrationRecord(rawRecord);
    if (!normalizedRecord) {
      skippedRowCount += 1;
      continue;
    }

    records[normalizedRecord.businessId] = normalizedRecord;
    processedValidRows += 1;

    if (options.limit && processedValidRows >= options.limit) {
      break;
    }
  }

  const output: OutputShape = {
    metadata: {
      sourceNameZh: MOF_SOURCE_NAME_ZH,
      sourceNameEn: MOF_SOURCE_NAME_EN,
      generatedAt: new Date().toISOString(),
      recordCount: Object.keys(records).length,
    },
    records,
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

  console.log('MOF tax index generated');
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Valid records: ${output.metadata.recordCount}`);
  console.log(`Skipped rows: ${skippedRowCount}`);
  console.log(`Limit used: ${options.limit ?? 'none'}`);
}

async function main() {
  try {
    const options = parseCliArgs(process.argv.slice(2));
    await buildIndex(options);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to build MOF tax index: ${message}`);
    process.exitCode = 1;
  }
}

void main();
