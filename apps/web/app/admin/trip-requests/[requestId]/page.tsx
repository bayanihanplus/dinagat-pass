import Link from "next/link";

const reviewChecks = [
  {
    label: "Traveler request summary",
    value: "Ready for staff review",
  },
  {
    label: "Route and schedule",
    value: "Backend review required",
  },
  {
    label: "Payment eligibility",
    value: "Backend required",
  },
  {
    label: "Official QR readiness",
    value: "Backend required",
  },
  {
    label: "Local support assignment",
    value: "Backend required",
  },
];

const protectedActions = [
  "Approval status must come from backend review logic.",
  "Payment eligibility must stay locked until backend confirmation.",
  "Official QR readiness must stay unavailable until protected systems allow it.",
  "Local support assignment must not be shown from frontend-only data.",
];

export default async function AdminTripRequestDetailPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = await params;

  return (
    <main className="dp-admin-loop-shell">
      <section className="dp-admin-detail-hero">
        <div>
          <p className="dp-admin-loop-eyebrow">ADMIN REQUEST DETAIL</p>
          <h1>Review request</h1>
          <p>
            Inspect the traveler request and protected readiness checks without
            changing approval, payment, QR, or local support state.
          </p>
        </div>

        <div className="dp-admin-detail-reference">
          <span>Request reference</span>
          <strong>{requestId}</strong>
          <p>Frontend detail shell. Backend record binding comes later.</p>
        </div>
      </section>

      <section className="dp-admin-detail-grid">
        <article className="dp-admin-loop-panel dp-admin-detail-summary">
          <div className="dp-admin-loop-panel-header">
            <div>
              <p className="dp-admin-loop-eyebrow">REQUEST SNAPSHOT</p>
              <h2>Review summary</h2>
            </div>
            <span>Review only</span>
          </div>

          <div className="dp-admin-detail-summary-list">
            <div>
              <span>Trip type</span>
              <strong>Dinagat land route</strong>
            </div>
            <div>
              <span>Traveler count</span>
              <strong>2 guests</strong>
            </div>
            <div>
              <span>Requested date</span>
              <strong>Pending backend review</strong>
            </div>
            <div>
              <span>Current state</span>
              <strong>Backend review required</strong>
            </div>
          </div>
        </article>

        <article className="dp-admin-loop-panel dp-admin-detail-status">
          <div className="dp-admin-loop-panel-header">
            <div>
              <p className="dp-admin-loop-eyebrow">CONTROL LOCKS</p>
              <h2>Protected outcomes</h2>
            </div>
            <span>Backend-owned</span>
          </div>

          <div className="dp-admin-detail-lock-list">
            {reviewChecks.map((check) => (
              <div className="dp-admin-detail-lock" key={check.label}>
                <span>{check.label}</span>
                <strong>{check.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dp-admin-loop-panel">
        <div className="dp-admin-loop-panel-header">
          <div>
            <p className="dp-admin-loop-eyebrow">REVIEW SAFETY</p>
            <h2>What this page cannot do</h2>
          </div>
          <span>No fake states</span>
        </div>

        <div className="dp-admin-detail-warning-grid">
          {protectedActions.map((item) => (
            <div className="dp-admin-detail-warning" key={item}>
              <span>Locked</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dp-admin-detail-actions" aria-label="Admin request detail actions">
        <Link href="/admin/trip-requests">Back to review queue</Link>
        <Link href="/traveler/requests/sample-request">Open traveler-safe detail</Link>
        <button type="button" disabled>
          Backend action locked
        </button>
      </section>
    </main>
  );
}