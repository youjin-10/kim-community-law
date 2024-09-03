"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

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

    // Update local state
    setReviews((prev) => ({
      ...prev,
      [type]: prev[type].map((review) =>
        review.id === id ? { ...review, status: newStatus } : review,
      ),
    }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Reviews</h2>
      {reviews.company.map((review) => (
        <div key={review.id} className="mb-4 p-4 border rounded">
          <p>Company: {review.company_name}</p>
          <p>Status: {review.status}</p>
          <button
            onClick={() => updateReviewStatus("company", review.id, "approved")}
            className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
          >
            Approve
          </button>
          <button
            onClick={() => updateReviewStatus("company", review.id, "rejected")}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Reject
          </button>
        </div>
      ))}

      <h2 className="text-xl font-semibold mb-4 mt-8">Interview Reviews</h2>
      {reviews.interview.map((review) => (
        <div key={review.id} className="mb-4 p-4 border rounded">
          <p>Company: {review.company_name}</p>
          <p>Position: {review.position}</p>
          <p>Status: {review.status}</p>
          <button
            onClick={() =>
              updateReviewStatus("interview", review.id, "approved")
            }
            className="mr-2 bg-green-500 text-white px-2 py-1 rounded"
          >
            Approve
          </button>
          <button
            onClick={() =>
              updateReviewStatus("interview", review.id, "rejected")
            }
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}
