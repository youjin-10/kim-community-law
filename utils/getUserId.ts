import { createClient } from "@/utils/supabase/server";

export async function getUserId() {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: userData, error: userDataError } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (userDataError || !userData) {
    throw new Error("User not found");
  }

  return userData.id;
}
