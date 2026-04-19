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
  "name": "John"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | ✅ | Valid email address |
| `password` | string | ✅ | Min 8 characters |
| `name` | string | ❌ | Display name |

**Response `201`:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John",
    "createdAt": "2026-04-19T12:00:00.000Z",
    "updatedAt": "2026-04-19T12:00:00.000Z"
  }
}
```

**Errors:** `409` if email already registered.

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

**Response `201`:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John"
  }
}
```

**Errors:** `401` if invalid credentials.

### Get Current User

```
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response `200`:**

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John",
  "createdAt": "2026-04-19T12:00:00.000Z",
  "updatedAt": "2026-04-19T12:00:00.000Z"
}
```

Without token: `{ "user": null }`

---

## Notes

### List Notes (Paginated)

```
GET /api/notes
GET /api/notes?page=1&limit=20
GET /api/notes?folderId=3
GET /api/notes?search=meeting
GET /api/notes?trashed=true
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | `1` | Page number |
| `limit` | number | `50` | Items per page (max 100) |
| `folderId` | number | — | Filter by folder ID |
| `search` | string | — | Search in title and content |
| `trashed` | string | — | Set to `"true"` to list trashed notes |

**Response `200`:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "My Note",
      "content": "Hello world",
      "folderId": 2,
      "tags": ["work"],
      "isPinned": true,
      "isArchived": false,
      "isTrashed": false,
      "createdAt": "2026-04-19T12:00:00.000Z",
      "updatedAt": "2026-04-19T13:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 50,
    "total": 1,
    "totalPages": 1
  }
}
```

### List Trashed Notes

```
GET /api/notes/trash
```

**Response `200`:** Array of trashed notes.

```json
[
  {
    "id": 5,
    "title": "Deleted Note",
    "content": "...",
    "isTrashed": true,
    "updatedAt": "2026-04-19T14:00:00.000Z"
  }
]
```

### Get Note

```
GET /api/notes/:id
```

**Response `200`:** Single note object.

**Errors:** `404` if not found.

### Create Note

```
POST /api/notes
```

**Body:**

```json
{
  "title": "My Note",
  "content": "Hello world",
  "folderId": 1,
  "tags": ["work", "important"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Note title |
| `content` | string | ✅ | Note content |
| `folderId` | number | ❌ | Folder to place note in |
| `tags` | string[] | ❌ | Tags array |

**Response `201`:** Created note object.

### Update Note

```
PUT /api/notes/:id
```

**Body:** Any subset of fields:

```json
{
  "title": "Updated Title",
  "content": "New content",
  "folderId": 2,
  "tags": ["personal"],
  "isPinned": true,
  "isArchived": false,
  "isTrashed": false
}
```

**Response `200`:** Updated note object.

**Errors:** `404` if not found.

### Delete Note (Soft Delete → Trash)

```
DELETE /api/notes/:id
```

Moves the note to trash. Does **not** permanently delete.

**Response `200`:** Trashed note object (with `isTrashed: true`).

**Errors:** `404` if not found.

### Restore Note from Trash

```
PATCH /api/notes/:id/restore
```

**Response `200`:** Restored note object (with `isTrashed: false`).

**Errors:** `404` if not found.

### Permanently Delete Note

```
DELETE /api/notes/:id/permanent
```

**⚠️ Irreversible.** Permanently removes the note and its versions.

**Response `200`:** Deleted note object.

**Errors:** `404` if not found.

---

## Folders

### List Folders

```
GET /api/folders
```

**Response `200`:** Array of folders sorted alphabetically.

```json
[
  {
    "id": 1,
    "name": "Work",
    "parentId": null,
    "createdAt": "2026-04-19T12:00:00.000Z",
    "updatedAt": "2026-04-19T12:00:00.000Z"
  }
]
```

### Get Folder

```
GET /api/folders/:id
```

**Response `200`:** Single folder object.

**Errors:** `404` if not found.

### Create Folder

```
POST /api/folders
```

**Body:**

```json
{
  "name": "Work",
  "parentId": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Folder name |
| `parentId` | number | ❌ | Parent folder for nesting |

**Response `201`:** Created folder object.

### Update Folder

```
PUT /api/folders/:id
```

**Body:**

```json
{
  "name": "Updated Name",
  "parentId": 2
}
```

**Response `200`:** Updated folder object.

### Delete Folder

```
DELETE /api/folders/:id
```

**Response `200`:** Deleted folder object.

**Errors:** `404` if not found.

---

## Search

### Search All

```
GET /api/search?q=<query>
```

Searches across note titles, note content, and folder names. Returns up to 50 results.

**Response `200`:**

```json
[
  {
    "id": 1,
    "type": "note",
    "title": "Meeting Notes",
    "snippet": "Discussed the Q3 roadmap and..."
  },
  {
    "id": 3,
    "type": "folder",
    "title": "Meetings",
    "snippet": ""
  }
]
```

Empty query returns `[]`.

---

## Versioning

### List Versions

```
GET /api/versioning/:noteId
```

**Response `200`:**

```json
{
  "versions": [
    {
      "id": 3,
      "noteId": 1,
      "title": "Latest title",
      "content": "Latest content",
      "createdAt": "2026-04-19T14:00:00.000Z"
    },
    {
      "id": 2,
      "noteId": 1,
      "title": "Previous title",
      "content": "Previous content",
      "createdAt": "2026-04-19T13:00:00.000Z"
    }
  ]
}
```

### Restore Version

```
POST /api/versioning/restore/:versionId
```

**Response `200`:**

```json
{
  "success": true,
  "restored": {
    "id": 2,
    "noteId": 1,
    "title": "Previous title",
    "content": "Previous content",
    "createdAt": "2026-04-19T13:00:00.000Z"
  }
}
```

**Errors:** `404` if version not found.

### Compare Versions

```
POST /api/versioning/compare
```

**Body:**

```json
{
  "versionA": 1,
  "versionB": 2
}
```

**Response `200`:**

```json
{
  "diff": {
    "versionA": { "id": 1, "noteId": 1, "title": "...", "content": "..." },
    "versionB": { "id": 2, "noteId": 1, "title": "...", "content": "..." },
    "titleChanged": true,
    "contentChanged": true
  }
}
```

---

## Collaboration

### Invite Collaborator

```
POST /api/collaboration/invite
```

**Body:**

```json
{
  "noteId": 1,
  "userId": 2,
  "role": "editor"
}
```

Roles: `viewer`, `editor`.

**Response `201`:**

```json
{
  "success": true,
  "collaborator": {
    "id": 1,
    "note_id": 1,
    "user_id": 2,
    "role": "editor",
    "invited_at": "2026-04-19T12:00:00.000Z"
  }
}
```

### Add Comment

```
POST /api/collaboration/comment/:noteId
```

**Body:**

```json
{
  "userId": 1,
  "comment": "Great note!"
}
```

**Response `201`:**

```json
{
  "success": true,
  "comment": {
    "id": 1,
    "note_id": 1,
    "user_id": 1,
    "comment": "Great note!",
    "created_at": "2026-04-19T12:00:00.000Z"
  }
}
```

### Get Shared Info

```
GET /api/collaboration/shared/:noteId
```

**Response `200`:**

```json
{
  "collaborators": [...],
  "comments": [...]
}
```

---

## AI

### Summarize

```
POST /api/ai/summarize
```

**Body:**

```json
{ "content": "Long note content to summarize..." }
```

**Response `201`:**

```json
{ "summary": "First few sentences of the content." }
```

### Rewrite

```
POST /api/ai/rewrite
```

**Body:**

```json
{ "content": "Draft text that needs cleanup..." }
```

**Response `201`:**

```json
{ "rewritten": "Cleaned up version of the text." }
```

### Auto-tag

```
POST /api/ai/auto-tag
```

**Body:**

```json
{ "content": "Note content to extract tags from..." }
```

**Response `201`:**

```json
{ "tags": ["meeting", "project", "deadline", "review", "budget"] }
```

### Semantic Search

```
POST /api/ai/semantic-search
```

**Body:**

```json
{ "query": "meeting notes from last week" }
```

**Response `201`:**

```json
{
  "query": "meeting notes from last week",
  "terms": ["meeting", "notes", "from", "last", "week"],
  "results": []
}
```

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

### Common Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `400` | Validation error (bad request body or params) |
| `401` | Unauthorized (invalid or missing JWT) |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate email) |
| `500` | Internal server error |

---

## Testing with cURL

```bash
# List notes
curl http://localhost:3001/api/notes

# Create a note
curl -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"Hello world"}'

# Update a note
curl -X PUT http://localhost:3001/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'

# Soft-delete a note (trash)
curl -X DELETE http://localhost:3001/api/notes/1

# Restore from trash
curl -X PATCH http://localhost:3001/api/notes/1/restore

# Permanently delete
curl -X DELETE http://localhost:3001/api/notes/1/permanent

# Search
curl "http://localhost:3001/api/search?q=hello"

# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"securepass"}'
```
