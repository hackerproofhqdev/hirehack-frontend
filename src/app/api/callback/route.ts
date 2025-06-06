import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = await request.nextUrl.searchParams
        const accessToken = searchParams.get("accessToken")
        const refreshToken = searchParams.get("refreshToken")
        const expireIn = searchParams.get("expireIn")
        const response = NextResponse.redirect(new URL(`${process.env.APP_URL}/dashboard`, request.url))
        // @ts-ignore
        response.cookies.set("accessToken", accessToken, {
            maxAge: expireIn, httpOnly: true, path: "/"
        })
        // @ts-ignore
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            path: "/"
        })
        return response
    } catch (error) {
        return NextResponse.json("Internal Server Error", { status: 500 })
    }
}