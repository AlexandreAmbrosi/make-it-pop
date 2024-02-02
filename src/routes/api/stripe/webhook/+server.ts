import Stripe from 'stripe'
import redis from '@/lib/db/upstash'
import { json, error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

// Stripe API Reference
// https://stripe.com/docs/webhooks#webhook-endpoint-def
export async function POST(event: RequestEvent) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
    const STRIPE_WEBHOOK_SIG = process.env.STRIPE_WEBHOOK_SIG
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SIG) {
      throw error(500, { message: 'Stripe keys not found.' })
    }
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
    const rawBody = await event.request.text()
    let eventStripe = JSON.parse(rawBody.toString())
    const sig = eventStripe.request.headers.get('stripe-signature')
    try {
      eventStripe = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SIG)
    } catch (err) {
      console.log(err.message)
      throw error(400, { message: `Webhook Error: ${err.message}` })
    }
    if (eventStripe.type === 'checkout.session.completed' || eventStripe.type === 'payment_intent.succeeded') {
      const customerEmail = eventStripe.data.object?.customer_details?.email
      if (customerEmail) {
        // Do some process say adding access to this user
        // Check if the 'redis' module is available
        if (redis) {
          // Add the 'email' to the access list in Redis
          await redis.hset('access', { [customerEmail]: 1 })
          return json({ message: 'approved user access' })
        }
        throw error(500, { message: 'redis instance not found' })
      }
      return json({ message: 'no email of the user is found' })
    }
    throw error(404, { message: JSON.stringify(eventStripe) })
  } catch (e) {
    console.log(e)
    throw error(500, { message: e.message || e.toString() })
  }
}
