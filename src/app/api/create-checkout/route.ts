import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { variantId } = await request.json()

    if (!variantId) {
      return NextResponse.json({ error: 'Variant ID required' }, { status: 400 })
    }

    console.log('Creating checkout for variant:', variantId)
    console.log('Store ID:', process.env.LEMONSQUEEZY_STORE_ID)

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            store: process.env.LEMONSQUEEZY_STORE_ID,
            variant: variantId,
          },
        },
      }),
    })

    const data = await response.json()
    const url = data.data?.attributes?.url

    if (!response.ok || !url) {
      console.error('LemonSqueezy response:', data)
      return NextResponse.json({ 
        error: 'Failed to create checkout', 
        details: data?.errors?.[0]?.detail || data?.message || 'Unknown error',
        status: response.status
      }, { status: 500 })
    }

    return NextResponse.json({ url })
  } catch (error: unknown) {
    console.error('Error creating checkout:', error)
    return NextResponse.json({ 
      error: 'Failed to create checkout', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}