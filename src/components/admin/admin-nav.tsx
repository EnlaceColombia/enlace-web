import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, LayoutDashboard, MessageCircleHeart, Newspaper, Radio } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/dashboard", label: "Panel", icon: LayoutDashboard },
  { to: "/admin/blogs", label: "Blog", icon: Newspaper },
  { to: "/admin/testimonios", label: "Testimonios", icon: MessageCircleHeart },
  { to: "/admin/maratonica", label: "Maratónica", icon: Radio },
  { to: "/admin/registro-web", label: "Registro web", icon: FileText },
] as const;

export function AdminNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "inline-flex items-center gap-2 h-9 px-3 rounded-full text-sm font-semibold transition",
              active ? "bg-white text-violet" : "bg-white/10 text-white hover:bg-white/20",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
