import { createClient } from "@/utils/supabase/server";
import ReviseReviewForm from "./revise-review-form";

export default async function ReviseReviewPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to revise your review.</div>;
  }

  const { data: companyReview } = await supabase
    .from("company_reviews")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const { data: interviewReview } = await supabase
    .from("interview_reviews")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const review = companyReview || interviewReview;
  const reviewType = companyReview ? "company" : "interview";

  if (!review) {
    return <div>Review not found or you don't have permission to edit it.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Revise Your Review</h1>
      <ReviseReviewForm review={review} reviewType={reviewType} />
    </div>
  );
}
