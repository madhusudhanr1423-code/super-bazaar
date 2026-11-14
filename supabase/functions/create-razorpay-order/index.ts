// Supabase Edge Function: create-razorpay-order
// Creates a Razorpay order using prices looked up from our own
// products table, so the amount can never be faked from the browser.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID')
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (
      !RAZORPAY_KEY_ID ||
      !RAZORPAY_KEY_SECRET ||
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      return new Response(
        JSON.stringify({ error: 'Missing configuration' }),
        { status: 500, headers: corsHeaders },
      )
    }

    const { items } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Look up real prices ourselves; never trust prices from the request
    let total = 0
    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('price, stock, name')
        .eq('id', item.id)
        .single()

      if (error || !product) {
        return new Response(
          JSON.stringify({ error: `Product not found: ${item.id}` }),
          { status: 400, headers: corsHeaders },
        )
      }

      if (product.stock < item.qty) {
        return new Response(
          JSON.stringify({ error: `Not enough stock for ${product.name}` }),
          { status: 400, headers: corsHeaders },
        )
      }

      total += product.price * item.qty
    }

    // Razorpay expects the amount in paise (₹1 = 100 paise)
    const amountInPaise = Math.round(total * 100)

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

    const res = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      }),
    })

    const razorpayOrder = await res.json()

    if (!res.ok) {
      return new Response(JSON.stringify({ error: razorpayOrder }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    return new Response(
      JSON.stringify({
        razorpay_order_id: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        key_id: RAZORPAY_KEY_ID,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})