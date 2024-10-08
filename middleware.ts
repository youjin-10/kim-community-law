import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";
import { adminAuth } from "./utils/admin-auth";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return adminAuth(request);
  }

  if (request.nextUrl.pathname.startsWith("/reviews")) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(
        new URL("/login?next=/reviews", request.url)
      );
    }
  }

  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
