import { NextResponse } from 'next/server'

const allowedOrigins = ["http://localhost:3000"]

export function middleware(request) {
    const origin = request.headers.get('origin')
    if (origin && !allowedOrigins.includes(origin) || !origin) {
    // if (origin && !allowedOrigins.includes(origin)) {
        console.log('Middleware Came In');
        return new NextResponse(null, {
            status: 400,
            statusText:'Bad Request',
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/api/:path*'
}