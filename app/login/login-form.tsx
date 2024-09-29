"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

const supabase = createClient();

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginForm: React.FC<{ nextUrl: string }> = ({ nextUrl }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      if (data.user) {
        if (data.user.email_confirmed_at) {
          router.push(nextUrl);
        } else {
          setError("로그인하기 전에 이메일을 확인해 주세요.");
          setMessage("확인 이메일을 다시 한 번 보내드릴까요?");
        }
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: form.getValues("email"),
      });

      if (error) throw error;

      setMessage(
        "확인 이메일이 재전송되었습니다. 받은 편지함을 확인해 주세요."
      );
    } catch (error) {
      setError((error as Error).message);
    }
  };

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
                <Input {...field} type="email" />
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
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-red-500">{error}</p>}
        {message && (
          <div>
            <p className="text-blue-500">{message}</p>
            <Button
              type="button"
              onClick={handleResendConfirmation}
              variant="link"
              className="mt-2 text-indigo-600 hover:text-indigo-500">
              확인 이메일 다시 보내기
            </Button>
          </div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로그인하는 중...
            </>
          ) : (
            "로그인"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
