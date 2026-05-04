"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: ReactNode;
};

type SidebarProps = {
  primary: SidebarItem[];
  secondary?: SidebarItem[];
};

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  </svg>
);

export const Sidebar = ({ primary, secondary = [] }: SidebarProps) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === pathname) return true;
    return pathname.startsWith(`${href}/`);
  };

  const renderItem = (item: SidebarItem) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-colors ${
          active
            ? "bg-brand-50 text-brand-700"
            : "text-slate-700 hover:bg-slate-100"
        } ${collapsed ? "justify-center px-2" : ""}`}
        aria-current={active ? "page" : undefined}
        title={collapsed ? item.label : undefined}
      >
        <span className="flex h-5 w-5 items-center justify-center text-current">
          {item.icon}
        </span>
        {collapsed ? null : <span className="truncate">{item.label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`flex flex-col border-r border-slate-200 bg-white transition-all ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {primary.map(renderItem)}
      </nav>
      {secondary.length > 0 ? (
        <div className="border-t border-slate-100 px-3 py-3">
          {secondary.map(renderItem)}
        </div>
      ) : null}
      <div className="border-t border-slate-100 px-3 py-3">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 ${
            collapsed ? "justify-center px-2" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className="flex h-5 w-5 items-center justify-center">
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </span>
          {collapsed ? null : <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
};
