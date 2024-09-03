import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col gap-4">
        <Link href="/account">Account Page</Link>
        <Link href="/admin">Admin Page</Link>
        <Link href="/login">Login Page</Link>
        <Link href="/signup">Sign Up Page</Link>
        <Link href="/reviews">Reviews Page</Link>
        <Link href="/reviews/company/new">Write company review</Link>
        <Link href="/reviews/interview/new">Write interview review</Link>
      </div>
    </main>
  );
}
