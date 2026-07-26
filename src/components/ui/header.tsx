"use client";

import { useUser } from "@clerk/nextjs";
import { Search, Bell, Settings, ChevronRight, CheckCircle2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import type { ReactNode } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  status?: "RESEARCHING" | "ANALYZING DESIGN" | "BUILDING" | "VALIDATING";
  searchPlaceholder?: string;
  breadcrumb?: string[];
  steps?: Array<{ label: string; href: string; current?: boolean; complete?: boolean }>;
  actions?: ReactNode;
}

export function Header({
  title,
  subtitle,
  status,
  searchPlaceholder = "Search ideas...",
  breadcrumb,
  steps,
  actions,
}: HeaderProps) {
  const { user } = useUser();

  const statusColors: Record<string, string> = {
    RESEARCHING: "bg-warning-light text-warning",
    "ANALYZING DESIGN": "bg-primary-light text-primary",
    BUILDING: "bg-success-light text-success",
    VALIDATING: "bg-primary-light text-primary",
  };

  return (
    <header className="border-b border-bg-border bg-white">
      <div className="flex flex-col gap-4 px-8 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {title && (
            <div>
              {breadcrumb && (
                <div className="mb-2 flex items-center gap-2 text-sm text-text-secondary">
                  {breadcrumb.map((item, index) => (
                    <span key={item} className="flex items-center gap-2">
                      {index > 0 && <ChevronRight className="h-4 w-4" />}
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
                {status && (
                  <span
                    className={`badge ${statusColors[status] || "bg-primary-light text-primary"}`}
                  >
                    {status}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="mt-1 max-w-3xl text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="input-field w-64 pl-10"
            />
          </div>
          {actions}
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
              <Bell className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary">
              <Settings className="h-5 w-5" />
            </button>
            <div className="ml-1 flex items-center gap-3">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {steps && steps.length > 0 && (
        <div className="border-t border-bg-border px-8 py-3">
          <div className="flex flex-wrap gap-2">
            {steps.map((step) => (
              <Link
                key={step.label}
                href={step.href}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  step.current
                    ? "bg-primary text-white"
                    : step.complete
                      ? "bg-success-light text-success"
                      : "bg-bg-elevated text-text-secondary"
                }`}
              >
                {step.complete ? <CheckCircle2 className="h-4 w-4" /> : null}
                <span>{step.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
