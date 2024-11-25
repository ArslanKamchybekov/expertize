import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isProtectedRoute = createRouteMatcher(["/group(.*)"])

export default clerkMiddleware(async (auth, req) => {
    const baseHost = "localhost:3000"
    const host = req.headers.get("host")
    const reqPath = req.nextUrl.pathname
    const origin = req.nextUrl.origin

    // Protect routes if required
    if (isProtectedRoute(req)) auth().protect()

    // Handle domain-specific rewrite logic
    if (!baseHost.includes(host as string) && reqPath.includes("/group")) {
        const response = await fetch(`${origin}/api/domain?host=${host}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:3000", // Allow your frontend origin
                "Access-Control-Allow-Credentials": "true", // Allow cookies or auth headers
            },
            credentials: "include", // Ensure credentials are passed if needed
        })

        if (response.ok) {
            const data = await response.json()

            // Redirect if a domain rewrite is needed
            if (data.status === 200 && data.domain) {
                return NextResponse.rewrite(
                    new URL(reqPath, `https://${data.domain}/${reqPath}`),
                )
            }
        } else {
            console.error("Failed to fetch domain data:", await response.text())
        }
    }

    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
