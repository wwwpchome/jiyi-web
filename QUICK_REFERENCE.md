# Quick Reference: Frontend API

## Core Functions

### 1. Sync Nickname to Database
```typescript
import { syncAnonymousUser } from './chatService'

// Call when user enters or changes nickname
await syncAnonymousUser('MyNickname')
```

### 2. Send Message
```typescript
import { sendMessage } from './chatService'

// Automatically syncs user first, then sends message
const success = await sendMessage('Hello!', 'MyNickname')
```

### 3. Fetch Chat History
```typescript
import { fetchChatHistory, ChatMessage } from './chatService'

const messages: ChatMessage[] = await fetchChatHistory()
// Each message has: id, content, createdAt, sessionId, nickname
```

## Data Flow

```
┌─────────────────────────────────────────────┐
│ User enters nickname                        │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ getSessionId() from localStorage            │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│ upsert() to anonymous_users table           │
│ { session_id, nickname }                    │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
   Send Message  Update existing
   (INSERT)      nickname (UPDATE)
```

## Environment Setup

```bash
# 1. Install Supabase
npm install @supabase/supabase-js

# 2. Create .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# 3. Create Supabase tables
# See FRONTEND_IMPLEMENTATION.md for schema

# 4. Run dev server
npm run dev
```

## Component Usage Example

```typescript
import { useState } from 'react'
import { sendMessage, fetchChatHistory } from '@/app/chatService'

export function ChatComponent() {
  const [nickname, setNickname] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSend = async (e) => {
    e.preventDefault()
    const success = await sendMessage(message, nickname)
    if (success) {
      setMessage('')
      const updated = await fetchChatHistory()
      setMessages(updated)
    }
  }

  return (
    <form onSubmit={handleSend}>
      <input 
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Your nickname"
      />
      <textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
      />
      <button type="submit">Send</button>
      
      {messages.map(msg => (
        <div key={msg.id}>
          <strong>{msg.nickname}</strong>: {msg.content}
          <small>{msg.createdAt}</small>
        </div>
      ))}
    </form>
  )
}
```

## Key Points

✅ Session ID auto-generated and stored in localStorage
✅ Upsert ensures nickname is created or updated correctly
✅ Resource embedding joins nickname automatically
✅ Fallback '未知路人' if nickname missing
✅ All operations have error handling

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 404 | Check table names in Supabase |
| Messages show '未知路人' | Ensure foreign key relationships exist |
| Nickname not updating | Check RLS policies allow upsert |
| "Missing config" warning | Set NEXT_PUBLIC_SUPABASE_* env vars |
