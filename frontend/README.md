# Notemium Frontend

Next.js (React 19) application for Notemium.

- TypeScript, Tailwind CSS, Zustand
- App Router with server/client components
- Persistent dark/light/system theme
- See `/docs` for architecture details

## Development

```bash
npm run dev    # http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint
```

## Testing

- **Runner:** Jest with @testing-library/react
- **Location:** `src/components/**/*.test.tsx`
- **Run:** `npx jest`
