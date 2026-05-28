'use client'

import { useEffect, useState } from 'react'
import { fetchChatHistory, sendMessage, syncAnonymousUser, ChatMessage } from './chatService'

export default function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [nickname, setNickname] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Load chat history on mount
  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = async () => {
    setLoading(true)
    const history = await fetchChatHistory()
    setMessages(history)
    setLoading(false)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nickname.trim()) {
      alert('Please enter a nickname')
      return
    }
    
    if (!newMessage.trim()) {
      alert('Please enter a message')
      return
    }

    setLoading(true)
    const success = await sendMessage(newMessage, nickname)
    
    if (success) {
      setNewMessage('')
      await loadMessages()
    } else {
      alert('Failed to send message')
    }
    
    setLoading(false)
  }

  const handleNicknameChange = async (newNickname: string) => {
    setNickname(newNickname)
    
    if (newNickname.trim()) {
      // Sync nickname to database when changed
      try {
        await syncAnonymousUser(newNickname)
      } catch (error) {
        console.error('Failed to update nickname:', error)
      }
    }
  }

  return (
    <main style={{ padding: 20, fontFamily: 'system-ui, -apple-system, Segoe UI', maxWidth: 800, margin: '0 auto' }}>
      <h1>极记 (Jiyi) Chat Room</h1>
      <p>A simple anonymous chat application powered by Supabase</p>

      {/* Nickname Input */}
      <div style={{ marginBottom: 20, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Your Nickname:
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value)}
          placeholder="Enter your nickname (required)"
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ddd',
            fontSize: 14,
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Chat Messages Display */}
      <div style={{
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        minHeight: 300,
        maxHeight: 400,
        overflowY: 'auto',
        border: '1px solid #ddd'
      }}>
        <h3>Chat History</h3>
        {loading && <p>Loading messages...</p>}
        {!loading && messages.length === 0 && <p style={{ color: '#999' }}>No messages yet. Be the first to chat!</p>}
        {messages.map((msg) => (
          <div key={msg.id} style={{
            marginBottom: 12,
            padding: 10,
            backgroundColor: 'white',
            borderRadius: 4,
            borderLeft: '3px solid #4CAF50'
          }}>
            <div style={{ fontWeight: 'bold', color: '#333' }}>
              {msg.nickname}
              <span style={{ color: '#999', fontSize: 12, marginLeft: 10 }}>
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </div>
            <div style={{ marginTop: 5, color: '#555' }}>{msg.content}</div>
          </div>
        ))}
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSendMessage} style={{
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8
      }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
          Message:
        </label>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={loading}
          style={{
            width: '100%',
            minHeight: 80,
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ddd',
            fontSize: 14,
            boxSizing: 'border-box',
            fontFamily: 'inherit'
          }}
        />
        <button
          type="submit"
          disabled={loading || !nickname.trim()}
          style={{
            marginTop: 10,
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            cursor: 'pointer',
            opacity: loading || !nickname.trim() ? 0.5 : 1
          }}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Instructions */}
      <div style={{ marginTop: 30, padding: 15, backgroundColor: '#e8f5e9', borderRadius: 8, fontSize: 13, color: '#333' }}>
        <h4>How to use:</h4>
        <ol>
          <li>Enter your nickname and start chatting</li>
          <li>Your nickname will be automatically synced when you send a message</li>
          <li>Chat history is fetched from the database with proper nickname joins</li>
          <li>Each session gets a unique session_id stored in localStorage</li>
        </ol>
      </div>
    </main>
  )
}
