# Notepad Pro Frontend

Next.js (React) app for Notepad Pro.

- TypeScript, Tailwind CSS, Zustand
- Modern UI/UX, responsive, dark/light mode
- See `/docs` for requirements

## Testing

- **Test Runner:** Jest
- **Test Utilities:** @testing-library/react, jest-environment-jsdom
- **Test Location:** `src/components/**/*.test.tsx`
- **How to Run:**
	```sh
	npx jest
	```
- **Coverage:** All major UI components and pages, including loading, error, and main UI states.
- **Config:** Babel and Jest configs at monorepo root; `jest.setup.js` for custom matchers/mocks.
