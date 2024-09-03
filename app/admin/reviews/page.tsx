import { createClient } from "@/utils/supabase/server";
import AdminReviewList from "./admin-review-list";

export default async function AdminReviewsPage() {
  const supabase = createClient();

  const { data: companyReviews } = await supabase
    .from("company_reviews")
    .select("*, users(email)")
    .order("created_at", { ascending: false });

  const { data: interviewReviews } = await supabase
    .from("interview_reviews")
    .select("*, users(email)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Admin Review Management</h1>
      <AdminReviewList
        companyReviews={companyReviews}
        interviewReviews={interviewReviews}
      />
    </div>
  );
}
