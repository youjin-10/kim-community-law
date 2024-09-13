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
        <h2 className="text-2xl font-bold mb-4">회원가입 성공!</h2>
        <p className="mb-4">
          회원가입해 주셔서 감사합니다.{" "}
          <strong>{form.getValues("email")}</strong>로 확인 이메일을 보냈습니다.
        </p>
        <p className="mb-4">
          이메일을 확인하시고 확인 링크를 클릭하여 계정을 활성화해 주세요.
        </p>
        <p className="mb-4">
          받은편지함에서 이메일을 찾을 수 없다면 스팸 폴더를 확인해 주세요.
        </p>
        <p className="mb-4">이메일 확인이 완료되면 로그인하실 수 있습니다.</p>
        <Button onClick={() => router.push("/login")}>
          로그인 페이지로 이동
        </Button>
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
              <FormLabel>이메일</FormLabel>
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
              <FormLabel>비밀번호</FormLabel>
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
              <FormLabel>닉네임</FormLabel>
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
              <FormLabel>변호사 자격증 (PDF 또는 이미지)</FormLabel>
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
              가입 중
            </>
          ) : (
            "회원가입"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
