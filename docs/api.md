# Notemium — API Reference

Base URL: `http://localhost:3001/api`

All endpoints accept and return JSON. Authentication is optional — include `Authorization: Bearer <token>` to scope resources to a user.

---

## Authentication

### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass",
  "name": "John"           // optional
}
```
**Response:** `{ "accessToken": "...", "user": { "id", "email", "name" } }`

### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepass"
}
```
**Response:** `{ "accessToken": "...", "user": { "id", "email", "name" } }`

### Get Current User
```
GET /api/auth/me
```
**Headers:** `Authorization: Bearer <token>`
**Response:** `{ "id", "email", "name" }`

---

## Notes

### List Notes
```
GET /api/notes
```
Returns all non-trashed notes, sorted by pinned status then last updated.

### Get Note
```
GET /api/notes/:id
```

### Create Note
```
POST /api/notes
```
**Body:**
```json
{
  "title": "My Note",       // required
  "content": "Hello",       // required
  "folderId": 1,            // optional
  "tags": ["work"]          // optional
}
```

### Update Note
```
PUT /api/notes/:id
```
**Body:** Any subset of:
```json
{
  "title": "Updated",
  "content": "New content",
  "folderId": 2,
  "tags": ["personal"],
  "isPinned": true,
  "isArchived": false,
  "isTrashed": false
}
```

### Delete Note
```
DELETE /api/notes/:id
```

---

## Folders

### List Folders
```
GET /api/folders
```

### Get Folder
```
GET /api/folders/:id
```

### Create Folder
```
POST /api/folders
```
**Body:**
```json
{
  "name": "Work",           // required
  "parentId": 1             // optional
}
```

### Update Folder
```
PUT /api/folders/:id
```

### Delete Folder
```
DELETE /api/folders/:id
```

---

## Search

### Search All
```
GET /api/search?q=<query>
```
**Response:**
```json
[
  { "id": 1, "type": "note", "title": "...", "snippet": "..." },
  { "id": 2, "type": "folder", "title": "...", "snippet": "..." }
]
```

---

## Versioning

### List Versions
```
GET /api/versioning/:noteId
```

### Restore Version
```
POST /api/versioning/restore/:versionId
```

### Compare Versions
```
POST /api/versioning/compare
```
**Body:** `{ "versionIdA": 1, "versionIdB": 2 }`

---

## Collaboration

### Invite Collaborator
```
POST /api/collaboration/invite
```
**Body:** `{ "noteId": 1, "userId": 2, "role": "editor" }`

### Add Comment
```
POST /api/collaboration/comment/:noteId
```
**Body:** `{ "comment": "Great note!" }`

### Get Shared Info
```
GET /api/collaboration/shared/:noteId
```

---

## AI

### Summarize
```
POST /api/ai/summarize
```
**Body:** `{ "text": "Long note content..." }`

### Rewrite
```
POST /api/ai/rewrite
```
**Body:** `{ "text": "Draft text...", "style": "formal" }`

### Auto-tag
```
POST /api/ai/auto-tag
```
**Body:** `{ "text": "Note content..." }`

### Semantic Search
```
POST /api/ai/semantic-search
```
**Body:** `{ "query": "meeting notes from last week" }`

---

## Error Responses

All errors follow the NestJS format:
```json
{
  "statusCode": 404,
  "message": "Note with id 99 was not found",
  "error": "Not Found"
}
```

Common status codes: `400` (validation), `401` (unauthorized), `404` (not found), `500` (server error).
