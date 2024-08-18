// app/signup/components/signup-form.tsx

import SignUpForm from "./components/signup-form";

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Sign Up</h1>
      <SignUpForm />
    </div>
  );
}