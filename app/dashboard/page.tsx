import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserId } from "@/utils/getUserId";

export default async function DashboardPage() {
  const supabase = createClient();
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">회사명</th>
                  <th className="text-left py-2">상태</th>
                  <th className="text-left py-2">액션</th>
                </tr>
              </thead>
              <tbody>
                {companyReviews.map((review) => (
                  <tr key={review.id} className="border-b">
                    <td className="py-2">{review.company_name}</td>
                    <td className="py-2">
                      <Badge variant={getBadgeVariant(review.status)}>
                        {review.status}
                      </Badge>
                    </td>
                    <td className="py-2">
                      {review.status === "rejected" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/reviews/revise/${review.id}`}>
                            수정
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>아직 작성한 재직 후기가 없습니다.</p>
        )}

        <h2 className="text-xl font-semibold mb-4 mt-8">내 면접 후기</h2>
        {interviewReviews && interviewReviews.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">회사명</th>
                  <th className="text-left py-2">직책</th>
                  <th className="text-left py-2">상태</th>
                  <th className="text-left py-2">액션</th>
                </tr>
              </thead>
              <tbody>
                {interviewReviews.map((review) => (
                  <tr key={review.id} className="border-b">
                    <td className="py-2">{review.company_name}</td>
                    <td className="py-2">{review.position}</td>
                    <td className="py-2">
                      <Badge variant={getBadgeVariant(review.status)}>
                        {review.status}
                      </Badge>
                    </td>
                    <td className="py-2">
                      {review.status === "rejected" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/reviews/revise/${review.id}`}>
                            수정
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function getBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" {
  switch (status) {
    case "approved":
      return "secondary";
    case "rejected":
      return "destructive";
    default:
      return "default";
  }
}
