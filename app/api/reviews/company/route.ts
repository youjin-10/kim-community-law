import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getUserId } from "@/utils/getUserId";

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const userId = await getUserId();

    const {
      company_name,
      overall_rating,
      work_life_balance,
      salary_benefits,
      career_growth,
      management,
      pros,
      cons,
      additional_comments,
    } = await request.json();

    const { data, error } = await supabase
      .from("company_reviews")
      .insert({
        user_id: userId,
        company_name,
        overall_rating,
        work_life_balance,
        salary_benefits,
        career_growth,
        management,
        pros,
        cons,
        additional_comments,
        status: "pending", // Set the initial status to 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting company review:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // return NextResponse.json(data);
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
      { status: 500 },
    );
  }
}
