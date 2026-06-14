import Link from "next/link";

import { TravelerAppShell } from "../_components/TravelerAppShell";

const readinessRows = [
  {
    label: "Session",
    value: "Backend session required",
    detail: "Account state must come from protected auth endpoints, not browser assumptions.",
  },
  {
    label: "Identity",
    value: "Verification pending",
    detail: "Traveler identity verification remains backend-owned before pass or QR readiness.",
  },
  {
    label: "Pass link",
    value: "Available after verification",
    detail: "Official QR readiness is shown in the Traveler Pass when backend data exists.",
  },
];

const protectedControls = [
  "Profile details",
  "Identity verification",
  "Session security",
  "Traveler pass readiness",
];

export default function TravelerSettingsPage() {
  return (
    <TravelerAppShell activeTab="profile">
      <section className="dp-settings-hero" aria-labelledby="traveler-settings-title">
        <div className="dp-settings-kicker">Profile & Settings</div>
        <h1 id="traveler-settings-title">Manage your traveler readiness</h1>
        <p>
          Keep account, identity, and pass readiness in one mobile app surface while protected
          systems control verification.
        </p>
      </section>

      <section className="dp-settings-card dp-settings-profile-card" aria-label="Traveler account summary">
        <div className="dp-settings-avatar" aria-hidden="true">
          <span>DP</span>
        </div>

        <div className="dp-settings-profile-copy">
          <p>Traveler account</p>
          <h2>Backend verification required</h2>
          <span>
            This screen does not verify identity, create a QR, approve access, or change session
            state in the browser.
          </span>
        </div>
      </section>

      <section className="dp-settings-grid" aria-label="Traveler readiness details">
        {readinessRows.map((item) => (
          <article className="dp-settings-mini-card" key={item.label}>
            <div>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
            <span>{item.detail}</span>
          </article>
        ))}
      </section>

      <section className="dp-settings-card" aria-label="Protected profile controls">
        <div className="dp-settings-section-head">
          <p>Protected controls</p>
          <h2>Settings that must stay backend-owned</h2>
        </div>

        <div className="dp-settings-chip-grid">
          {protectedControls.map((item) => (
            <span className="dp-settings-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="dp-settings-actions" aria-label="Traveler settings actions">
        <Link className="dp-settings-action" href="/traveler/pass">
          View pass readiness
        </Link>
        <Link className="dp-settings-secondary" href="/traveler/requests">
          View trip requests
        </Link>
      </section>
    </TravelerAppShell>
  );
}
