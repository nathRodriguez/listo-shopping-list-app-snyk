import { NextResponse, NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
const JWT_SECRET = process.env.JWT_SECRET!

async function validateAndRefreshToken(token: string): Promise<{ valid: boolean, newToken?: string, error?: string }> {
    // First, verify the token signature (ignore expiry for now)
    try {
        jwt.verify(token, JWT_SECRET, { ignoreExpiration: true }) // Throws if invalid signature
    } catch (err) {
        return { valid: false, error: 'invalid_token' }
    }

    // Decode to check expiry
    const decoded = jwt.decode(token) as any
    const now = Math.floor(Date.now() / 1000)
    const expired = decoded.exp < now
    const expiresSoon = decoded.exp - now < 300 // 5 minutes

    if (!expired && !expiresSoon) {
        return { valid: true } // Valid and not expiring soon
    }

    // Refresh if expired or expiring soon
    try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })

        if (!res.ok) return { valid: false, error: 'invalid_token' }

        const data = await res.json()
        return { valid: true, newToken: data.token }
    } catch (error) {
        return { valid: false, error: 'network' }
    }
}

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    const token = request.cookies.get('token')?.value

    if (pathname === '/login' || pathname === '/signup') {
        if (!token) return NextResponse.next()

        const { valid, newToken, error } = await validateAndRefreshToken(token)

        if (valid && newToken) {
            const response = NextResponse.redirect(new URL('/?message=already_logged_in', request.url))
            response.cookies.set('token', newToken, { httpOnly: false, secure: false, sameSite: 'lax' })
            return response
        }

        if (error) {
            return NextResponse.redirect(new URL('/login?error=' + error, request.url))
        }

        return NextResponse.next()
    }

    // For other pages
    if (!token) {
        return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }

    const { valid, newToken, error } = await validateAndRefreshToken(token)

    if (valid && newToken) {
        const response = NextResponse.next()
        response.cookies.set('token', newToken, { httpOnly: false, secure: false, sameSite: 'lax' })
        return response
    }

    if (valid) {
        return NextResponse.next() // Valid but no refresh needed
    }

    const errorParam = error || 'unauthorized'
    return NextResponse.redirect(new URL('/login?error=' + errorParam, request.url))
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}