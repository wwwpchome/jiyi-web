# Frontend Implementation Guide - Supabase Integration

## Overview

This document describes the frontend implementation for the anonymous chat system with Supabase integration, following **Scheme B** where user nicknames and session IDs are stored in a separate `anonymous_users` table.

## Architecture

### Core Concepts

1. **Session ID**: A unique identifier per browser/device, stored in localStorage
2. **Nickname**: User-provided display name, stored in `anonymous_users` table
3. **Messages**: Chat messages linked to sessions via foreign key
4. **Upsert Operation**: When a user enters/changes nickname, we upsert (insert or update) their record

## Files

### `supabaseClient.ts`
- Initializes Supabase client with environment variables
- Exports singleton `supabase` instance
- Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars

### `chatService.ts`
Core service with three main functions:

#### 1. `syncAnonymousUser(nickname: string)`
- **Purpose**: Upsert user identity to database
- **When called**: When user enters/updates nickname, before sending messages
- **Operation**: Upsert to `anonymous_users` table with session_id as conflict key
- **Error handling**: Throws error if nickname is empty

```typescript
await syncAnonymousUser('极客小哥')
```

#### 2. `sendMessage(content: string, nickname: string)`
- **Purpose**: Send a message to the chat
- **When called**: When user submits a message form
- **Process**:
  1. Syncs user identity first
  2. Inserts message with session_id and content
  3. Returns boolean indicating success
- **Database fields**: `session_id`, `content` (id and created_at auto-generated)

```typescript
const success = await sendMessage('Hello everyone!', 'MyNickname')
```

#### 3. `fetchChatHistory()`
- **Purpose**: Retrieve all messages with joined nickname data
- **When called**: On component mount, after sending messages
- **Key feature**: Uses Supabase resource embedding to join nickname from `anonymous_users`
- **Query**:
  ```
  SELECT id, content, created_at, session_id, 
         anonymous_users(nickname) 
  FROM messages
  ORDER BY created_at ASC
  ```
- **Fallback**: Returns '未知路人' (Unknown Stranger) if nickname data missing

```typescript
const messages = await fetchChatHistory()
// Returns: { id, content, createdAt, sessionId, nickname }[]
```

### `page.tsx`
React component demonstrating the full chat UI:
- Nickname input with real-time sync
- Message display with nickname and timestamp
- Message input form
- Auto-refresh after sending
- Loading states and validation

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables
Create `.env.local` in project root:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project dashboard:
- Settings → API → Project URL
- Settings → API → Anon/Public Key

### 3. Database Schema
Ensure your Supabase project has these tables:

```sql
-- anonymous_users table
CREATE TABLE anonymous_users (
  session_id TEXT PRIMARY KEY,
  nickname TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- messages table with foreign key to anonymous_users
CREATE TABLE messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  session_id TEXT NOT NULL REFERENCES anonymous_users(session_id),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. RLS (Row Level Security) Policy
For public anonymous chat, set RLS policies to allow:
- Insert/Update to `anonymous_users` (any authenticated user)
- Insert to `messages` (any authenticated user)
- Select from both tables (any user)

Or disable RLS if you want completely public access:
```sql
ALTER TABLE anonymous_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
```

## Usage Flow

### User Enters Chat
1. Generate/retrieve session_id from localStorage
2. Ask for nickname
3. Call `syncAnonymousUser(nickname)` to upsert

### User Sends Message
1. Call `sendMessage(content, nickname)`
2. Which internally:
   - Calls `syncAnonymousUser(nickname)`
   - Inserts message with session_id and content
3. Fetch updated chat history with `fetchChatHistory()`

### Real-time Updates (Optional Enhancement)
For real-time messages, add Supabase Realtime subscription:
```typescript
supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, 
    (payload) => {
      // Handle new message
      loadMessages()
    }
  )
  .subscribe()
```

## Key Points

✅ **Session Persistence**: Session ID stored in localStorage survives page refreshes
✅ **Upsert Logic**: Using `onConflict: 'session_id'` to update nickname if user exists
✅ **Resource Embedding**: Supabase `.select()` with nested `anonymous_users()` for nickname joins
✅ **Fallback Handling**: '未知路人' for messages without matching user (data integrity edge case)
✅ **Validation**: Empty nicknames and messages rejected with warnings
✅ **Error Handling**: All async operations wrapped with try-catch and error logging

## Error Scenarios

| Scenario | Handling |
|----------|----------|
| Missing Supabase config | Warning logged, app still runs (will error on API call) |
| Empty nickname | Validation error shown |
| Send with no nickname | Button disabled, validation alert |
| Network error | Error logged, user retries sending |
| Missing user record | Fallback nickname '未知路人' shown |

## Environment-Specific Notes

- **Development**: Use `.env.local` (git-ignored)
- **Production**: Set environment variables in your hosting platform (Vercel, Netlify, etc.)
- **Testing**: Mock `supabaseClient.ts` for unit tests

## TypeScript Types

```typescript
interface ChatMessage {
  id: string
  content: string
  createdAt: string
  sessionId: string
  nickname: string
}
```

## Next Steps

1. Add real-time messaging with Supabase Realtime
2. Add user authentication (optional)
3. Add typing indicators
4. Add message editing/deletion
5. Add user profiles or emojis
6. Implement message pagination for large histories
