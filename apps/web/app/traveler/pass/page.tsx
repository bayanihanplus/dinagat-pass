import { TravelerAppShell } from "../_components/TravelerAppShell";

const passChecks = [
  {
    label: "Identity",
    title: "Traveler account required",
    copy: "The official pass links to backend session and verified traveler records.",
  },
  {
    label: "QR readiness",
    title: "Pending backend verification",
    copy: "No QR is generated in the browser. QR issuance stays protected.",
  },
  {
    label: "Trip requests",
    title: "Request-to-confirm",
    copy: "Booking, payment, access, and fulfillment remain backend-owned.",
  },
];

const protectedControls = [
  "Official QR issuance",
  "Site access validation",
  "Boarding or movement permission",
  "Passport stamps and visit proof",
];

export default function TravelerPassPage() {
  return (
    <TravelerAppShell activeTab="pass">
      <section className="dp-pass-hero">
        <div>
          <p className="dp-true-app-kicker">Official traveler pass</p>
          <h1>Your Dinagat Pass</h1>
          <p>
            Keep identity, QR readiness, and trip request status in one protected
            traveler surface.
          </p>
        </div>

        <div className="dp-pass-status-pill">
          <span aria-hidden="true">{"\u25CF"}</span>
          Backend verification required
        </div>
      </section>

      <section className="dp-pass-qr-card">
        <div className="dp-pass-qr-visual" aria-hidden="true">
          <div className="dp-pass-qr-rings">
            <span>DP</span>
          </div>
        </div>

        <div className="dp-pass-section-copy">
          <p className="dp-true-app-kicker">Traveler QR</p>
          <h2>Available after backend verification</h2>
          <p>
            This screen does not create a QR, approve access, confirm payment,
            or assign an operator.
          </p>
        </div>
      </section>

      <section className="dp-pass-stack" aria-label="Pass readiness">
        {passChecks.map((item) => (
          <article className="dp-pass-state-card" key={item.title}>
            <p>{item.label}</p>
            <h2>{item.title}</h2>
            <span>{item.copy}</span>
          </article>
        ))}
      </section>

      <section className="dp-pass-control-card">
        <div className="dp-pass-control-icon" aria-hidden="true">
          {"\u26E8"}
        </div>

        <div className="dp-pass-section-copy">
          <p className="dp-true-app-kicker">Protected controls</p>
          <h2>What this pass will control</h2>
        </div>

        <div className="dp-pass-chip-grid">
          {protectedControls.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="dp-pass-request-card">
        <p className="dp-true-app-kicker">Need a trip reviewed?</p>
        <h2>Start with a request, not a fake confirmation.</h2>
        <p>
          Dinagat Pass will keep booking, payment, QR, and fulfillment protected.
        </p>
        <a href="/traveler/trip-booking">Request trip review</a>
      </section>
    </TravelerAppShell>
  );
}