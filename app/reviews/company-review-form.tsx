"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyReviewForm() {
  const [companyName, setCompanyName] = useState("");
  const [overallRating, setOverallRating] = useState(3);
  const [workLifeBalance, setWorkLifeBalance] = useState(3);
  const [salaryBenefits, setSalaryBenefits] = useState(3);
  const [careerGrowth, setCareerGrowth] = useState(3);
  const [management, setManagement] = useState(3);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/reviews/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: companyName,
        overall_rating: overallRating,
        work_life_balance: workLifeBalance,
        salary_benefits: salaryBenefits,
        career_growth: careerGrowth,
        management,
        pros,
        cons,
        additional_comments: additionalComments,
      }),
    });

    if (response.ok) {
      // router.push("/reviews");
      const result = await response.json();
      if (result.redirectTo) {
        router.push(result.redirectTo);
      }
    } else {
      console.error("Failed to submit review");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="companyName"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="overallRating"
          className="block text-sm font-medium text-gray-700"
        >
          Overall Rating
        </label>
        <input
          type="number"
          id="overallRating"
          min="1"
          max="5"
          value={overallRating}
          onChange={(e) => setOverallRating(Number(e.target.value))}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* Add similar input fields for workLifeBalance, salaryBenefits, careerGrowth, and management */}

      <div>
        <label
          htmlFor="pros"
          className="block text-sm font-medium text-gray-700"
        >
          Pros
        </label>
        <textarea
          id="pros"
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="cons"
          className="block text-sm font-medium text-gray-700"
        >
          Cons
        </label>
        <textarea
          id="cons"
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="additionalComments"
          className="block text-sm font-medium text-gray-700"
        >
          Additional Comments
        </label>
        <textarea
          id="additionalComments"
          value={additionalComments}
          onChange={(e) => setAdditionalComments(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Company Review
      </button>
    </form>
  );
}
