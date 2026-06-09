export interface CreateSessionInput {
  email: string;
  password: string;
}

export interface CreateSessionResult {
  userId: string;
  email: string;
  role: string;
  sessionToken: string;
  expiresAt: string;
  sessionIssued: true;
}