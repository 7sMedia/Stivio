"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home as HomeIcon,
  Grid as ProjectsIcon,
  Settings as ToolsIcon,
  User as AccountIcon,
} from "lucide-react";

export default function BottomNav() {
  const path = usePathname();
  const tabs = [
    { href: "/dashboard",    label: "Home",     icon: <HomeIcon /> },
    { href: "/projects",     label: "Projects", icon: <ProjectsIcon /> },
    { href: "/tools",        label: "Tools",    icon: <ToolsIcon /> },
    { href: "/account",      label: "Account",  icon: <AccountIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface-primary border-t border-surface-secondary md:hidden">
      <ul className="flex justify-around">
        {tabs.map((tab) => {
          const active = path?.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={`
                  flex flex-col items-center py-2 text-xs
                  ${active ? "text-accent" : "text-text-secondary hover:text-text-primary"}
                `}
              >
                <div className="h-6 w-6 mb-1">{tab.icon}</div>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
