"use client";

import { useUser } from "@clerk/nextjs";
import { Search, Bell, Settings, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  status?: "RESEARCHING" | "ANALYZING DESIGN" | "BUILDING" | "VALIDATING";
  searchPlaceholder?: string;
}

export function Header({
  title,
  subtitle,
  status,
  searchPlaceholder = "Search ideas...",
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
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          {title && (
            <div>
              <div className="flex items-center gap-3">
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
                <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="input-field pl-10 w-64"
            />
          </div>

          {/* Icons */}
          <button className="rounded-lg p-2 hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="h-5 w-5" />
          </button>

          <button className="rounded-lg p-2 hover:bg-bg-elevated text-text-secondary hover:text-text-primary transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Profile */}
          <div className="ml-2 flex items-center gap-3">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
