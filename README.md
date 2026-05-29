# jiyi-web

An anonymous chat application built with Next.js and Supabase, implementing Scheme B where user nicknames are stored separately from messages.

## Project structure

- `app/page.tsx` - Main chat UI component
- `app/chatService.ts` - Core chat functions (syncAnonymousUser, sendMessage, fetchChatHistory)
- `app/supabaseClient.ts` - Supabase client initialization
- `.env.local.example` - Environment variables template
- `FRONTEND_IMPLEMENTATION.md` - Detailed implementation guide

## Key Features

- **Anonymous chat** with localStorage-based session persistence
- **Upsert operations** for nickname management
- **Joined queries** using Supabase resource embedding
- **Real-time message display** with user nicknames
- **TypeScript** for type safety

## Build & run

```bash
# Install dependencies
npm install

# Set up environment variables (copy from .env.local.example)
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Development
npm run dev

# Production build
npm run build
npm start
```

## Supabase Configuration

1. Create a Supabase project at https://supabase.com
2. Set up tables:
   - `anonymous_users` (session_id, nickname, created_at, updated_at)
   - `messages` (id, session_id, content, created_at)
3. Copy your project URL and anon key to `.env.local`

If you are deploying the root static `index.html` directly, copy `config.example.js` to `config.js` and fill in your Supabase credentials.

See `FRONTEND_IMPLEMENTATION.md` for detailed setup instructions.

## Architecture

### Scheme B: Separate Nickname Storage

```
anonymous_users
├── session_id (PK)
└── nickname

messages
├── id (PK)
├── session_id (FK → anonymous_users)
└── content
```

This separation:
- ✅ Allows nickname updates without message history changes
- ✅ Enables upsert operations for session management
- ✅ Supports efficient nickname queries and filtering
- ✅ Maintains referential integrity

## Core Functions

### `syncAnonymousUser(nickname: string)`
Upserts user identity to the database. Call before or when sending messages.

### `sendMessage(content: string, nickname: string)`
Sends a message after syncing user identity.

### `fetchChatHistory()`
Fetches all messages with joined nickname data using Supabase resource embedding.

See `FRONTEND_IMPLEMENTATION.md` for complete API documentation.

