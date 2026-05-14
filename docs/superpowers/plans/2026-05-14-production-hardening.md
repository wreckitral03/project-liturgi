# Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing NestJS backend, Expo web frontend, and Docker setup safer and more production-oriented without changing the product surface.

**Architecture:** Keep the current app modules intact. Move environment parsing into a small backend helper, enforce request validation at the Nest boundary, remove debug logging, and serve the exported frontend as static assets in Docker.

**Tech Stack:** NestJS, Prisma, Expo Router, axios, pnpm, Docker Compose, Node.

---

### Task 1: Backend Bootstrap Hardening

**Files:**
- Create: `backend/src/config/http.config.ts`
- Create: `backend/src/config/http.config.test.ts`
- Modify: `backend/src/main.ts`
- Modify: `backend/package.json`

- [x] Write tests for CORS origin parsing and port parsing.
- [x] Run tests to verify they fail before the helper exists.
- [x] Implement `getHttpConfig()` and wire it into Nest bootstrap.
- [x] Re-run tests and backend build.

### Task 2: Remove Debug Logging and Enforce Validation

**Files:**
- Modify: `backend/src/app.module.ts`
- Modify: `backend/src/ai/ai.service.ts`
- Modify: `frontend/utils/api.ts`

- [x] Remove accidental comments/logs and keep errors sanitized.
- [x] Add global validation pipe in `main.ts`.
- [x] Keep frontend token handling but remove console output.

### Task 3: Production Docker and Environment Defaults

**Files:**
- Modify: `frontend/Dockerfile`
- Modify: `docker-compose.yml`
- Modify: `backend/.env.example`
- Create: `frontend/.env.example`

- [x] Export Expo web assets at build time.
- [x] Serve static frontend output with `serve`.
- [x] Make compose environment values parameterized with safe defaults.
- [x] Document required frontend and backend env vars.

### Task 4: Verification

**Files:**
- Build and test commands only.

- [x] Run backend unit tests.
- [x] Run backend production build.
- [x] Run frontend production export/build with a longer timeout.
