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
  X,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  user: { email: string };
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ user, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 sm:hidden transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-60 bg-[#17181c] border-r border-[#22232a]
          transform transition-transform ease-in-out duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0 sm:static sm:flex sm:flex-col
        `}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between h-16 px-6">
          <span className="text-2xl font-bold text-[#c3bfff]">Beta7</span>
          <button
            className="sm:hidden p-2"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-[#b1b2c1]" />
          </button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-2 flex-1 overflow-auto">
          <div className="flex items-center gap-3 text-sm mb-6 text-[#b1b2c1] truncate">
            <UserIcon className="w-5 h-5" />
            <span className="truncate">{user.email}</span>
          </div>
          {/* Links */}
          {[
            ["/dashboard", "Dashboard", <Home />],
            ["/ai-tool", "AI Tool", <Cpu />],
            ["/calendar", "Calendar", <Calendar />],
            ["/analytics", "Analytics", <BarChart2 />],
            ["/team", "Team", <Users />],
          ].map(([href, label, icon]) => (
            <SidebarLink
              key={href}
              href={href as string}
              label={label as string}
              icon={React.cloneElement(icon as React.ReactElement, {
                className: "w-5 h-5",
              })}
              active={pathname === href}
              onClick={onClose}
            />
          ))}
        </div>

        <div className="px-6 pb-6 flex flex-col gap-1 text-xs text-[#7d7e8a]">
          <SidebarLink
            href="/settings"
            label="Settings"
            icon={<Settings className="w-4 h-4" />}
            active={pathname === "/settings"}
            onClick={onClose}
          />
          <SidebarLink
            href="/help"
            label="Help Center"
            icon={<HelpCircle className="w-4 h-4" />}
            active={pathname === "/help"}
            onClick={onClose}
          />
        </div>
      </aside>
    </>
  );
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

function SidebarLink({
  href,
  label,
  icon,
  active = false,
  onClick,
}: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center gap-3 px-3 py-2 rounded
        ${active
          ? "bg-[#23242d] text-white font-semibold"
          : "hover:bg-[#23242d] hover:text-white text-[#b1b2c1]"}
      `}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
