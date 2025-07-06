// app/components/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import {
  User as UserIcon,
  Home,
  Cpu,
  Calendar,
  BarChart2,
  Users,
  Settings,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  user: { email: string };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-60 bg-[#17181c] border-r border-[#22232a] flex flex-col z-40"
      aria-label="Sidebar navigation"
    >
      <div className="flex items-center gap-2 h-16 px-6 text-2xl font-bold tracking-wide">
        <span className="text-[#c3bfff]">Beta7</span>
      </div>
      <div className="px-6 py-4 flex flex-col gap-2">
        <div className="flex items-center gap-3 text-sm mb-6 text-[#b1b2c1] truncate max-w-[180px]">
          <UserIcon className="w-5 h-5" />
          <span className="truncate">{user.email}</span>
        </div>
        <SidebarLink
          href="/dashboard"
          label="Dashboard"
          icon={<Home className="w-5 h-5" />}
          active={pathname === "/dashboard"}
        />
        <SidebarLink
          href="/ai-tool"
          label="AI Tool"
          icon={<Cpu className="w-5 h-5" />}
          active={pathname === "/ai-tool"}
        />
        <SidebarLink
          href="/calendar"
          label="Calendar"
          icon={<Calendar className="w-5 h-5" />}
          active={pathname === "/calendar"}
        />
        <SidebarLink
          href="/analytics"
          label="Analytics"
          icon={<BarChart2 className="w-5 h-5" />}
          active={pathname === "/analytics"}
        />
        <SidebarLink
          href="/team"
          label="Team"
          icon={<Users className="w-5 h-5" />}
          active={pathname === "/team"}
        />
      </div>
      <div className="flex-1" />
      <div className="px-6 pb-6 flex flex-col gap-1 text-xs text-[#7d7e8a]">
        <SidebarLink
          href="/settings"
          label="Settings"
          icon={<Settings className="w-4 h-4" />}
          active={pathname === "/settings"}
        />
        <SidebarLink
          href="/help"
          label="Help Center"
          icon={<HelpCircle className="w-4 h-4" />}
          active={pathname === "/help"}
        />
      </div>
    </aside>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

function SidebarLink({
  href,
  label,
  icon,
  active = false,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded transition ${
        active
          ? "bg-[#23242d] text-white font-semibold"
          : "hover:bg-[#23242d] hover:text-white text-[#b1b2c1]"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
