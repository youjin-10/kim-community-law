import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ReviewSubmittedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Thank You for Your Review!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Your review has been successfully submitted. Our admin team will review
            it shortly.
          </p>
          <p>
            Please note that it may take a few days for your review to be publicly
            visible. We appreciate your patience as we ensure all reviews meet our
            community guidelines.
          </p>
          <p>
            If we need any additional information or revisions, we'll contact you
            directly.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">
              Return to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              Return to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
