// app/api/reviews/interview/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getUserId } from "@/utils/getUserId";

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const userId = await getUserId();

    const {
      company_name,
      position,
      interview_date,
      interview_difficulty,
      interview_experience,
      interview_outcome,
      interview_process,
      interview_questions,
      advice,
      lawyer_type,
      employment_terms,
    } = await request.json();

    const { data, error } = await supabase
      .from("interview_reviews")
      .insert({
        user_id: userId,
        company_name,
        position,
        interview_date,
        interview_difficulty,
        interview_experience,
        interview_outcome,
        interview_process,
        interview_questions,
        advice,
        lawyer_type,
        employment_terms,
        status: "pending", // Set the initial status to 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting interview review:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      redirectTo: "/reviews/submitted",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
