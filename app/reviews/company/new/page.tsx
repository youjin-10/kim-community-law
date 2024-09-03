import { createClient } from "@/utils/supabase/server";
import CompanyReviewForm from "../../company-review-form";

export default async function NewCompanyReviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to submit a review.</div>;
  }

  const { data: profile } = await supabase
    .from("lawyer_profiles")
    .select("status")
    .eq("user_id", user.id)
    .single();

  // if (profile?.status !== "approved") {
  //   return <div>Only approved users can submit reviews.</div>;
  // }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Write a Company Review</h1>
      <CompanyReviewForm />
    </div>
  );
}
