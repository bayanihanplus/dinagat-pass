import { DINAGAT_AUTH_BOUNDARY } from "../../lib/auth-boundary";

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f6fbff 0%, #edf8f7 48%, #ffffff 100%)",
        color: "#10243e",
        padding: "32px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "460px",
          border: "1px solid rgba(15, 84, 102, 0.16)",
          borderRadius: "28px",
          background: "rgba(255, 255, 255, 0.92)",
          boxShadow: "0 24px 80px rgba(15, 54, 84, 0.12)",
          padding: "28px"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: "999px",
            padding: "8px 12px",
            background: "#e9f7f5",
            color: "#0b6f7a",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          Backend-owned auth
        </div>

        <h1
          style={{
            margin: "18px 0 10px",
            fontSize: "32px",
            lineHeight: 1.05,
            letterSpacing: "-0.04em"
          }}
        >
          Sign in to Dinagat Pass
        </h1>

        <p
          style={{
            margin: 0,
            color: "#526173",
            fontSize: "15px",
            lineHeight: 1.65
          }}
        >
          The login boundary is ready. The frontend will not issue tokens, create
          accounts, or fake access. Real session authority will come from the
          backend.
        </p>

        <div
          style={{
            marginTop: "22px",
            display: "grid",
            gap: "10px"
          }}
        >
          <button
            disabled
            style={{
              border: 0,
              borderRadius: "18px",
              padding: "15px 16px",
              background: "#123a5d",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 800,
              opacity: 0.76,
              cursor: "not-allowed"
            }}
          >
            Backend login endpoint pending
          </button>

          <div
            style={{
              borderRadius: "18px",
              border: "1px solid rgba(15, 84, 102, 0.14)",
              background: "#f8fbfc",
              padding: "14px",
              color: "#5b6b7d",
              fontSize: "13px",
              lineHeight: 1.55
            }}
          >
            Signup is not enabled. Traveler, operator, LGU, and admin access
            will be issued through backend-controlled sessions.
          </div>
        </div>

        <dl
          style={{
            margin: "20px 0 0",
            display: "grid",
            gap: "8px",
            color: "#607184",
            fontSize: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <dt>Frontend authority</dt>
            <dd style={{ margin: 0, fontWeight: 800 }}>
              {String(DINAGAT_AUTH_BOUNDARY.frontendOwnsAuthority)}
            </dd>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <dt>Signup</dt>
            <dd style={{ margin: 0, fontWeight: 800 }}>
              {String(DINAGAT_AUTH_BOUNDARY.publicSignupCreated)}
            </dd>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <dt>Fake dashboard auth</dt>
            <dd style={{ margin: 0, fontWeight: 800 }}>
              {String(DINAGAT_AUTH_BOUNDARY.fakeDashboardAuthAllowed)}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
