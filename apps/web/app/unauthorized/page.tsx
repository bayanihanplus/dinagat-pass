import { DINAGAT_AUTH_BOUNDARY } from "../../lib/auth-boundary";

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(15, 139, 155, 0.16), transparent 34%), linear-gradient(135deg, #f6fbff 0%, #edf8f7 48%, #ffffff 100%)",
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
          maxWidth: "520px",
          border: "1px solid rgba(15, 84, 102, 0.16)",
          borderRadius: "30px",
          background: "rgba(255, 255, 255, 0.94)",
          boxShadow: "0 24px 90px rgba(15, 54, 84, 0.12)",
          padding: "28px"
        }}
      >
        <div
          style={{
            display: "inline-flex",
            borderRadius: "999px",
            padding: "8px 12px",
            background: "#fff4df",
            color: "#8a5a00",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          Role required
        </div>

        <h1
          style={{
            margin: "18px 0 10px",
            fontSize: "32px",
            lineHeight: 1.05,
            letterSpacing: "-0.04em"
          }}
        >
          This area needs a different Dinagat Pass role.
        </h1>

        <p
          style={{
            margin: 0,
            color: "#526173",
            fontSize: "15px",
            lineHeight: 1.65
          }}
        >
          Your session is valid, but this protected surface is assigned to another
          access role. Use the correct workspace or ask an authorized administrator
          to review your access.
        </p>

        <div
          style={{
            marginTop: "22px",
            display: "grid",
            gap: "10px"
          }}
        >
          <a
            href="/login?mode=returning"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              borderRadius: "18px",
              padding: "15px 16px",
              background: "#123a5d",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 800,
              boxShadow: "0 16px 38px rgba(18, 58, 93, 0.18)"
            }}
          >
            Return to sign in
          </a>

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
            Dinagat Pass keeps authentication backend-owned. This page does not
            issue tokens, open new access, or grant authority from the frontend.
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <dt>Session authority</dt>
            <dd style={{ margin: 0, fontWeight: 800 }}>Backend</dd>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <dt>Frontend authority</dt>
            <dd style={{ margin: 0, fontWeight: 800 }}>
              {String(DINAGAT_AUTH_BOUNDARY.frontendOwnsAuthority)}
            </dd>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
            <dt>Reason</dt>
            <dd style={{ margin: 0, fontWeight: 800 }}>role-required</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
