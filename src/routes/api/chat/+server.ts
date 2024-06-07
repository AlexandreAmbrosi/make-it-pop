import { completion } from 'litellm'
import type { RequestEvent } from './$types'

export async function POST(event: RequestEvent) {
  const encoder = new TextEncoder()
  let { messages } = (await event.request.json()) as { messages?: any[] }
  if (!messages) messages = []
  const customReadable = new ReadableStream({
    async start(controller) {
      const stream = await completion({
        messages,
        stream: true,
        model: 'gpt-3.5-turbo',
      })
      for await (const part of stream) {
        const tmp = part.choices[0]?.delta?.content
        if (tmp) controller.enqueue(encoder.encode(tmp))
      }
      controller.close()
    },
  })
  return new Response(customReadable, {
    headers: {
      Connection: 'keep-alive',
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
