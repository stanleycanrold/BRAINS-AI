import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Brain } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/ideas", label: "Ideas" },
  { href: "/dashboard/ideas/new", label: "New Idea" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-bg-border bg-bg-surface">
        <div className="flex h-16 items-center gap-2 px-6">
          <Brain className="h-6 w-6 text-cyan" />
          <span className="font-bold tracking-tight">
            <span className="text-cyan">BRAINS</span>
            <span className="text-text-muted"> AI</span>
          </span>
        </div>
        <nav className="flex flex-col gap-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2.5 text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">{children}</div>
      </main>
    </div>
  );
}
