import Link from "next/link";

import { TravelerAppShell } from "../_components/TravelerAppShell";

const readinessItems = [
  {
    label: "Identity",
    value: "Traveler account required",
    detail: "The official pass links to backend session and verified traveler records.",
  },
  {
    label: "QR readiness",
    value: "Pending backend verification",
    detail: "No QR is generated in the browser. QR issuance stays protected.",
  },
  {
    label: "Trip requests",
    value: "Request-to-confirm",
    detail: "Bookings, payment, access, and fulfillment remain backend-owned.",
  },
];

const protectedItems = [
  "Official QR issuance",
  "Site access validation",
  "Boarding or movement permission",
  "Passport stamps and visit proof",
];

export default function TravelerPassPage() {
  return (
    <TravelerAppShell activeTab="pass">
      <section className="dp-pass-app-hero" aria-labelledby="traveler-pass-title">
        <div className="dp-pass-app-kicker">Official Traveler Pass</div>
        <h1 id="traveler-pass-title">Your Dinagat Pass readiness hub</h1>
        <p>
          Keep your traveler identity, QR readiness, and trip request status in one protected
          mobile app surface.
        </p>
      </section>

      <section className="dp-pass-card dp-pass-primary-card" aria-label="Traveler pass readiness">
        <div className="dp-pass-status-row">
          <span className="dp-pass-status-dot" aria-hidden="true" />
          <span>Backend verification required</span>
        </div>

        <div className="dp-pass-visual" aria-label="Official pass placeholder">
          <div className="dp-pass-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="dp-pass-mark">
            <span>DP</span>
          </div>
        </div>

        <div className="dp-pass-card-copy">
          <p className="dp-pass-label">Traveler QR</p>
          <h2>Available after backend verification</h2>
          <p>
            This screen does not create a QR, approve access, confirm payment, or assign an operator.
          </p>
        </div>
      </section>

      <section className="dp-pass-grid" aria-label="Pass readiness details">
        {readinessItems.map((item) => (
          <article className="dp-pass-mini-card" key={item.label}>
            <div>
              <p>{item.label}</p>
              <h2>{item.value}</h2>
            </div>
            <span>{item.detail}</span>
          </article>
        ))}
      </section>

      <section className="dp-pass-card" aria-label="Protected pass controls">
        <div className="dp-pass-section-head">
          <p>Protected controls</p>
          <h2>What this pass will control</h2>
        </div>

        <div className="dp-pass-chip-grid">
          {protectedItems.map((item) => (
            <span className="dp-pass-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="dp-pass-action-card" aria-label="Next traveler action">
        <div>
          <p>Need a trip reviewed?</p>
          <h2>Start with a request, not a fake confirmation.</h2>
          <span>Dinagat Pass will keep booking, payment, QR, and fulfillment protected.</span>
        </div>
        <Link className="dp-pass-action" href="/traveler/trip-booking">
          Request trip review
        </Link>
      </section>
    </TravelerAppShell>
  );
}
