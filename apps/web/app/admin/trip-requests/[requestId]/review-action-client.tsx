"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

type ReviewAction =
  | "approve-for-next-step"
  | "request-info"
  | "hold-review"
  | "reject";

type ReviewActionRecord = {
  action: ReviewAction;
  resultingStatus: string;
  backendOwnedReview: true;
  paymentUnlocked: false;
  qrGenerated: false;
  voucherIssued: false;
  operatorAssigned: false;
  fakeConfirmationAllowed: false;
  reviewedByUserId: string;
  reviewedByRole: string;
  reviewedAt: string;
  reason: string;
  note: string | null;
};

type SafetyLocks = {
  paymentUnlocked: false;
  qrGenerated: false;
  voucherIssued: false;
  operatorAssigned: false;
  fakeConfirmationAllowed: false;
};

type BookingDetail = {
  bookingCode: string;
  status: string;
  title: string;
  destinationName: string | null;
  routeCode: string | null;
  serviceDate: string | null;
  paxCount: number;
  currencyCode: string;
  estimatedAmount: string | null;
  confirmedAmount: string | null;
  operatorRegistryId: string | null;
  backendOwned: true;
  fakeBookingAllowed: false;
  flatOperatorListAllowed: false;
  commercialTermsAcceptanceRequired: true;
  governedOperatorFulfillmentRequired: true;
  createdAt: string;
  updatedAt: string;
};

type AdminReviewDetail = {
  success: true;
  authority: "backend";
  frontendOwnsAuthority: false;
  booking: BookingDetail;
  adminReviewState: ReviewActionRecord | null;
  adminReviewTrail: ReviewActionRecord[];
  safetyLocks: SafetyLocks;
};

type ReviewResult = {
  success: true;
  authority: "backend";
  frontendOwnsAuthority: false;
  bookingCode: string;
  previousStatus: string;
  currentStatus: string;
  reviewAction: ReviewActionRecord;
  safetyLocks: SafetyLocks;
};

type AdminTripRequestReviewClientProps = {
  requestId: string;
};

const reviewActions: Array<{
  action: ReviewAction;
  label: string;
  description: string;
  reason: string;
}> = [
  {
    action: "approve-for-next-step",
    label: "Approve for Next Step",
    description: "Moves request to pending confirmation only.",
    reason: "Admin reviewed request and approved it for the next confirmation step.",
  },
  {
    action: "request-info",
    label: "Request Info",
    description: "Keeps request open while asking for clarification.",
    reason: "Admin needs more traveler information before confirmation review can continue.",
  },
  {
    action: "hold-review",
    label: "Hold Review",
    description: "Keeps request in review without advancing commercial gates.",
    reason: "Admin placed this request on hold for internal review.",
  },
  {
    action: "reject",
    label: "Reject",
    description: "Rejects the request without payment, voucher, QR, or assignment.",
    reason: "Admin rejected this request during backend-owned review.",
  },
];

const lockedSafety: SafetyLocks = {
  paymentUnlocked: false,
  qrGenerated: false,
  voucherIssued: false,
  operatorAssigned: false,
  fakeConfirmationAllowed: false,
};

const styles: Record<string, CSSProperties> = {
  main: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 18% 12%, rgba(14, 165, 181, 0.18), transparent 30%), linear-gradient(135deg, #f6fbfc 0%, #eef7f9 45%, #fffaf0 100%)",
    padding: "32px 18px",
    color: "#102a43",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shell: {
    width: "100%",
    maxWidth: "1080px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    border: "1px solid #d8ebef",
    borderRadius: "28px",
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 18px 50px rgba(7,30,51,0.08)",
    padding: "22px",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  eyebrow: {
    margin: 0,
    color: "#0b6e7a",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
  h1: {
    margin: "8px 0 0",
    color: "#071e33",
    fontSize: "34px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
    fontWeight: 800,
  },
  copy: {
    margin: "10px 0 0",
    maxWidth: "680px",
    color: "#465a69",
    fontSize: "14px",
    lineHeight: 1.65,
  },
  backLink: {
    minHeight: "44px",
    borderRadius: "999px",
    border: "1px solid #c9dde3",
    background: "#ffffff",
    color: "#0b3552",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 18px",
    fontSize: "14px",
    fontWeight: 800,
    textDecoration: "none",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, 0.9fr)",
    gap: "18px",
  },
  label: {
    margin: 0,
    color: "#647887",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  bookingCode: {
    margin: "8px 0 0",
    color: "#071e33",
    fontSize: "24px",
    fontWeight: 800,
    wordBreak: "break-word",
  },
  stateBox: {
    marginTop: "18px",
    border: "1px solid #d8ebef",
    borderRadius: "22px",
    background: "#f8fafc",
    padding: "18px",
  },
  status: {
    margin: "8px 0 0",
    color: "#0b3552",
    fontSize: "20px",
    fontWeight: 800,
  },
  metaGrid: {
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },
  metaItem: {
    border: "1px solid #d8ebef",
    borderRadius: "16px",
    background: "#ffffff",
    padding: "12px 14px",
  },
  textarea: {
    width: "100%",
    marginTop: "8px",
    minHeight: "110px",
    resize: "vertical",
    border: "1px solid #c9dde3",
    borderRadius: "18px",
    background: "#ffffff",
    color: "#102a43",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  lockItem: {
    border: "1px solid #d8ebef",
    borderRadius: "18px",
    background: "#f6fbfc",
    color: "#0b3552",
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: 800,
  },
  actionsGrid: {
    marginTop: "18px",
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },
  actionButton: {
    border: "1px solid #d8ebef",
    borderRadius: "22px",
    background: "#ffffff",
    color: "#0b3552",
    padding: "18px",
    textAlign: "left",
    cursor: "pointer",
    boxShadow: "0 10px 28px rgba(7,30,51,0.06)",
  },
  actionLabel: {
    display: "block",
    color: "#0b3552",
    fontSize: "15px",
    fontWeight: 900,
  },
  actionDescription: {
    display: "block",
    marginTop: "8px",
    color: "#465a69",
    fontSize: "14px",
    lineHeight: 1.55,
  },
  error: {
    marginTop: "18px",
    border: "1px solid #fecaca",
    borderRadius: "18px",
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: 800,
  },
  success: {
    marginTop: "18px",
    border: "1px solid rgba(14,165,181,0.35)",
    borderRadius: "18px",
    background: "#eef7f9",
    color: "#263b4d",
    padding: "14px 16px",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  goldNotice: {
    marginTop: "16px",
    border: "1px solid rgba(215,168,59,0.45)",
    borderRadius: "18px",
    background: "#fffaf0",
    color: "#465a69",
    padding: "14px 16px",
    fontSize: "14px",
    lineHeight: 1.6,
  },
};

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "Not set";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatMoney(value: string | null, currencyCode: string): string {
  if (!value) {
    return "Not priced";
  }

  return `${currencyCode} ${value}`;
}

export function AdminTripRequestReviewClient({
  requestId,
}: AdminTripRequestReviewClientProps) {
  const bookingCode = decodeURIComponent(requestId);
  const [detail, setDetail] = useState<AdminReviewDetail | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState<ReviewAction | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const loadDetail = useCallback(async () => {
    setIsLoadingDetail(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/trip-bookings/intent/${encodeURIComponent(bookingCode)}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
          cache: "no-store",
        },
      );

      const payload = (await response.json()) as AdminReviewDetail | { message?: string };

      if (!response.ok) {
        throw new Error(
          "message" in payload && payload.message
            ? payload.message
            : "Unable to load backend request detail.",
        );
      }

      setDetail(payload as AdminReviewDetail);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load backend request detail.",
      );
    } finally {
      setIsLoadingDetail(false);
    }
  }, [bookingCode]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

  const currentStatus = useMemo(() => {
    return result?.currentStatus ?? detail?.booking.status ?? "REQUESTED";
  }, [detail, result]);

  const currentSafetyLocks = detail?.safetyLocks ?? result?.safetyLocks ?? lockedSafety;
  const reviewState = detail?.adminReviewState ?? result?.reviewAction ?? null;
  const reviewTrail = detail?.adminReviewTrail ?? [];
  const booking = detail?.booking;

  async function submitReviewAction(action: ReviewAction, reason: string) {
    setIsSubmitting(action);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/trip-bookings/intent/${encodeURIComponent(
          bookingCode,
        )}/review-action`,
        {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            action,
            reason,
            note: note.trim() || null,
          }),
        },
      );

      const payload = (await response.json()) as ReviewResult | { message?: string };

      if (!response.ok) {
        throw new Error(
          "message" in payload && payload.message
            ? payload.message
            : "Review action failed.",
        );
      }

      setResult(payload as ReviewResult);
      await loadDetail();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Review action failed.",
      );
    } finally {
      setIsSubmitting(null);
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.shell}>
        <section style={styles.card}>
          <div style={styles.hero}>
            <div>
              <p style={styles.eyebrow}>Backend-Owned Review</p>
              <h1 style={styles.h1}>Trip Request Review</h1>
              <p style={styles.copy}>
                This page now loads the live backend booking state before action.
                Review actions update the request lifecycle only; payment, voucher,
                QR, booking confirmation, and operator assignment remain locked
                behind separate backend gates.
              </p>
            </div>

            <Link href="/admin/trip-requests" style={styles.backLink}>
              Back to Requests
            </Link>
          </div>
        </section>

        <section style={styles.grid}>
          <div style={styles.card}>
            <p style={styles.label}>Booking Code</p>
            <h2 style={styles.bookingCode}>{bookingCode}</h2>

            <div style={styles.stateBox}>
              <p style={styles.label}>Current Backend State</p>
              <p style={styles.status}>
                {isLoadingDetail ? "Loading..." : formatStatus(currentStatus)}
              </p>
              {booking ? (
                <p style={styles.copy}>
                  {booking.title} · {booking.destinationName ?? "Destination not set"}
                </p>
              ) : (
                <p style={styles.copy}>
                  Backend detail has not loaded yet.
                </p>
              )}
            </div>

            {booking ? (
              <div style={styles.metaGrid}>
                {[
                  ["Pax", String(booking.paxCount)],
                  ["Route", booking.routeCode ?? "Not set"],
                  ["Service Date", formatDateTime(booking.serviceDate)],
                  ["Estimate", formatMoney(booking.estimatedAmount, booking.currencyCode)],
                ].map(([label, value]) => (
                  <div key={label} style={styles.metaItem}>
                    <p style={styles.label}>{label}</p>
                    <p style={{ margin: "6px 0 0", color: "#102a43", fontSize: "14px", fontWeight: 800 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {reviewState ? (
              <div style={styles.goldNotice}>
                Latest review: <strong>{reviewState.action}</strong> by{" "}
                {reviewState.reviewedByRole} at {formatDateTime(reviewState.reviewedAt)}.
              </div>
            ) : null}

            <label style={{ display: "block", marginTop: "18px" }}>
              <span style={{ color: "#263b4d", fontSize: "14px", fontWeight: 800 }}>
                Internal review note
              </span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                style={styles.textarea}
                placeholder="Optional note for the backend review trail."
              />
            </label>
          </div>

          <div style={styles.card}>
            <p style={styles.label}>Safety Locks</p>

            <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
              {[
                `Payment remains locked: ${String(currentSafetyLocks.paymentUnlocked)}`,
                `Voucher is not issued: ${String(currentSafetyLocks.voucherIssued)}`,
                `QR is not generated: ${String(currentSafetyLocks.qrGenerated)}`,
                `Operator is not assigned: ${String(currentSafetyLocks.operatorAssigned)}`,
                `Fake confirmation allowed: ${String(currentSafetyLocks.fakeConfirmationAllowed)}`,
              ].map((item) => (
                <div key={item} style={styles.lockItem}>
                  {item}
                </div>
              ))}
            </div>

            <div style={styles.goldNotice}>
              Review trail entries: {reviewTrail.length}
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <p style={styles.label}>Review Actions</p>
          <h2 style={{ margin: "8px 0 0", color: "#071e33", fontSize: "22px" }}>
            Choose one backend action
          </h2>

          <div style={styles.actionsGrid}>
            {reviewActions.map((item) => (
              <button
                key={item.action}
                type="button"
                disabled={isSubmitting !== null || isLoadingDetail}
                onClick={() => submitReviewAction(item.action, item.reason)}
                style={{
                  ...styles.actionButton,
                  opacity: isSubmitting !== null || isLoadingDetail ? 0.62 : 1,
                  cursor:
                    isSubmitting !== null || isLoadingDetail ? "not-allowed" : "pointer",
                }}
              >
                <span style={styles.actionLabel}>
                  {isSubmitting === item.action ? "Submitting..." : item.label}
                </span>
                <span style={styles.actionDescription}>{item.description}</span>
              </button>
            ))}
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}

          {result ? (
            <div style={styles.success}>
              <strong style={{ color: "#071e33" }}>Backend review recorded:</strong>{" "}
              {result.reviewAction.action} moved {result.bookingCode} from{" "}
              {formatStatus(result.previousStatus)} to{" "}
              {formatStatus(result.currentStatus)}.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}