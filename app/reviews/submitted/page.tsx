import Link from "next/link";

export default function ReviewSubmittedPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Thank You for Your Review!</h1>
      <p className="mb-4">
        Your review has been successfully submitted. Our admin team will review
        it shortly.
      </p>
      <p className="mb-4">
        Please note that it may take a few days for your review to be publicly
        visible. We appreciate your patience as we ensure all reviews meet our
        community guidelines.
      </p>
      <p className="mb-4">
        If we need any additional information or revisions, we'll contact you
        directly.
      </p>
      /*
      <Link href="/dashboard" className="text-blue-500 hover:underline">
        Return to Dashboard
      </Link>
      */
      <Link href="/" className="text-blue-500 hover:underline">
        Return to index page
      </Link>
    </div>
  );
}
