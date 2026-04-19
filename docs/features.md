# Notemium — Features

## 📝 Notes

| Feature | Status | Description |
|---------|--------|-------------|
| Create notes | ✅ | Title + content with instant feedback |
| Edit notes | ✅ | Inline editing with debounced auto-save |
| Delete notes | ✅ | Confirmation dialog, clears selection |
| Auto-save | ✅ | Saves 2 seconds after last keystroke |
| Markdown preview | ✅ | Toggle between edit and rendered view |
| Pin notes | ✅ | Pinned notes appear first in the list |
| Export as Markdown | ✅ | Download `.md` file of any note |
| Note timestamps | ✅ | Created/updated dates in list |

## 📁 Organization

| Feature | Status | Description |
|---------|--------|-------------|
| Folders | ✅ | Create, rename, and delete folders |
| Folder details | ✅ | View metadata and manage folders |
| Quick filter | ✅ | Filter notes by title/content in sidebar |

## 🔍 Search

| Feature | Status | Description |
|---------|--------|-------------|
| Real-time search | ✅ | Debounced (300ms), fires as you type |
| Type indicators | ✅ | Results show note/folder badges |
| Styled results | ✅ | Cards with icons and snippets |

## 🎨 Theme System

| Feature | Status | Description |
|---------|--------|-------------|
| Light theme | ✅ | Clean white UI |
| Dark theme | ✅ | Dark gray with proper contrast |
| System theme | ✅ | Follows OS preference |
| Persistence | ✅ | Stored in localStorage |
| No flicker | ✅ | Inline script applies before React hydrates |
| Smooth transitions | ✅ | CSS transitions on toggle |
| Settings sync | ✅ | ThemeToggle + Settings page use same key |

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | Create new note |
| `Ctrl+S` | Save current note |
| `Ctrl+F` | Focus note filter / search |
| `Ctrl+P` | Toggle markdown preview |

## 🔔 Notifications

| Feature | Status | Description |
|---------|--------|-------------|
| Toast system | ✅ | Success, error, and info toasts |
| Auto-dismiss | ✅ | Toasts disappear after 3 seconds |
| Slide animation | ✅ | Slides in from right |

## 🔐 Authentication

| Feature | Status | Description |
|---------|--------|-------------|
| Register | ✅ | Email + password + optional name |
| Login | ✅ | Email + password |
| Sign out | ✅ | Clears token |
| Optional auth | ✅ | App works without login for local dev |
| JWT tokens | ✅ | Bearer token stored in localStorage |

## ⚡ Performance

| Technique | Implementation |
|-----------|---------------|
| Debounced auto-save | 2s delay after last keystroke |
| Debounced search | 300ms delay in real-time search |
| No loading flash | Individual CRUD ops don't set global loading |
| Optimistic UI | Selection updates immediately |

## 🏗 Architecture

| Decision | Rationale |
|----------|-----------|
| Zustand stores | Minimal boilerplate, no prop drilling |
| Inline theme script | Prevents FOUC (flash of unstyled content) |
| Client providers | ToastProvider wraps app without breaking Server Components |
| Monofont editor | Better content editing experience |
| No external deps | Markdown renderer and toast are zero-dependency |
