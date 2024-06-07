import { setAccess } from '@/lib/db'
import { webJson } from '@/lib/utils/web'
import Stripe from 'stripe'
import type { RequestEvent } from './$types'

// Stripe API Reference
// https://stripe.com/docs/webhooks#webhook-endpoint-def
export async function POST(event: RequestEvent) {
  try {
    // Verify if the Stripe secret key and webhook signature key is present
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
    const STRIPE_WEBHOOK_SIG = process.env.STRIPE_WEBHOOK_SIG
    if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SIG) return webJson({ message: 'Stripe keys not found.' }, 500, {})
    // Create a Stripe instance
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
    // Obtain the raw body of the request to be used in Stripe for verification
    const rawBody = await event.request.text()
    let eventStripe = JSON.parse(rawBody.toString())
    const sig = eventStripe.request.headers.get('stripe-signature')
    // Try to internally verify the webhook by using Stripe baked-in method
    try {
      eventStripe = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SIG)
    } catch (err) {
      console.log(err.message)
      return webJson({ message: `Webhook Error: ${err.message}` }, 400, {})
    }
    // Two events in Stripe point to succesful payment,
    // so use them below to send an email that the purchase was complete
    // and the customer now can get access to your thing
    if (eventStripe.type === 'checkout.session.completed' || eventStripe.type === 'payment_intent.succeeded') {
      const customerEmail = eventStripe.data.object?.customer_details?.email
      if (customerEmail) {
        // Do some process say adding access to this user
        // Add the 'email' to the access list in the database
        await setAccess(customerEmail, '1')
        return webJson({ message: 'approved user access' }, 200, {})
      }
      // if no email in the checkout instance is found
      return webJson({ message: 'no email of the user is found' }, 200, {})
    }
    return webJson({ message: JSON.stringify(eventStripe) }, 404, {})
  } catch (e) {
    // @ts-ignore
    const message = e.message || e.toString()
    return webJson({ message }, 500, {})
  }
}
