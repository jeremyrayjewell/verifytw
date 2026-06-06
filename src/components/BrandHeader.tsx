'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  className?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header
      className={cn(
        'bg-surface border-b-2 border-form-gray sticky top-0 z-40',
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-lg py-lg">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-md focus-ring rounded-base">
            <div className="flex items-center gap-xs">
              <CheckCircle
                size={28}
                className="text-civic-blue flex-shrink-0"
              />
              <div className="flex flex-col -space-y-1">
                <span className="text-base font-bold text-main-ink">
                  Verify
                  <span className="text-data-teal">TW</span>
                </span>
                <span className="text-xs font-medium text-main-ink">
                  台企查
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-xl">
            <Link
              href="/"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base focus-ring rounded-base px-md py-xs"
            >
              首頁
            </Link>
            <Link
              href="/search"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base focus-ring rounded-base px-md py-xs"
            >
              查詢
            </Link>
            <a
              href="#info"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base focus-ring rounded-base px-md py-xs"
            >
              資料說明
            </a>
            <a
              href="#about"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base focus-ring rounded-base px-md py-xs"
            >
              關於我們
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-md hover:bg-rice-paper rounded-base transition-colors duration-base focus-ring"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-lg pt-lg border-t-2 border-form-gray flex flex-col gap-md">
            <Link
              href="/"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base px-md py-xs"
            >
              首頁
            </Link>
            <Link
              href="/search"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base px-md py-xs"
            >
              查詢
            </Link>
            <a
              href="#info"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base px-md py-xs"
            >
              資料說明
            </a>
            <a
              href="#about"
              className="text-main-ink font-medium hover:text-civic-blue transition-colors duration-base px-md py-xs"
            >
              關於我們
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export { BrandHeader };
export type { BrandHeaderProps };
