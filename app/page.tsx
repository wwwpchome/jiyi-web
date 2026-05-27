import { createClient } from '../utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  let data = null
  let error: any = null
  try {
    const res = await supabase.from('todos').select('*').limit(5)
    data = res.data
    error = res.error
  } catch (e) {
    error = e
  }

  return (
    <main style={{ padding: 20, fontFamily: 'system-ui, -apple-system, Segoe UI' }}>
      <h1>Supabase Connectivity Test</h1>
      {error ? (
        <div style={{ color: 'crimson' }}>
          <strong>Error:</strong> {String(error?.message ?? error)}
        </div>
      ) : (
        <div>
          <strong>Fetched rows (up to 5):</strong>
          <pre style={{ background: '#f6f8fa', padding: 12, borderRadius: 6 }}>
            {JSON.stringify(data ?? [], null, 2)}
          </pre>
        </div>
      )}
    </main>
  )
}
