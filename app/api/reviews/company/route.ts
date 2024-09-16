import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getUserId } from "@/utils/getUserId";

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const userId = await getUserId();

    const {
      company_name,
      lawyer_type,
      employment_terms,
      good_things,
      other_good_things,
      overall_rating,
      work_life_balance,
      salary_benefits,
      career_growth,
      culture_fit,
      management,
      pros,
      cons,
      additional_comments,
      overtime_frequency,
      overtime_comments,
      years_of_experience,
      salary,
      salary_type,
    } = await request.json();

    // Combine good_things and other_good_things if necessary
    const combinedGoodThings = good_things.includes("기타")
      ? [
          ...good_things.filter((item: string) => item !== "기타"),
          other_good_things,
        ]
      : good_things;

    const { data, error } = await supabase
      .from("company_reviews")
      .insert({
        user_id: userId,
        company_name,
        lawyer_type,
        employment_terms,
        good_things: combinedGoodThings,
        overall_rating,
        work_life_balance,
        salary_benefits,
        career_growth,
        culture_fit,
        management,
        pros,
        cons,
        additional_comments,
        overtime_frequency,
        overtime_comments,
        years_of_experience: years_of_experience
          ? parseInt(years_of_experience)
          : null,
        salary: salary ? parseInt(salary) : null,
        salary_type,
        status: "pending", // Set the initial status to 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting company review:", error);
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
