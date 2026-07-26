"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lightbulb,
  Briefcase,
  Settings,
  HelpCircle,
  LifeBuoy,
  ChevronDown,
  Plus,
} from "lucide-react";

const navItems = [
  { label: "Ideas", href: "/dashboard/ideas", icon: Lightbulb },
  { label: "Portfolio", href: "/dashboard/portfolio", icon: Briefcase },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const supportItems = [
  { label: "Help", href: "/help", icon: HelpCircle },
  { label: "Support", href: "/support", icon: LifeBuoy },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-bg-border bg-sidebar-bg">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-bg-border px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
          B
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-text-primary">BRAINS AI</span>
          <span className="text-xs text-text-muted uppercase tracking-wide">
            Founder Workspace
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-active text-primary"
                  : "text-text-secondary hover:text-text-primary hover:bg-sidebar-active/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* New Venture Button */}
      <div className="border-t border-bg-border px-3 py-4">
        <button className="btn-primary w-full justify-center gap-2">
          <Plus className="h-4 w-4" />
          New Venture
        </button>
      </div>

      {/* Support Links */}
      <nav className="space-y-1 border-t border-bg-border px-3 py-4">
        {supportItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:text-text-primary hover:bg-sidebar-active/50"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
