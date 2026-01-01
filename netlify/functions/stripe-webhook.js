import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const sig = event.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let stripeEvent

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook signature verification failed' })
    }
  }

  console.log('Stripe event:', stripeEvent.type)

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object
        const userId = session.metadata?.supabase_user_id

        if (userId) {
          // Update user to pro status (one-time payment = lifetime access)
          await updateProStatus(userId, true, session.customer)
          console.log(`User ${userId} upgraded to Pro (lifetime)`)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`)
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}

/**
 * Update user's pro status in Supabase (one-time payment = lifetime access)
 */
async function updateProStatus(userId, isPro, stripeCustomerId) {
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM

  const { error } = await supabase
    .from('usage')
    .upsert({
      user_id: userId,
      is_pro: isPro,
      stripe_customer_id: stripeCustomerId,
      month_year: currentMonth,
      shares_this_month: 0
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    })

  if (error) {
    console.error('Failed to update pro status:', error)
    throw error
  }

  // Update existing row to preserve shares_this_month
  const { error: updateError } = await supabase
    .from('usage')
    .update({
      is_pro: isPro,
      stripe_customer_id: stripeCustomerId
    })
    .eq('user_id', userId)

  if (updateError) {
    console.error('Failed to update pro status (update):', updateError)
  }
}
