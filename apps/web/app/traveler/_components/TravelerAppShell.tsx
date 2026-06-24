import type { ReactNode } from "react";

type TravelerAppShellProps = {
  children: ReactNode;
  activeTab?: "home" | "requests" | "pass" | "profile";
};

type TravelerBottomNavProps = {
  activeTab?: "home" | "requests" | "pass" | "profile";
};

const navItems = [
  {
    key: "home",
    icon: "\u2302",
    label: "Home",
    href: "/traveler/home",
  },
  {
    key: "requests",
    icon: "\u25A4",
    label: "Requests",
    href: "/traveler/requests",
  },
  {
    key: "pass",
    icon: "\u25C7",
    label: "Pass",
    href: "/traveler/pass",
  },
  {
    key: "profile",
    icon: "\u25C9",
    label: "Profile",
    href: "/traveler/settings",
  },
] as const;

export function TravelerAppShell({
  children,
  activeTab = "home",
}: TravelerAppShellProps) {
  return (
    <main className="dp-true-app-stage">
      <section className="dp-true-app-device" aria-label="Dinagat Pass traveler app">
        <TravelerAppTopbar />
        {children}
        <TravelerBottomNav activeTab={activeTab} />
      </section>
    </main>
  );
}

export function TravelerAppTopbar() {
  return (
    <header className="dp-true-app-topbar">
      <div className="dp-true-app-brand">
        <span className="dp-true-app-mark">DP</span>
        <div>
          <p className="dp-true-app-brand-title">Dinagat Pass</p>
          <p className="dp-true-app-brand-subtitle">Traveler app</p>
        </div>
      </div>

      <span className="dp-true-app-session">Verified</span>
    </header>
  );
}

export function TravelerBottomNav({ activeTab = "home" }: TravelerBottomNavProps) {
  return (
    <nav className="dp-true-app-bottom-nav" aria-label="Traveler app navigation">
      {navItems.map((item) => (
        <a
          className={
            item.key === activeTab
              ? "dp-true-app-nav-item is-active"
              : "dp-true-app-nav-item"
          }
          href={item.href}
          key={item.key}
        >
          <strong>{item.icon}</strong>
          <em>{item.label}</em>
        </a>
      ))}
    </nav>
  );
}
