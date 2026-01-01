import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { userId, email, returnUrl } = JSON.parse(event.body)

    if (!userId || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID and email required' })
      }
    }

    const priceId = process.env.STRIPE_PRICE_ID

    if (!priceId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Stripe price not configured' })
      }
    }

    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1
    })

    let customerId

    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          supabase_user_id: userId
        }
      })
      customerId = customer.id
    }

    // Create checkout session (one-time payment)
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${returnUrl}?checkout=success`,
      cancel_url: `${returnUrl}?checkout=cancelled`,
      metadata: {
        supabase_user_id: userId
      }
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    }
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
