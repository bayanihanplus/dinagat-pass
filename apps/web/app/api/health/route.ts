export async function GET() {
  return Response.json({
    app: "Dinagat Pass Web",
    status: "ok",
    lane: "DINAGAT-PASS-MONOREPO-SCAFFOLD-01",
    doctrine: {
      standalone: true,
      ospRelationship: "architectural-reference-only",
      frontendAuthority: false
    }
  });
}
