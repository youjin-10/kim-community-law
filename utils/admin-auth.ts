// utils/admin-auth.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function adminAuth(request: NextRequest) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("auth_id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
