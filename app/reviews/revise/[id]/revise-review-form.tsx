"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ReviseReviewForm({
  review,
  reviewType,
}: {
  review: any;
  reviewType: any;
}) {
  const [formData, setFormData] = useState(review);
  const router = useRouter();
  const supabase = createClient();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from(reviewType === "company" ? "company_reviews" : "interview_reviews")
      .update(formData)
      .eq("id", review.id);

    if (error) {
      console.error("Error updating review:", error);
      return;
    }

    router.push("/reviews/submitted");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Add form fields based on review type */}
      {reviewType === "company" ? (
        <>
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          {/* Add other company review fields */}
        </>
      ) : (
        <>
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          {/* Add other interview review fields */}
        </>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit Revised Review
      </button>
    </form>
  );
}
