import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const { data: companyReviews } = await supabase
    .from("company_reviews")
    .select("*")
    .eq("user_id", user.id);

  const { data: interviewReviews } = await supabase
    .from("interview_reviews")
    .select("*")
    .eq("user_id", user.id);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Your Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Your Company Reviews</h2>
      {companyReviews && companyReviews.length > 0 ? (
        <ul>
          {companyReviews.map((review) => (
            <li key={review.id} className="mb-2">
              <span>{review.company_name}</span> -
              <span className="ml-2">{review.status}</span>
              {review.status === "rejected" && (
                <Link
                  href={`/reviews/revise/${review.id}`}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Revise
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't submitted any company reviews yet.</p>
      )}

      <h2 className="text-xl font-semibold mb-4 mt-8">
        Your Interview Reviews
      </h2>
      {interviewReviews && interviewReviews.length > 0 ? (
        <ul>
          {interviewReviews.map((review) => (
            <li key={review.id} className="mb-2">
              <span>
                {review.company_name} - {review.position}
              </span>{" "}
              -<span className="ml-2">{review.status}</span>
              {review.status === "rejected" && (
                <Link
                  href={`/reviews/revise/${review.id}`}
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Revise
                </Link>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't submitted any interview reviews yet.</p>
      )}

      <div className="mt-8">
        <Link
          href="/reviews/company/new"
          className="mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Write Company Review
        </Link>
        <Link
          href="/reviews/interview/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Write Interview Review
        </Link>
      </div>
    </div>
  );
}
