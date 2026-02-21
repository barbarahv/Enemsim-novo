import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Check for the presence of the 'token' cookie or logic that can be performed on the server.
    // Note: Since we are using localStorage for tokens, the server (middleware) cannot see it directly 
    // unless we also set a cookie. 
    // However, for this project request, the user seems to be okay with client-side, 
    // but if they are seeing the page *before* the redirect, it implies hydration mismatch or slow effect.

    // Since we are using strictly localStorage (as per previous implementation), server middleware 
    // cannot block access effectively without a cookie. 

    // ALTERNATIVE:
    // We can stick to client-side but make the 'loading' state block everything until verified.
    // I already did this in page.tsx: `if (loading) return <Spinner />`

    // If the user SAYS "so deve aparecer depois do login", they might be seeing the spinner and thinking "it's loaded"?
    // Or maybe the redirect is failing.

    // Let's IMPROVE page.tsx to fail-safe immediately to login if no token found even before effect if possible (Next.js is SSR though).

    return NextResponse.next()
}

// Actually, I won't use this file if I can't read the token.
// Deleting/Ignoring this plan for a moment.
