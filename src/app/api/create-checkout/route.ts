import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    const plans: Record<string, { amount: number; name: string }> = {
      pro: { amount: 1900, name: 'Pro Plan - Monthly' },
      business: { amount: 4900, name: 'Business Plan - Monthly' }
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