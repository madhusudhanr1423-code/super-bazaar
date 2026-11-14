// Supabase Edge Function: sends an email to the store owner
// whenever a new row is inserted into `orders`.

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const order = payload.record

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

    if (!RESEND_API_KEY || !ADMIN_EMAIL) {
      return new Response('Missing email configuration', { status: 500 })
    }

    const html = `
      <h2>New order received</h2>
      <p><strong>Order ID:</strong> ${order.id.slice(0, 8)}</p>
      <p><strong>Customer:</strong> ${order.customer_name}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}</p>
      <p><strong>Total:</strong> ₹${order.total}</p>
      <p>Open the admin page to view items and update the status.</p>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Resend's shared test sender; swap in your own domain later
        from: 'Super Bazaar <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `New order — ₹${order.total} from ${order.customer_name}`,
        html,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return new Response(`Resend error: ${text}`, { status: 500 })
    }

    return new Response('ok', { status: 200 })
  } catch (err) {
    return new Response(`Error: ${err}`, { status: 500 })
  }
})