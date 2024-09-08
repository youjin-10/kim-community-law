"use client";

import { useSearchParams } from 'next/navigation';
import LoginForm from "./login-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/dashboard';

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm nextUrl={next} />
        </CardContent>
      </Card>
    </div>
  );
}
