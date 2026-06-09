# 01 REPO BOOTSTRAP DECISION

## Decision

Create a clean standalone repository:

dinagat-pass

Location:

$HOME\Projects\dinagat-pass

## Boundaries

This repository must not be created inside or coupled to:

- One Siargao Pass — reference-only architecture input; not a parent app, not shared runtime, anti-drift boundary.
- Nomad Academy — forbidden foreign app/runtime reference for Dinagat Pass; anti-drift boundary.
- CABrainworks — forbidden foreign app/runtime reference for Dinagat Pass; anti-drift boundary.
- Any existing production repo

## Current bootstrap scope

Allowed in this lane:

- repository shell
- anchor docs
- UI/UX doctrine docs
- design-system doctrine docs
- app placeholder folders
- shared package placeholder
- infra and scripts folders

Not allowed in this lane:

- frontend page scaffolding
- backend implementation
- database schema
- auth implementation
- deployment setup
- git commit command

## Next decision required

Before implementation starts, run:

DINAGAT-PASS-APP-STACK-DECISION-01  
Standalone App Stack Decision: Backend, Frontend, Database, Auth, Deployment

