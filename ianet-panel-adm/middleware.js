import { NextResponse } from "next/server"

function getCorsHeaders(origin) {
  const allowed = process.env.ALLOWED_ORIGIN || "http://localhost:3000"
  return {
    "Access-Control-Allow-Origin": origin || allowed,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  }
}

const enabled = (process.env.NEXT_PUBLIC_PAID_FEATURES || process.env.PAID_FEATURES || "").split(",").map((s) => s.trim()).filter(Boolean)
function featureOn(name) {
  return enabled.includes(name)
}

export default async function middleware(req) {
  const { pathname } = req.nextUrl

  // ── CORS for public API routes ───────────────────────────────────────────
  if (pathname.startsWith("/api/public/")) {
    const origin = req.headers.get("origin")
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) })
    }
    const res = NextResponse.next()
    Object.entries(getCorsHeaders(origin)).forEach(([k, v]) => res.headers.set(k, v))
    return res
  }

  // ── Feature gating ───────────────────────────────────────────────────────
  if (pathname.startsWith("/admin/inventario") && !featureOn("inventory")) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }
  if (pathname.startsWith("/admin/eventos") && !featureOn("events")) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  // ── Auth check: require a next-auth session cookie ───────────────────────
  if (pathname.startsWith("/admin")) {
    const token =
      req.cookies.get("next-auth.session-token")?.value ||
      req.cookies.get("__Secure-next-auth.session-token")?.value

    if (!token) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/public/:path*", "/admin/:path*"],
}
