// Supabase Edge Function: verify-razorpay-payment
// Confirms a Razorpay payment is genuine (via HMAC signature) and,
// only if it checks out, places the order using our existing
// place_order function so stock and totals stay correct.

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

async function hmacSha256Hex(key: string, message: string) {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!RAZORPAY_KEY_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing configuration' }),
        { status: 500, headers: corsHeaders },
      )
    }

    const authHeader = req.headers.get('Authorization') ?? ''
    const userToken = authHeader.replace('Bearer ', '')

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      name,
      phone,
      address,
      items,
    } = await req.json()

    // 1. Check the signature Razorpay sent proves this payment is real
    const expectedSignature = await hmacSha256Hex(
      RAZORPAY_KEY_SECRET,
      `${razorpay_order_id}|${razorpay_payment_id}`,
    )

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed' }),
        { status: 400, headers: corsHeaders },
      )
    }

    // 2. Place the order as this user, using the existing safe function
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      global: { headers: { Authorization: `Bearer ${userToken}` } },
    })

    const { data: orderId, error: rpcError } = await supabase.rpc(
      'place_order',
      {
        p_name: name,
        p_phone: phone,
        p_address: address,
        p_items: items,
      },
    )

    if (rpcError) {
      return new Response(JSON.stringify({ error: rpcError.message }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    // 3. Mark the order as paid, with proof from Razorpay
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    await admin
      .from('orders')
      .update({
        payment_status: 'paid',
        razorpay_order_id,
        razorpay_payment_id,
      })
      .eq('id', orderId)

    return new Response(JSON.stringify({ order_id: orderId }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})