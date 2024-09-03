"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InterviewReviewForm() {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewDifficulty, setInterviewDifficulty] = useState(3);
  const [interviewExperience, setInterviewExperience] = useState(3);
  const [interviewOutcome, setInterviewOutcome] = useState("Pending");
  const [interviewProcess, setInterviewProcess] = useState("");
  const [interviewQuestions, setInterviewQuestions] = useState("");
  const [advice, setAdvice] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/reviews/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: companyName,
        position,
        interview_date: interviewDate,
        interview_difficulty: interviewDifficulty,
        interview_experience: interviewExperience,
        interview_outcome: interviewOutcome,
        interview_process: interviewProcess,
        interview_questions: interviewQuestions,
        advice,
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
          htmlFor="position"
          className="block text-sm font-medium text-gray-700"
        >
          Position
        </label>
        <input
          type="text"
          id="position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="interviewDate"
          className="block text-sm font-medium text-gray-700"
        >
          Interview Date
        </label>
        <input
          type="date"
          id="interviewDate"
          value={interviewDate}
          onChange={(e) => setInterviewDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      {/* Add similar input fields for interviewDifficulty and interviewExperience */}

      <div>
        <label
          htmlFor="interviewOutcome"
          className="block text-sm font-medium text-gray-700"
        >
          Interview Outcome
        </label>
        <select
          id="interviewOutcome"
          value={interviewOutcome}
          onChange={(e) => setInterviewOutcome(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
          <option value="Withdrew">Withdrew</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="interviewProcess"
          className="block text-sm font-medium text-gray-700"
        >
          Interview Process
        </label>
        <textarea
          id="interviewProcess"
          value={interviewProcess}
          onChange={(e) => setInterviewProcess(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="interviewQuestions"
          className="block text-sm font-medium text-gray-700"
        >
          Interview Questions
        </label>
        <textarea
          id="interviewQuestions"
          value={interviewQuestions}
          onChange={(e) => setInterviewQuestions(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="advice"
          className="block text-sm font-medium text-gray-700"
        >
          Advice for Other Candidates
        </label>
        <textarea
          id="advice"
          value={advice}
          onChange={(e) => setAdvice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Interview Review
      </button>
    </form>
  );
}
