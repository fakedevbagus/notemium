# Testing Strategy

## Overview
This project uses a comprehensive testing strategy to ensure reliability and maintainability for both frontend and backend codebases. The approach includes unit, integration, and end-to-end (e2e) tests, with modern tooling and CI compatibility.

---

## Frontend (Next.js)
- **Test Runner:** Jest
- **Test Utilities:** @testing-library/react, jest-environment-jsdom
- **Location:** `frontend/src/components/**/*.test.tsx`
- **Coverage:**
  - All major UI components and pages (FoldersPage, NotesPage, SearchPage, SettingsPage, etc.)
  - Loading, error, and main UI states
- **Setup:**
  - Babel and Jest configs at monorepo root
  - `jest.setup.js` for custom matchers and mocks
- **How to Run:**
  ```sh
  cd frontend
  npx jest
  ```

---

## Backend (NestJS)
- **Test Runner:** Jest (with ts-jest)
- **Test Utilities:** @nestjs/testing, supertest
- **Location:** `backend/test/*.e2e-spec.ts`
- **Coverage:**
  - All API endpoints (CRUD for notes, folders, search, etc.)
  - In-memory service logic for isolated e2e tests
- **How to Run:**
  ```sh
  cd backend
  npx jest --runInBand test/
  ```

---

## Coverage Expectations
- All critical user flows and endpoints should be covered by passing tests.
- Aim for high coverage on business logic and UI states.
- Use mocks for external dependencies and API calls.

---

## CI Integration
- Tests are designed to run in CI/CD pipelines with no external dependencies required.
- In-memory logic ensures fast, isolated test runs.

---

## Troubleshooting
- Ensure all dependencies are installed from the repository root with `npm install`.
- If tests fail, check for missing or misconfigured Jest/Babel settings.
- For backend, ensure DTOs and modules are correctly defined and exported.

---

## Further Reading
- See `frontend/README.md` and `backend/README.md` for project-specific test instructions.
