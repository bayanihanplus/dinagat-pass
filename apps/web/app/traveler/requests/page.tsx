import Link from "next/link";

import { TravelerAppShell } from "../_components/TravelerAppShell";

const requestStages = [
  {
    label: "Request draft",
    value: "Traveler submits details",
    detail: "Destination, trip type, date, party size, and notes start the review flow.",
  },
  {
    label: "Backend review",
    value: "Status comes from server",
    detail: "Dinagat Pass will decide readiness only after backend checks are available.",
  },
  {
    label: "Protected next steps",
    value: "Payment, QR, and fulfillment stay locked",
    detail: "The browser cannot approve access, issue QR readiness, or assign a local operator.",
  },
];

const protectedStatuses = [
  "Pending backend review",
  "Needs traveler details",
  "Awaiting protected payment step",
  "QR readiness unavailable",
];

export default function TravelerRequestsPage() {
  return (
    <TravelerAppShell activeTab="requests">
      <section className="dp-requests-hero" aria-labelledby="traveler-requests-title">
        <div className="dp-requests-kicker">Trip Requests</div>
        <h1 id="traveler-requests-title">Track requests without fake confirmation</h1>
        <p>
          Review your Dinagat trip request readiness while booking, payment, QR, and fulfillment
          remain protected by the backend.
        </p>
      </section>

      <section className="dp-requests-card dp-requests-primary" aria-label="Current request state">
        <div className="dp-requests-status">
          <span aria-hidden="true" />
          <strong>No approved request shown yet</strong>
        </div>

        <div className="dp-requests-empty">
          <p>Current request</p>
          <h2>Start or continue a trip request</h2>
          <span>
            This hub is ready for backend request history. Until then, it only shows safe readiness
            states and protected next steps.
          </span>
        </div>

        <Link className="dp-requests-action" href="/traveler/trip-booking">
          Start request
        </Link>
      </section>

      <section className="dp-requests-timeline" aria-label="Request review stages">
        {requestStages.map((stage, index) => (
          <article className="dp-requests-step" key={stage.label}>
            <div className="dp-requests-step-index">{index + 1}</div>
            <div>
              <p>{stage.label}</p>
              <h2>{stage.value}</h2>
              <span>{stage.detail}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="dp-requests-card" aria-label="Protected request statuses">
        <div className="dp-requests-section-head">
          <p>Backend-owned states</p>
          <h2>Status labels must come from protected systems.</h2>
        </div>

        <div className="dp-requests-chip-grid">
          {protectedStatuses.map((status) => (
            <span className="dp-requests-chip" key={status}>
              {status}
            </span>
          ))}
        </div>
      </section>

      <section className="dp-requests-card dp-requests-pass-link" aria-label="Pass readiness link">
        <div>
          <p>Official pass</p>
          <h2>QR readiness belongs in your Traveler Pass.</h2>
          <span>
            Use the pass hub to view protected identity and QR readiness once backend verification exists.
          </span>
        </div>
        <Link className="dp-requests-secondary" href="/traveler/pass">
          View pass readiness
        </Link>
      </section>
    </TravelerAppShell>
  );
}
