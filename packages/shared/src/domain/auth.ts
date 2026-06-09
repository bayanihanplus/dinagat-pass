export enum DinagatAuthCredentialStatus {
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
  ROTATED = "ROTATED"
}

export enum DinagatAuthSessionStatus {
  ACTIVE = "ACTIVE",
  REVOKED = "REVOKED",
  EXPIRED = "EXPIRED"
}

export const DINAGAT_AUTH_DOCTRINE = {
  backendOwned: true,
  frontendOwnsAuthority: false,
  passwordHashingRequired: true,
  roleGuardRequired: true,
  capabilityGuardRequired: true,
  auditPrivilegedActions: true
} as const;