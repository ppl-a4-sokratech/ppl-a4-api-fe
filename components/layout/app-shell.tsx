import type { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Sidebar, type SidebarItem } from "./sidebar";

type AppShellProps = {
  scope: "Admin" | "Customer";
  userLabel?: string;
  onLogout: () => void;
  primaryNav: SidebarItem[];
  secondaryNav?: SidebarItem[];
  children: ReactNode;
};

export const AppShell = ({
  scope,
  userLabel,
  onLogout,
  primaryNav,
  secondaryNav,
  children,
}: AppShellProps) => (
  <div className="flex h-screen flex-col bg-surface-app">
    <Navbar scope={scope} userLabel={userLabel} onLogout={onLogout} />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar primary={primaryNav} secondary={secondaryNav} />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-white via-surface-app to-surface-tint">
        {children}
      </main>
    </div>
  </div>
);
