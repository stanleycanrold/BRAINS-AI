"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, Settings, Plus, Sparkles } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Ideas", href: "/dashboard/ideas", icon: Lightbulb },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-bg-border bg-sidebar-bg">
      <div className="flex items-center gap-3 border-b border-bg-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
          B
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">BRAINS AI</p>
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Founder Workspace</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-6">
        <Link href="/dashboard/ideas/new" className="btn-primary mb-6 w-full justify-center gap-2">
          <Plus className="h-4 w-4" />
          New Idea
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-primary"
                    : "text-text-secondary hover:bg-sidebar-active/50 hover:text-text-primary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-xl border border-bg-border bg-bg-surface p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            Evidence-first workflow
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Capture context, strengthen it with research, and validate with a decision-grade report.
          </p>
        </div>
      </div>
    </aside>
  );
}
