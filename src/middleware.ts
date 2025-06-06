import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")
    const refreshToken = request.cookies.get("refreshToken")
    const path = request.nextUrl.pathname
    if (
        (accessToken || refreshToken) && (path == '/login' || path == "/register")
    ) {
        return NextResponse.redirect(new URL(
            '/dashboard', request.url
        )
        )
    } else if (
        path.startsWith('/dashboard') && !(accessToken || refreshToken)
    ) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
}