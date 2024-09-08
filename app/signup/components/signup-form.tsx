"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const supabase = createClient();

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nickname: z.string().min(2),
  license: z.instanceof(File),
});

const SignUpForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isSignUpComplete, setIsSignUpComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      nickname: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setIsLoading(true);

    try {
      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: values.email,
          password: values.password,
          options: {
            data: {
              nickname: values.nickname,
            },
          },
        }
      );

      if (signUpError) throw signUpError;

      if (authData.user) {
        // 2. Insert into users table
        const { data: userData, error: usersError } = await supabase
          .from("users")
          .insert({
            auth_id: authData.user.id,
            username: values.nickname,
            email: values.email,
          })
          .select()
          .single();

        if (usersError) throw usersError;

        if (!userData) throw new Error("Failed to create user");

        // 3. Upload the license file
        const fileExt = values.license.name.split(".").pop();
        const fileName = `${authData.user.id}-license.${fileExt}`;
        const { error: uploadError, data: fileData } = await supabase.storage
          .from("lawyer-licenses")
          .upload(fileName, values.license, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // 4. Insert into lawyer_profiles table
        const { error: profileError } = await supabase
          .from("lawyer_profiles")
          .insert({
            user_id: userData.id,
            nickname: values.nickname,
            license_file: fileData?.path,
            status: "pending",
          });

        if (profileError) throw profileError;

        setIsSignUpComplete(true);
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignUpComplete) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Sign Up Successful!</h2>
        <p className="mb-4">
          Thank you for signing up. We've sent a confirmation email to{" "}
          <strong>{form.getValues("email")}</strong>.
        </p>
        <p className="mb-4">
          Please check your email and click on the confirmation link to activate
          your account.
        </p>
        <p className="mb-4">
          If you don't see the email in your inbox, please check your spam
          folder.
        </p>
        <p className="mb-4">
          Once you've confirmed your email, you can proceed to log in.
        </p>
        <Button onClick={() => router.push("/login")}>Go to Login Page</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lawyer's License (PDF or Image)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) =>
                    field.onChange(e.target.files ? e.target.files[0] : null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing Up
            </>
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
