import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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
    <Card className="max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Your Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Your Company Reviews</h2>
        {companyReviews && companyReviews.length > 0 ? (
          <ul>
            {companyReviews.map((review) => (
              <li key={review.id} className="mb-2 flex items-center">
                <span>{review.company_name}</span>
                <span className="ml-2">{review.status}</span>
                {review.status === "rejected" && (
                  <Button variant="link" asChild className="ml-2">
                    <Link href={`/reviews/revise/${review.id}`}>
                      Revise
                    </Link>
                  </Button>
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
              <li key={review.id} className="mb-2 flex items-center">
                <span>
                  {review.company_name} - {review.position}
                </span>
                <span className="ml-2">{review.status}</span>
                {review.status === "rejected" && (
                  <Button variant="link" asChild className="ml-2">
                    <Link href={`/reviews/revise/${review.id}`}>
                      Revise
                    </Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't submitted any interview reviews yet.</p>
        )}

        <div className="mt-8 space-x-4">
          <Button asChild>
            <Link href="/reviews/company/new">
              Write Company Review
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/reviews/interview/new">
              Write Interview Review
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
