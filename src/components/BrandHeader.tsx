'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  className?: string;
}

const BrandHeader: React.FC<BrandHeaderProps> = ({ className }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: '首頁' },
    { href: '/search', label: '查詢' },
    { href: '/data', label: '資料說明' },
    { href: '/about', label: '關於我們' },
  ];

  return (
    <header
      className={cn(
        'bg-surface border-b-2 border-form-gray sticky top-0 z-40',
        className
      )}
    >
      <div className="max-w-6xl mx-auto px-lg py-md">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-md focus-ring rounded-base">
            <div className="flex items-center gap-xs">
              <CheckCircle
                size={32}
                className="text-civic-blue flex-shrink-0"
              />
              <div className="flex flex-col -space-y-1">
                <span className="text-lg font-bold text-main-ink">
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
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-md py-sm text-sm font-medium transition-colors duration-base focus-ring rounded-md',
                    isActive
                      ? 'bg-rice-paper text-main-ink'
                      : 'text-neutral-700 hover:bg-rice-paper hover:text-civic-blue'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-md py-sm text-main-ink font-medium hover:bg-rice-paper hover:text-civic-blue transition-colors duration-base"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export { BrandHeader };
export type { BrandHeaderProps };
