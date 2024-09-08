import { createClient } from "@/utils/supabase/server";
import InterviewReviewForm from "../../interview-review-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function NewInterviewReviewPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login?next=/reviews/interview/new");
  }

  // First, get the user's record from the users table
  const { data: userRecord } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!userRecord) {
    // Handle the case where the user doesn't have a record in the users table
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-xl font-semibold text-red-600">User Profile Not Found</p>
            <p className="mt-2">Please complete your profile setup before submitting a review.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Now use the id from the users table to query the lawyer_profiles table
  const { data: profile } = await supabase
    .from("lawyer_profiles")
    .select("status")
    .eq("user_id", userRecord.id)
    .single();

  if (profile?.status !== "approved") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-xl font-semibold text-red-600">Access Denied</p>
            <p className="mt-2">Only approved users can submit reviews.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Submit an Interview Review</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-6">
            Share your interview experience to help other candidates prepare and succeed.
          </p>
          <InterviewReviewForm />
        </CardContent>
      </Card>
    </div>
  );
}
