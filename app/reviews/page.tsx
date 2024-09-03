import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function ReviewsPage() {
  const supabase = createClient();

  const { data: companyReviews } = await supabase
    .from("company_reviews")
    .select("*");
  const { data: interviewReviews } = await supabase
    .from("interview_reviews")
    .select("*");

  return (
    <div>
      <h1>Reviews</h1>

      <div className="flex flex-col">
        <Link href="/reviews/company/new">Write a Company Review</Link>
        <Link href="/reviews/interview/new">Write an Interview Review</Link>
      </div>

      <h2>Company Reviews</h2>
      {companyReviews?.map((review) => (
        <div key={review.id}>
          <h3>{review.company_name}</h3>
          <p>Overall Rating: {review.overall_rating}/5</p>
          {/* Display other company review fields */}
        </div>
      ))}

      <h2>Interview Reviews</h2>
      {interviewReviews?.map((review) => (
        <div key={review.id}>
          <h3>
            {review.company_name} - {review.position}
          </h3>
          <p>Interview Experience: {review.interview_experience}/5</p>
          {/* Display other interview review fields */}
        </div>
      ))}
    </div>
  );
}
