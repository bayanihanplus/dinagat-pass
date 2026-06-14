import Link from "next/link";

import { TravelerAppShell } from "../../_components/TravelerAppShell";

const reviewSteps = [
  {
    label: "Request received",
    value: "Traveler details captured",
    detail: "Destination, trip type, date, group size, and notes are used only after backend review exists.",
  },
  {
    label: "Review required",
    value: "Backend status pending",
    detail: "Approval, pricing, route support, and fulfillment readiness must come from protected systems.",
  },
  {
    label: "Next step locked",
    value: "Payment and QR unavailable",
    detail: "Payment, QR readiness, access, and operator assignment stay locked until backend approval.",
  },
];

const protectedItems = [
  "Approval status",
  "Payment eligibility",
  "Official QR readiness",
  "Operator or local support assignment",
];

type RequestDetailPageProps = {
  params: Promise<{
    requestId: string;
  }>;
};

function formatRequestReference(value: string) {
  return value
    .replace(/[^a-zA-Z0-9-]/g, "")
    .slice(0, 28)
    .toUpperCase();
}

export default async function TravelerRequestDetailPage({ params }: RequestDetailPageProps) {
  const { requestId } = await params;
  const requestReference = formatRequestReference(requestId || "REQUEST");

  return (
    <TravelerAppShell activeTab="requests">
      <section className="dp-request-detail-hero" aria-labelledby="request-detail-title">
        <div className="dp-request-detail-kicker">Request Detail</div>
        <h1 id="request-detail-title">Review protected next steps</h1>
        <p>
          Request reference {requestReference} is shown as a safe detail shell while backend review
          owns approval, payment, QR, and fulfillment truth.
        </p>
      </section>

      <section className="dp-request-detail-card dp-request-detail-summary" aria-label="Request detail summary">
        <div className="dp-request-detail-status">
          <span aria-hidden="true" />
          <strong>Backend review required</strong>
        </div>

        <div className="dp-request-detail-copy">
          <p>Current state</p>
          <h2>No approved request shown</h2>
          <span>
            This screen does not approve the request, unlock payment, generate a QR, or assign an operator.
          </span>
        </div>
      </section>

      <section className="dp-request-detail-timeline" aria-label="Request detail review flow">
        {reviewSteps.map((step, index) => (
          <article className="dp-request-detail-step" key={step.label}>
            <div className="dp-request-detail-step-index">{index + 1}</div>
            <div>
              <p>{step.label}</p>
              <h2>{step.value}</h2>
              <span>{step.detail}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="dp-request-detail-card" aria-label="Backend-owned protected items">
        <div className="dp-request-detail-section-head">
          <p>Protected systems</p>
          <h2>These states must come from the backend</h2>
        </div>

        <div className="dp-request-detail-chip-grid">
          {protectedItems.map((item) => (
            <span className="dp-request-detail-chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="dp-request-detail-actions" aria-label="Request detail actions">
        <Link className="dp-request-detail-action" href="/traveler/requests">
          Back to requests
        </Link>
        <Link className="dp-request-detail-secondary" href="/traveler/pass">
          View pass readiness
        </Link>
      </section>
    </TravelerAppShell>
  );
}


