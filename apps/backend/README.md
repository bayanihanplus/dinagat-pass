# Dinagat Pass Backend

NestJS + Fastify backend authority shell.

Current completed backend foundation:

- AppConfigModule
- PrismaModule
- PrismaService
- HealthController
- backend health contract at `/health`
- real database readiness check through Prisma

Local database:

- PostgreSQL Docker container: `dinagat-pass-postgres`
- Host port: `55432`
- Container port: `5432`

Implemented health behavior:

- `/health` performs a lightweight Prisma `SELECT 1`
- reports database connected/degraded status
- confirms backend authority doctrine
- does not execute product workflow logic

Not implemented yet:

- seed
- auth
- QR validation
- booking lifecycle
- payment readiness logic
- operator capability logic
- marketplace exposure logic
- product UI

Hard rule:

The backend is the authority layer. Future frontend surfaces must display backend truth.