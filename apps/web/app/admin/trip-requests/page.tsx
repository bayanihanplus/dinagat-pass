import Link from "next/link";

const requestQueue = [
  {
    reference: "DGT-REQ-2401",
    route: "Dinagat land route",
    traveler: "Traveler request",
    date: "Requested date pending review",
    guests: "2 guests",
    state: "Backend review required",
    lock: "Approval locked",
    href: "/admin/trip-requests/sample-request",
  },
  {
    reference: "DGT-REQ-2402",
    route: "Island hopping",
    traveler: "Traveler request",
    date: "Requested date pending review",
    guests: "4 guests",
    state: "Readiness check needed",
    lock: "QR unavailable",
    href: "/admin/trip-requests/sample-request",
  },
  {
    reference: "DGT-REQ-2403",
    route: "Local transfer",
    traveler: "Traveler request",
    date: "Requested date pending review",
    guests: "1 guest",
    state: "Support review pending",
    lock: "Local support locked",
    href: "/admin/trip-requests/sample-request",
  },
];

const reviewMetrics = [
  {
    label: "Incoming requests",
    value: "3",
    note: "Visible queue foundation only.",
  },
  {
    label: "Payment eligibility",
    value: "Backend required",
    note: "This UI cannot unlock payment.",
  },
  {
    label: "Official QR readiness",
    value: "Unavailable",
    note: "QR state stays protected.",
  },
];

export default function AdminTripRequestsPage() {
  return (
    <main className="dp-admin-loop-shell">
      <section className="dp-admin-loop-hero">
        <div>
          <p className="dp-admin-loop-eyebrow">DINAGAT PASS ADMIN REVIEW</p>
          <h1>Trip Request Review Queue</h1>
          <p>
            Review incoming traveler requests without exposing approval, payment,
            QR, or local support outcomes until backend systems confirm them.
          </p>
        </div>

        <div className="dp-admin-loop-state-card">
          <span>Visible loop</span>
          <strong>Queue first</strong>
          <p>Traveler request surfaces now connect to an admin review surface.</p>
        </div>
      </section>

      <section className="dp-admin-loop-metrics" aria-label="Request review summary">
        {reviewMetrics.map((metric) => (
          <article className="dp-admin-loop-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="dp-admin-loop-panel">
        <div className="dp-admin-loop-panel-header">
          <div>
            <p className="dp-admin-loop-eyebrow">REQUEST QUEUE</p>
            <h2>Review incoming requests</h2>
          </div>
          <span>Frontend foundation</span>
        </div>

        <div className="dp-admin-loop-list">
          {requestQueue.map((request) => (
            <article className="dp-admin-loop-row" key={request.reference}>
              <div className="dp-admin-loop-row-main">
                <span>{request.reference}</span>
                <h3>{request.route}</h3>
                <p>
                  {request.traveler} / {request.date} / {request.guests}
                </p>
              </div>

              <div className="dp-admin-loop-row-state">
                <strong>{request.state}</strong>
                <span>{request.lock}</span>
              </div>

              <div className="dp-admin-loop-row-actions">
                <Link href={request.href}>Open review detail</Link>
                <Link href="/traveler/requests/sample-request">
                  Traveler-safe view
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dp-admin-loop-panel">
        <div className="dp-admin-loop-panel-header">
          <div>
            <p className="dp-admin-loop-eyebrow">PROTECTED STATES</p>
            <h2>Backend truth stays locked</h2>
          </div>
          <span>No operational mutation</span>
        </div>

        <div className="dp-admin-loop-lock-grid">
          <div className="dp-admin-loop-lock">
            <span>Approval status</span>
            <strong>Backend required</strong>
          </div>
          <div className="dp-admin-loop-lock">
            <span>Payment eligibility</span>
            <strong>Backend required</strong>
          </div>
          <div className="dp-admin-loop-lock">
            <span>Official QR readiness</span>
            <strong>Backend required</strong>
          </div>
          <div className="dp-admin-loop-lock">
            <span>Local support assignment</span>
            <strong>Backend required</strong>
          </div>
        </div>
      </section>
    </main>
  );
}