import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/policy/$slug')({
  component: PolicyPage,
})

type Section = { heading: string; body: string }
type Policy = { title: string; updated: string; sections: Section[] }

const POLICIES: Record<string, Policy> = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'September 2026',
    sections: [
      {
        heading: 'Information we collect',
        body: 'When you place an order or create an account, we collect your name, phone number, delivery address and email address. We use this only to process and deliver your orders and to support you.',
      },
      {
        heading: 'How we use it',
        body: 'Your details are used to fulfil orders, show your order history, and contact you about your delivery. We do not sell your personal information to anyone.',
      },
      {
        heading: 'Data security',
        body: 'Your data is stored securely and is visible only to you and to authorised store staff. Passwords are never stored in readable form.',
      },
      {
        heading: 'Your choices',
        body: 'You can ask us to correct or delete your account and order details at any time by contacting us.',
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    updated: 'September 2026',
    sections: [
      {
        heading: 'Using the store',
        body: 'By placing an order you confirm that the details you provide are correct and that you are legally able to enter into a purchase.',
      },
      {
        heading: 'Prices and availability',
        body: 'Prices are shown in Indian rupees and can change without notice. If a product becomes unavailable after you order, we will let you know and refund any amount paid.',
      },
      {
        heading: 'Order acceptance',
        body: 'An order is confirmed once we accept it. We may cancel an order if an item is out of stock or if there is an error in the listed price.',
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    updated: 'September 2026',
    sections: [
      {
        heading: 'Delivery time',
        body: 'Most orders are delivered within 3 to 7 working days, depending on your location and the product.',
      },
      {
        heading: 'Delivery charges',
        body: 'Delivery is free on all orders at this time.',
      },
      {
        heading: 'Tracking your order',
        body: 'Sign in and open My Orders to see the current status of your order.',
      },
    ],
  },
  refunds: {
    title: 'Returns & Refunds',
    updated: 'September 2026',
    sections: [
      {
        heading: 'Returns',
        body: 'If you receive a damaged, defective or wrong item, contact us within 7 days of delivery and we will arrange a replacement or refund.',
      },
      {
        heading: 'Non-returnable items',
        body: 'For hygiene and safety reasons, perishable groceries and opened personal-care items cannot be returned.',
      },
      {
        heading: 'Refunds',
        body: 'Approved refunds are issued to the original payment method within 5 to 7 working days.',
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    updated: 'September 2026',
    sections: [
      {
        heading: 'Customer support',
        body: 'Email: support@superbazaar.example',
      },
      {
        heading: 'Hours',
        body: 'Monday to Saturday, 9:00 AM to 6:00 PM IST.',
      },
    ],
  },
}

function PolicyPage() {
  const { slug } = Route.useParams()
  const policy = POLICIES[slug]

  if (!policy) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Page not found</h1>
          <Link
            to="/"
            className="mt-6 inline-block text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className="text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            ← Back to Home
          </Link>
          <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight">
            {policy.title}
          </h1>
          <p className="mt-2 text-xs text-[#374151]">
            Last updated: {policy.updated}
          </p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {policy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-lg font-black">{section.heading}</h2>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#374151]">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}