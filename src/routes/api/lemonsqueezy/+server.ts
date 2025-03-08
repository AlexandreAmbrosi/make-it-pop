import { webJson } from '@/lib/utils/web'
import type { RequestEvent } from './$types'

// Lemon Squeezy API Reference
// https://docs.lemonsqueezy.com/guides/tutorials/webhooks-logsnag
export async function POST(event: RequestEvent) {
  try {
    const context = await event.request.json()
    const eventName = context['meta']['event_name']
    const obj = context['data']['attributes']
    const objId = context['data']['id']
    // Handle each event based on
    // https://docs.lemonsqueezy.com/guides/developer-guide/webhooks
    // Return a response to acknowledge receipt of the event
    return webJson({ message: 'received' }, 200, {})
  } catch (e: any) {
    const message = e.message || e.toString()
    return webJson({ message }, 500, {})
  }
}
