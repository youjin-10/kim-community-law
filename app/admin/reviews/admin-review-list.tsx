// app/admin/reviews/admin-review-list.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Review = {
  id: string;
  company_name: string;
  status: string;
  position?: string;
  users: { email: string };
};

export default function AdminReviewList({ companyReviews, interviewReviews }) {
  const [reviews, setReviews] = useState({
    company: companyReviews,
    interview: interviewReviews,
  });
  const supabase = createClient();

  const updateReviewStatus = async (type, id, newStatus) => {
    const { data, error } = await supabase
      .from(type === "company" ? "company_reviews" : "interview_reviews")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating review status:", error);
      return;
    }

    setReviews((prev) => ({
      ...prev,
      [type]: prev[type].map((review) =>
        review.id === id ? { ...review, status: newStatus } : review
      ),
    }));
  };

  const ReviewCard = ({ review, type }: { review: Review; type: "company" | "interview" }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{review.company_name}</CardTitle>
        {type === "interview" && <p className="text-sm text-gray-500">{review.position}</p>}
      </CardHeader>
      <CardContent>
        <p className="text-sm">Reviewer: {review.users.email}</p>
        <Badge 
          variant={review.status === "approved" ? "success" : review.status === "rejected" ? "destructive" : "secondary"}
          className="mt-2"
        >
          {review.status}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          onClick={() => updateReviewStatus(type, review.id, "approved")}
          variant="default"
          size="sm"
          disabled={review.status === "approved"}
        >
          Approve
        </Button>
        <Button
          onClick={() => updateReviewStatus(type, review.id, "rejected")}
          variant="destructive"
          size="sm"
          disabled={review.status === "rejected"}
        >
          Reject
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Company Reviews</h2>
      {reviews.company.map((review) => (
        <ReviewCard key={review.id} review={review} type="company" />
      ))}

      <Separator className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Interview Reviews</h2>
      {reviews.interview.map((review) => (
        <ReviewCard key={review.id} review={review} type="interview" />
      ))}
    </div>
  );
}
