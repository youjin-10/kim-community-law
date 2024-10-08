import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

export default async function ReviewsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("/reviews, user: ", user);

  if (!user) {
    redirect("/login?next=/reviews");
  }

  const { data: companyReviews } = await supabase
    .from("company_reviews")
    .select("*")
    .eq("status", "approved");
  const { data: interviewReviews } = await supabase
    .from("interview_reviews")
    .select("*")
    .eq("status", "approved");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">리뷰</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>후기 작성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/reviews/company/new">회사 후기 작성</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/reviews/interview/new">면접 후기 작성</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">회사 후기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyReviews?.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle>{review.company_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>{review.overall_rating}/5</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.pros.substring(0, 100)}
                    {review.pros.length > 100 ? "..." : ""}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">면접 후기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewReviews?.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle>{review.company_name}</CardTitle>
                  <p className="text-sm text-gray-600">{review.position}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-2">
                    <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                    <span>경험: {review.interview_experience}/5</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {review.interview_process.substring(0, 100)}
                    {review.interview_process.length > 100 ? "..." : ""}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
