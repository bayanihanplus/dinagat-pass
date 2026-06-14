import { TravelerAppShell } from "../_components/TravelerAppShell";

const actionIcons = {
  trip: "\u2708",
  pass: "\u25C7",
} as const;

const guardrailIcons = ["\u265C", "\u25A3", "\u2317", "\u25CC"] as const;

const quickActions = [
  {
    icon: actionIcons.trip,
    label: "Trip request",
    title: "Start request",
    copy: "Send trip details for review.",
    href: "/traveler/trip-booking",
    primary: true,
  },
  {
    icon: actionIcons.pass,
    label: "Official pass",
    title: "Pass state",
    copy: "Session-verified traveler access.",
    href: "/traveler/home",
    primary: false,
  },
];

const readinessItems = [
  {
    icon: "01",
    title: "Request only",
    copy: "No booking claim from the app.",
  },
  {
    icon: "02",
    title: "Payment protected",
    copy: "Payment appears only when system-ready.",
  },
  {
    icon: "03",
    title: "QR controlled",
    copy: "QR appears only when issued.",
  },
];

const guardrails = [
  "No fake confirmation",
  "No browser-side approval",
  "No QR shortcut",
  "No operator assignment",
];

export default function TravelerHomePage() {
  return (
    <TravelerAppShell activeTab="home">
      <section className="dp-true-app-pass">
        <div>
          <p className="dp-true-app-kicker">Traveler home</p>
          <h1>Your Dinagat journey</h1>
          <p>
            Manage pass readiness and trip requests from your verified traveler app.
          </p>
        </div>

        <div className="dp-true-app-pass-state">
          <span />
          <p>Session verified</p>
        </div>
      </section>

      <section className="dp-true-app-actions" aria-label="Primary actions">
        {quickActions.map((item) => (
          <article className="dp-true-app-action-card" key={item.title}>
            <div className="dp-true-app-action-icon">{item.icon}</div>
            <p className="dp-true-app-kicker">{item.label}</p>
            <h2>{item.title}</h2>
            <p>{item.copy}</p>
            <a
              className={item.primary ? "dp-true-app-primary" : "dp-true-app-secondary"}
              href={item.href}
            >
              {item.primary ? "Open \u2192" : "View \u2192"}
            </a>
          </article>
        ))}
      </section>

      <section className="dp-true-app-card">
        <div className="dp-true-app-section-head">
          <p className="dp-true-app-kicker">Readiness</p>
          <h2>Before you continue</h2>
        </div>

        <div className="dp-true-app-list">
          {readinessItems.map((item) => (
            <article className="dp-true-app-list-item" key={item.title}>
              <span>{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
              <strong aria-hidden="true">{"\u203A"}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="dp-true-app-card">
        <div className="dp-true-app-section-head">
          <p className="dp-true-app-kicker">Protected actions</p>
          <h2>Official actions stay protected.</h2>
          <p>
            Booking, payment, QR, and fulfillment remain system-controlled.
          </p>
        </div>

        <div className="dp-true-app-chip-grid">
          {guardrails.map((item, index) => (
            <span key={item}>
              <em aria-hidden="true">{guardrailIcons[index]}</em>
              {item}
            </span>
          ))}
        </div>
      </section>
    </TravelerAppShell>
  );
}

