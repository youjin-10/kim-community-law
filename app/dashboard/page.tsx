import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getUserId } from "@/utils/getUserId";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  const userId = await getUserId();

  const { data: companyReviews } = await supabase
    .from("company_reviews")
    .select("*")
    .eq("user_id", userId);

  const { data: interviewReviews } = await supabase
    .from("interview_reviews")
    .select("*")
    .eq("user_id", userId);

  return (
    <Card className="max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>내 대시보드</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">내 재직 후기</h2>
        {companyReviews && companyReviews.length > 0 ? (
          <ul>
            {companyReviews.map((review) => (
              <li key={review.id} className="mb-2 flex items-center">
                <span>{review.company_name}</span>
                <span className="ml-2">{review.status}</span>
                {review.status === "rejected" && (
                  <Button variant="link" asChild className="ml-2">
                    <Link href={`/reviews/revise/${review.id}`}>수정</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 작성한 재직 후기가 없습니다.</p>
        )}

        <h2 className="text-xl font-semibold mb-4 mt-8">내 면접 후기</h2>
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
                    <Link href={`/reviews/revise/${review.id}`}>수정</Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>아직 작성한 면접 후기가 없습니다.</p>
        )}

        <div className="mt-8 space-x-4">
          <Button asChild>
            <Link href="/reviews/company/new">재직 후기 작성</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/reviews/interview/new">면접 후기 작성</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
