import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';
import { once } from 'node:events';
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
  format: 'json' | 'jsonl';
  onlyIds?: Set<string>;
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
  let format: 'json' | 'jsonl' = 'json';
  let onlyIds: Set<string> | undefined;
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

    if (arg === '--format') {
      const rawFormat = args.shift();
      if (rawFormat !== 'json' && rawFormat !== 'jsonl') {
        throw new Error('`--format` must be either `json` or `jsonl`.');
      }
      format = rawFormat;
      continue;
    }

    if (arg === '--only-ids') {
      const rawIds = args.shift() ?? '';
      const parsedIds = rawIds
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

      if (parsedIds.length === 0 || parsedIds.some((value) => !/^\d{8}$/.test(value))) {
        throw new Error('`--only-ids` must be a comma-separated list of 8-digit Business IDs.');
      }

      onlyIds = new Set(parsedIds);
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

  for (const positional of positionalArgs.slice(2)) {
    if (positional === 'json' || positional === 'jsonl') {
      format = positional;
      continue;
    }

    if (limit === undefined) {
      const parsed = Number(positional);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error('`--limit` must be a positive number.');
      }
      limit = parsed;
    }
  }

  if (!input || !output) {
    throw new Error('Usage: --input <path> --output <path> [--limit <number>] [--format json|jsonl] [--only-ids 12345678,87654321]');
  }

  return { input, output, limit, format, onlyIds };
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
  const inputStats = await stat(inputPath);

  if (options.format === 'json' && options.limit === undefined && !options.onlyIds) {
    const maxSafeJsonInputBytes = 5 * 1024 * 1024;
    if (inputStats.size > maxSafeJsonInputBytes) {
      throw new Error(
        'Full JSON output can exceed Node string limits. Use --format jsonl for the full MOF dataset, or pass --limit for a small JSON sample.'
      );
    }
  }

  const stream = createReadStream(inputPath, { encoding: 'utf8' });
  const lineReader = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  let headers: string[] | null = null;
  const records: Record<string, NormalizedMofTaxRegistrationRecord> = {};
  const jsonlWriter =
    options.format === 'jsonl'
      ? createWriteStream(outputPath, { encoding: 'utf8' })
      : null;
  let skippedRowCount = 0;
  let processedValidRows = 0;

  if (jsonlWriter) {
    await mkdir(outputDir, { recursive: true });
  }

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

    if (options.onlyIds && !options.onlyIds.has(businessId)) {
      continue;
    }

    const normalizedRecord = normalizeMofTaxRegistrationRecord(rawRecord);
    if (!normalizedRecord) {
      skippedRowCount += 1;
      continue;
    }

    if (jsonlWriter) {
      const canContinue = jsonlWriter.write(`${JSON.stringify(normalizedRecord)}\n`);
      if (!canContinue) {
        await once(jsonlWriter, 'drain');
      }
    } else {
      records[normalizedRecord.businessId] = normalizedRecord;
    }
    processedValidRows += 1;

    if (options.limit && processedValidRows >= options.limit) {
      break;
    }
  }

  if (jsonlWriter) {
    jsonlWriter.end();
    await once(jsonlWriter, 'finish');
  }

  const recordCount = jsonlWriter ? processedValidRows : Object.keys(records).length;

  if (!jsonlWriter) {
    const output: OutputShape = {
      metadata: {
        sourceNameZh: MOF_SOURCE_NAME_ZH,
        sourceNameEn: MOF_SOURCE_NAME_EN,
        generatedAt: new Date().toISOString(),
        recordCount,
      },
      records,
    };

    await mkdir(outputDir, { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  }

  console.log('MOF tax index generated');
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(`Format: ${options.format}`);
  console.log(`Valid records: ${recordCount}`);
  console.log(`Skipped rows: ${skippedRowCount}`);
  console.log(`Limit used: ${options.limit ?? 'none'}`);
  console.log(`Only IDs used: ${options.onlyIds ? [...options.onlyIds].join(',') : 'none'}`);
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
