import { gameStore } from '@/app/game-store'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()
  const encoder = new TextEncoder()

  // Subscribe to game store updates
  const unsubscribe = gameStore.subscribe((state) => {
    const data = `data: ${JSON.stringify(state)}\n\n`
    writer.write(encoder.encode(data))
  })

  // Clean up subscription when client disconnects
  request.signal.addEventListener('abort', () => {
    unsubscribe()
    writer.close()
  })

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
