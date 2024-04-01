import Stripe from 'stripe'
import { env } from '$env/dynamic/private'
import { json, error } from '@sveltejs/kit'
import type { RequestEvent } from './$types'

export async function GET(event: RequestEvent) {
  return await createCheckout(event)
}

export async function POST(event: RequestEvent) {
  return await createCheckout(event)
}

async function createCheckout(event: RequestEvent) {
  // Verify if the Stripe secret key is present
  if (!env.STRIPE_SECRET_KEY) throw error(500)
  // Create a Stripe instance
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  // Create a Stripe checkout using custom fields
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_configuration: 'pmc_1O2qH3SE9voLRYpuz5FLmkvn',
    // Mentioning the item you want to show up in the checkout
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          product: 'prod_OqWkk7Rz9Yw18f',
          unit_amount: Math.round(150 * 100),
        },
      },
    ],
    // Mentioning the discounts you want to show up in the checkout
    discounts: [
      {
        coupon: 'M0OTIWMA',
      },
    ],
    // Mentioning the custom fields such as GitHub username you want to show up in the checkout
    custom_fields: [
      {
        type: 'text',
        key: 'github',
        optional: true,
        label: {
          type: 'custom',
          custom: 'GitHub Username',
        },
      },
    ],
    // Mentioning the URL where user would land up when they cancel the transaction
    cancel_url: 'https://www.launchfa.st/api/stripe/cancel',
    // Mentioning the URL where user would land up when they complete the transaction succesfully
    success_url: 'https://www.launchfa.st/api/stripe/success',
  })
  // Redirect the user to the Stripe checkout created above
  if (session.url) {
    return json(
      {},
      {
        status: 303,
        headers: {
          Location: session.url,
        },
      },
    )
  } else {
    console.log(session)
    throw error(500, { message: 'failed to create a checkout url' })
  }
}
