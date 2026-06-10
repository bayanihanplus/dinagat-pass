import { DINAGAT_AUTH_BOUNDARY } from "../../../lib/auth-boundary";

export default function TravelerHomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6fbff",
        color: "#10243e",
        padding: "28px 18px"
      }}
    >
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          border: "1px solid rgba(15, 84, 102, 0.16)",
          borderRadius: "26px",
          background: "#ffffff",
          boxShadow: "0 20px 60px rgba(15, 54, 84, 0.10)",
          padding: "24px"
        }}
      >
        <p
          style={{
            margin: "0 0 10px",
            color: "#0b6f7a",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          Protected route prepared
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            lineHeight: 1.1,
            letterSpacing: "-0.035em"
          }}
        >
          Traveler home requires backend session authority.
        </h1>

        <p
          style={{
            margin: "14px 0 0",
            color: "#5b6b7d",
            fontSize: "15px",
            lineHeight: 1.65
          }}
        >
          This route is intentionally not a fake dashboard. Middleware redirects
          unauthenticated access to login until the backend session cookie is
          implemented.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gap: "10px",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))"
          }}
        >
          <div
            style={{
              borderRadius: "18px",
              background: "#f8fbfc",
              border: "1px solid rgba(15, 84, 102, 0.12)",
              padding: "14px"
            }}
          >
            <strong>Authority</strong>
            <p style={{ margin: "6px 0 0", color: "#607184", fontSize: "13px" }}>
              Backend-owned only
            </p>
          </div>

          <div
            style={{
              borderRadius: "18px",
              background: "#f8fbfc",
              border: "1px solid rgba(15, 84, 102, 0.12)",
              padding: "14px"
            }}
          >
            <strong>Frontend tokens</strong>
            <p style={{ margin: "6px 0 0", color: "#607184", fontSize: "13px" }}>
              Not issued here
            </p>
          </div>

          <div
            style={{
              borderRadius: "18px",
              background: "#f8fbfc",
              border: "1px solid rgba(15, 84, 102, 0.12)",
              padding: "14px"
            }}
          >
            <strong>Lane</strong>
            <p style={{ margin: "6px 0 0", color: "#607184", fontSize: "13px" }}>
              {DINAGAT_AUTH_BOUNDARY.lane}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
