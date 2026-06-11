'use client';

import { FormEvent, useMemo, useState } from 'react';

type RequestState = 'idle' | 'submitting' | 'submitted' | 'error';

type BookingResponse = {
  bookingCode?: string;
  status?: string;
  backendOwned?: boolean;
  frontendMayOnlyRequestIntent?: boolean;
  fakeBookingAllowed?: boolean;
  message?: string;
};

function getTravelerSafeBookingError(status: number, message?: string): string {
  const normalizedMessage = message?.toLowerCase() ?? '';

  if (
    status === 401 ||
    status === 403 ||
    normalizedMessage.includes('forbidden') ||
    normalizedMessage.includes('unauthorized')
  ) {
    return 'Please sign in before requesting backend review.';
  }

  if (status >= 500) {
    return 'The booking service is online but could not review this request yet. Please try again shortly.';
  }

  return message || 'Booking request was not accepted. Please check the details and try again.';
}

const productTypes = [
  {
    value: 'GOVERNED_TOUR',
    label: 'Governed tour request',
    helper: 'For reviewed island routes, guided stops, or coordinated local services.',
  },
  {
    value: 'SITE_ACCESS_SUPPORT',
    label: 'Site access support',
    helper: 'For access points, visit coordination, or controlled entry support.',
  },
  {
    value: 'LOCAL_SERVICE_REQUEST',
    label: 'Local service request',
    helper: 'For local partner support where approval and confirmation are required.',
  },
];

const pricingModes = [
  {
    value: 'REQUEST_TO_CONFIRM',
    label: 'Request to confirm',
    helper: 'Best for MVP. Backend reviews availability, readiness, and terms before payment.',
  },
  {
    value: 'PRICE_TO_CONFIRM',
    label: 'Price to confirm',
    helper: 'Use when the traveler needs a quoted price before checkout.',
  },
];

export default function TravelerTripBookingPage() {
  const [productType, setProductType] = useState(productTypes[0]?.value ?? 'GOVERNED_TOUR');
  const [pricingMode, setPricingMode] = useState(pricingModes[0]?.value ?? 'REQUEST_TO_CONFIRM');
  const [title, setTitle] = useState('Dinagat trip request');
  const [notes, setNotes] = useState('');
  const [state, setState] = useState<RequestState>('idle');
  const [error, setError] = useState('');
  const [showSignInCta, setShowSignInCta] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);

  const selectedProduct = useMemo(
    () => productTypes.find((item) => item.value === productType) ?? productTypes[0],
    [productType],
  );

  const selectedPricing = useMemo(
    () => pricingModes.find((item) => item.value === pricingMode) ?? pricingModes[0],
    [pricingMode],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setState('submitting');
    setError('');
    setShowSignInCta(false);
    setResult(null);

    try {
      const response = await fetch('/api/trip-bookings/intent', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productType,
          pricingMode,
          title: title.trim() || 'Dinagat trip request',
          travelerRequestJson: {
            notes: notes.trim(),
            source: 'traveler-trip-booking-frontend-foundation',
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as BookingResponse | null;

      if (!response.ok) {
        setState('error');
        setError(getTravelerSafeBookingError(response.status, data?.message));
        setShowSignInCta(response.status === 401 || response.status === 403);
        return;
      }

      setResult(data);
      setState('submitted');
    } catch {
      setState('error');
      setError('Could not reach the booking service. Please try again when the backend is running.');
    }
  }

  return (
    <main className="dp-booking-shell">
      <section className="dp-booking-wrap">
        <div className="dp-booking-hero">
          <div className="dp-booking-hero-grid">
            <div>
              <div className="dp-kicker">Dinagat Pass Trip Request</div>
              <h1 className="dp-title">Request a governed trip.</h1>
              <p className="dp-lede">
                Submit intent only. Dinagat Pass checks route readiness, partner terms, pricing,
                and confirmation before any payment or QR is issued.
              </p>
            </div>

            <div className="dp-authority-card">
              <p className="dp-authority-title">Backend-owned booking</p>
              <p className="dp-authority-copy">
                No fake confirmation. No operator dump. No frontend-owned payment.
              </p>
            </div>
          </div>
        </div>

        <div className="dp-booking-grid">
          <form onSubmit={handleSubmit} className="dp-panel">
            <div>
              <h2 className="dp-panel-title">Trip request details</h2>
              <p className="dp-panel-copy">
                Keep it direct. The backend will decide whether this can move to payment readiness.
              </p>
            </div>

            <div className="dp-form-grid">
              <label className="dp-field">
                <span className="dp-label">Request title</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="dp-input"
                  placeholder="Example: Sunday Dinagat island route request"
                />
              </label>

              <label className="dp-field">
                <span className="dp-label">Request type</span>
                <select
                  value={productType}
                  onChange={(event) => setProductType(event.target.value)}
                  className="dp-select"
                >
                  {productTypes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <span className="dp-helper">{selectedProduct?.helper}</span>
              </label>

              <label className="dp-field">
                <span className="dp-label">Pricing mode</span>
                <select
                  value={pricingMode}
                  onChange={(event) => setPricingMode(event.target.value)}
                  className="dp-select"
                >
                  {pricingModes.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <span className="dp-helper">{selectedPricing?.helper}</span>
              </label>

              <label className="dp-field">
                <span className="dp-label">Notes</span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="dp-textarea"
                  placeholder="Preferred date, pax count, route idea, pickup area, or special needs."
                />
              </label>
            </div>

            {state === 'error' ? (
              <div className="dp-alert dp-alert-error">
                <p className="dp-alert-title">{error}</p>
                {showSignInCta ? (
                  <a className="dp-alert-action" href="/login">
                    Sign in to continue
                  </a>
                ) : null}
              </div>
            ) : null}

            {state === 'submitted' ? (
              <div className="dp-alert dp-alert-success">
                <p className="dp-alert-title">Request received by backend.</p>
                <p className="dp-alert-copy">
                  Booking code: {result?.bookingCode || 'Pending backend response'}
                </p>
              </div>
            ) : null}

            <button type="submit" disabled={state === 'submitting'} className="dp-submit">
              {state === 'submitting' ? 'Requesting backend review...' : 'Request backend review'}
            </button>
          </form>

          <aside className="dp-aside">
            <div className="dp-panel">
              <h2 className="dp-panel-title">What happens next</h2>
              <div className="dp-step-list">
                <div className="dp-step">
                  <p className="dp-step-title">1. Intent only</p>
                  <p className="dp-step-copy">
                    Traveler submits a request. No booking is confirmed here.
                  </p>
                </div>
                <div className="dp-step">
                  <p className="dp-step-title">2. Backend review</p>
                  <p className="dp-step-copy">
                    Readiness, terms, route, pricing, and fulfillment are checked server-side.
                  </p>
                </div>
                <div className="dp-step">
                  <p className="dp-step-title">3. Confirmation path</p>
                  <p className="dp-step-copy">
                    Payment or QR logic opens only after backend readiness allows it.
                  </p>
                </div>
              </div>
            </div>

            <div className="dp-guardrail-panel">
              <p className="dp-guardrail-kicker">MVP guardrails</p>
              <div className="dp-guardrails">
                <span className="dp-guardrail">No fake payment</span>
                <span className="dp-guardrail">No fake QR</span>
                <span className="dp-guardrail">No public operator dump</span>
                <span className="dp-guardrail">No frontend-owned auth</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}


