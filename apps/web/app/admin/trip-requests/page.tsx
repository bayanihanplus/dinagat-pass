"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type ReviewAction =
  | "approve-for-next-step"
  | "request-info"
  | "hold-review"
  | "reject";

type ReviewActionRecord = {
  action: ReviewAction;
  resultingStatus: string;
  reviewedByRole: string;
  reviewedAt: string;
};

type SafetyLocks = {
  paymentUnlocked: false;
  qrGenerated: false;
  voucherIssued: false;
  operatorAssigned: false;
  fakeConfirmationAllowed: false;
};

type AdminRequestListItem = {
  bookingCode: string;
  title: string;
  destinationName: string | null;
  serviceDate: string | null;
  paxCount: number;
  productType: string;
  sourceChannel: string;
  pricingMode: string;
  status: string;
  latestReview: ReviewActionRecord | null;
  createdAt: string;
  updatedAt: string;
};

type AdminRequestListResponse = {
  success: true;
  authority: "backend";
  frontendOwnsAuthority: false;
  total: number;
  requests: AdminRequestListItem[];
  safetyLocks: SafetyLocks;
};

const reviewActionLabels: Record<ReviewAction, string> = {
  "approve-for-next-step": "Approved for next step",
  "request-info": "More information requested",
  "hold-review": "Review placed on hold",
  reject: "Request rejected",
};

function formatStatus(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function formatDate(value: string | null): string {
  if (!value) {
    return "Date not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export default function AdminTripRequestsPage() {
  const [data, setData] =
    useState<AdminRequestListResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/admin/trip-bookings/intents",
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as
        | AdminRequestListResponse
        | {
            message?: string;
          };

      if (!response.ok) {
        throw new Error(
          "message" in payload && payload.message
            ? payload.message
            : "Unable to load the backend request queue.",
        );
      }

      setData(payload as AdminRequestListResponse);
    } catch (caughtError) {
      setData(null);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load the backend request queue.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const requests = data?.requests ?? [];

  const awaitingReviewCount = useMemo(
    () =>
      requests.filter(
        (request) => request.latestReview === null,
      ).length,
    [requests],
  );

  const reviewedCount = useMemo(
    () =>
      requests.filter(
        (request) => request.latestReview !== null,
      ).length,
    [requests],
  );

  const safetyLocks = data?.safetyLocks;

  return (
    <main className="dp-admin-loop-shell">
      <section className="dp-admin-loop-hero">
        <div>
          <p className="dp-admin-loop-eyebrow">
            DINAGAT PASS ADMIN REVIEW
          </p>

          <h1>Trip Request Review Queue</h1>

          <p>
            Review current traveler requests using live
            backend-owned status and review information.
            Payment, QR, voucher, confirmation, and operator
            assignment remain controlled by separate backend
            gates.
          </p>
        </div>

        <div className="dp-admin-loop-state-card">
          <span>Queue authority</span>
          <strong>Backend-owned</strong>
          <p>
            Refresh the queue to load the latest persisted
            request state.
          </p>

          <button
            type="button"
            onClick={() => void loadRequests()}
            disabled={isLoading}
            style={{
              marginTop: "12px",
              minHeight: "42px",
              border: "1px solid #c9dde3",
              borderRadius: "999px",
              background: "#ffffff",
              color: "#0b3552",
              padding: "0 18px",
              fontSize: "14px",
              fontWeight: 800,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.65 : 1,
            }}
          >
            {isLoading ? "Refreshing..." : "Refresh queue"}
          </button>
        </div>
      </section>

      <section
        className="dp-admin-loop-metrics"
        aria-label="Request review summary"
      >
        {[
          {
            label: "Requests returned",
            value: isLoading
              ? "Loading"
              : String(data?.total ?? 0),
            note: "Count returned by the backend list.",
          },
          {
            label: "Awaiting first review",
            value: isLoading
              ? "Loading"
              : String(awaitingReviewCount),
            note: "Requests without a recorded review action.",
          },
          {
            label: "Reviewed requests",
            value: isLoading
              ? "Loading"
              : String(reviewedCount),
            note: "Requests with backend review history.",
          },
        ].map((metric) => (
          <article
            className="dp-admin-loop-metric"
            key={metric.label}
          >
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="dp-admin-loop-panel">
        <div className="dp-admin-loop-panel-header">
          <div>
            <p className="dp-admin-loop-eyebrow">
              REQUEST QUEUE
            </p>

            <h2>Review incoming requests</h2>
          </div>

          <span>
            {data?.authority === "backend"
              ? "Live backend data"
              : "Backend connection required"}
          </span>
        </div>

        {error ? (
          <div
            role="alert"
            style={{
              marginTop: "18px",
              border: "1px solid #fecaca",
              borderRadius: "18px",
              background: "#fef2f2",
              color: "#b91c1c",
              padding: "14px 16px",
              fontSize: "14px",
              fontWeight: 800,
            }}
          >
            {error}
          </div>
        ) : null}

        {!error && !isLoading && requests.length === 0 ? (
          <div
            style={{
              marginTop: "18px",
              border: "1px solid #d8ebef",
              borderRadius: "20px",
              background: "#f8fafc",
              padding: "22px",
              color: "#465a69",
            }}
          >
            No traveler requests are currently available.
          </div>
        ) : null}

        <div className="dp-admin-loop-list">
          {requests.map((request) => (
            <article
              className="dp-admin-loop-row"
              key={request.bookingCode}
            >
              <div className="dp-admin-loop-row-main">
                <span>{request.bookingCode}</span>

                <h3>{request.title}</h3>

                <p>
                  {request.destinationName ??
                    "Destination not set"}{" "}
                  / {formatDate(request.serviceDate)} /{" "}
                  {request.paxCount}{" "}
                  {request.paxCount === 1
                    ? "traveler"
                    : "travelers"}
                </p>

                <p>
                  Updated {formatDateTime(request.updatedAt)}
                </p>
              </div>

              <div className="dp-admin-loop-row-state">
                <strong>
                  {formatStatus(request.status)}
                </strong>

                <span>
                  {request.latestReview
                    ? reviewActionLabels[
                        request.latestReview.action
                      ]
                    : "No review action recorded"}
                </span>

                {request.latestReview ? (
                  <span>
                    {formatDateTime(
                      request.latestReview.reviewedAt,
                    )}
                  </span>
                ) : null}
              </div>

              <div className="dp-admin-loop-row-actions">
                <Link
                  href={`/admin/trip-requests/${encodeURIComponent(
                    request.bookingCode,
                  )}`}
                >
                  Open review detail
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dp-admin-loop-panel">
        <div className="dp-admin-loop-panel-header">
          <div>
            <p className="dp-admin-loop-eyebrow">
              PROTECTED STATES
            </p>

            <h2>Commercial and operational gates</h2>
          </div>

          <span>Backend safety locks</span>
        </div>

        <div className="dp-admin-loop-lock-grid">
          {[
            {
              label: "Payment readiness",
              locked:
                safetyLocks?.paymentUnlocked === false,
            },
            {
              label: "Voucher issuance",
              locked:
                safetyLocks?.voucherIssued === false,
            },
            {
              label: "Official QR",
              locked:
                safetyLocks?.qrGenerated === false,
            },
            {
              label: "Operator assignment",
              locked:
                safetyLocks?.operatorAssigned === false,
            },
          ].map((item) => (
            <div
              className="dp-admin-loop-lock"
              key={item.label}
            >
              <span>{item.label}</span>

              <strong>
                {item.locked
                  ? "Locked by backend"
                  : "Backend state unavailable"}
              </strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
