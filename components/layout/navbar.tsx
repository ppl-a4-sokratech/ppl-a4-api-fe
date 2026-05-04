"use client";

import { useState } from "react";
import { Logo } from "../ui/logo";

type NavbarProps = {
  scope: "Admin" | "Customer";
  userLabel?: string;
  onLogout: () => void;
};

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51.61.25 1.32.13 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.25.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.26.39-1.51 1z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Navbar = ({ scope, userLabel, onLogout }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-14 items-center justify-between bg-brand-900 px-6 text-white">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight">Sokratech</span>
        <span className="text-sm text-white/70">for {scope}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
        >
          <SettingsIcon />
        </button>
        <div className="relative">
          <button
            type="button"
            aria-label="Account menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
          >
            <UserIcon />
          </button>
          {menuOpen ? (
            <div className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white text-slate-800 shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3 text-sm">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Signed in as
                </div>
                <div className="truncate font-medium">
                  {userLabel ?? scope.toLowerCase()}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export { Logo };
