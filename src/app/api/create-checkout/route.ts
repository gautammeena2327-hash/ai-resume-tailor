import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    // INR pricing for India - ₹1500 Pro, ₹4000 Business
    const plans: Record<string, { amount: number; name: string }> = {
      pro: { amount: 150000, name: 'Pro Plan - Monthly' }, // ₹1500 in paise
      business: { amount: 400000, name: 'Business Plan - Monthly' } // ₹4000 in paise
    }

    const selectedPlan = plans[plan]
    if (!selectedPlan) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        plan: plan,
        description: selectedPlan.name
      }
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      name: selectedPlan.name,
      keyId: process.env.RAZORPAY_KEY_ID
    })
  } catch (error: unknown) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ 
      error: 'Failed to create order', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}