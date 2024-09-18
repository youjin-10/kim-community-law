// app/api/reviews/company/route.ts

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { getUserId } from "@/utils/getUserId";
import * as z from "zod"; // For validating the request data

// Define the expected structure of the incoming data using Zod
const reviewSchema = z.object({
  company_name: z.string(),
  lawyer_type: z.string(),
  employment_terms: z.string(),
  good_things: z.array(z.string()),
  other_good_things: z.string().optional(),
  overall_rating: z.number().min(1).max(5),
  work_life_balance: z.number().min(1).max(5),
  salary_benefits: z.number().min(1).max(5),
  career_growth: z.number().min(1).max(5),
  culture_fit: z.number().min(1).max(5),
  management: z.number().min(1).max(5),
  pros: z.string().optional(),
  cons: z.string().optional(),
  additional_comments: z.string().optional(),
  overtime_frequency: z.string(),
  overtime_comments: z.string().optional(),
  years_of_experience: z.string().optional(),
  salary: z.string().optional(),
  salary_type: z.enum(["연봉", "월급"]).optional(),
  free_opinion: z.string().optional(),
  how_found: z.string(),
  other_how_found: z.string().optional(), // Optional field for "etc"
});

export async function POST(request: Request) {
  const supabase = createClient();

  try {
    const userId = await getUserId();

    // Parse and validate the request body
    const body = await request.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.format() },
        { status: 400 }
      );
    }

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
      free_opinion,
      how_found,
      other_how_found,
    } = result.data; // Now result.data is guaranteed to be valid

    // Combine good_things and other_good_things if necessary
    const combinedGoodThings = good_things.includes("기타")
      ? [
          ...good_things.filter((item: string) => item !== "기타"),
          other_good_things,
        ]
      : good_things;

    // Insert the review into Supabase
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
        free_opinion,
        how_found,
        other_how_found: how_found === "etc" ? other_how_found : null,
        status: "pending", // Set initial status to 'pending'
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
