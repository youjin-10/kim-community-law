// app/reviews/interview-review-form.tsx

"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LawyerTypeSelect } from "./lawyer-type-select";
import { RatingSlider } from "./rating-slider";
import { EmploymentTermsSelect } from "./employment-term-select";

const interviewReviewSchema = z.object({
  companyName: z.string().min(1, "회사명은 필수입니다"),
  lawyerType: z.enum(["Corporate Lawyer", "Inhouse Lawyer"]),
  employmentTerms: z.enum(["Regular", "Part-time", "etc"]),
  interviewDate: z.string().min(1, "면접 날짜는 필수입니다"),
  interviewDifficulty: z.number().min(1).max(5),
  interviewExperience: z.number().min(1).max(5),
  interviewOutcome: z.enum(["합격", "불합격", "대기중", "철회"]),
  interviewProcess: z.string().optional(),
  interviewQuestions: z.string().optional(),
  advice: z.string().optional(),
  salaryNegotiation: z.string().optional(),
});

type InterviewReviewFormData = z.infer<typeof interviewReviewSchema>;

export default function InterviewReviewForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewReviewFormData>({
    resolver: zodResolver(interviewReviewSchema),
    defaultValues: {
      interviewDifficulty: 3,
      interviewExperience: 3,
      interviewOutcome: "대기중",
    },
  });

  const onSubmit = async (data: InterviewReviewFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: data.companyName,
          lawyer_type: data.lawyerType,
          employment_terms: data.employmentTerms,
          interview_date: data.interviewDate,
          interview_difficulty: data.interviewDifficulty,
          interview_experience: data.interviewExperience,
          interview_outcome: data.interviewOutcome,
          interview_process: data.interviewProcess,
          interview_questions: data.interviewQuestions,
          advice: data.advice,
          salary_negotiation: data.salaryNegotiation,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        console.error("리뷰 제출 실패");
      }
    } catch (error) {
      console.error("리뷰 제출 중 오류 발생:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>면접 리뷰 제출</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">회사명</Label>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">
                {errors.companyName.message}
              </p>
            )}
          </div>

          <LawyerTypeSelect
            control={control}
            name="lawyerType"
            errors={errors}
          />

          <EmploymentTermsSelect
            control={control}
            name="employmentTerms"
            errors={errors}
          />

          <div className="space-y-2">
            <Label htmlFor="interviewDate">면접 날짜</Label>
            <Controller
              name="interviewDate"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            {errors.interviewDate && (
              <p className="text-red-500 text-sm">
                {errors.interviewDate.message}
              </p>
            )}
          </div>

          <RatingSlider
            control={control}
            name="interviewDifficulty"
            label="면접 난이도"
            leftHelperText="쉬움"
            rightHelperText="어려움"
          />
          <RatingSlider
            control={control}
            name="interviewExperience"
            label="면접 경험"
            leftHelperText="부정적"
            rightHelperText="긍정적"
          />

          <div className="space-y-2">
            <Label htmlFor="interviewOutcome">면접 결과</Label>
            <Controller
              name="interviewOutcome"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="결과 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="합격">합격</SelectItem>
                    <SelectItem value="불합격">불합격</SelectItem>
                    <SelectItem value="대기중">대기중</SelectItem>
                    <SelectItem value="철회">철회</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewProcess">면접 과정</Label>
            <Controller
              name="interviewProcess"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Textarea {...field} />
                  <p className="text-sm text-muted-foreground">
                    최대한 자세하게 작성해 주세요. 서류 접수 부터 최종 합격까지
                    걸린 시간, 면접 횟수, 면접관은 몇 명인지, 면접 시간, 면접
                    분위기, 팁 등
                  </p>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewQuestions">기억에 남는 면접 질문</Label>
            <Controller
              name="interviewQuestions"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Textarea {...field} />
                  <p className="text-sm text-muted-foreground">
                    최대한 자세하게 작성해주시면, 다른 변호사님들께서 좋은
                    직장을 구하시는데, 더 많은 도움이 될거예요. 법리 질문이
                    있었는지? 있었다면 어떤 내용이었는지, 이력서 바탕
                    질문이었는지? 변시 성적을 물어보는지 등..
                  </p>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salaryNegotiation">연봉 협상 과정</Label>
            <Controller
              name="salaryNegotiation"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Textarea {...field} />
                  <p className="text-sm text-gray-700">
                    면접 과정 중 연봉을 어떻게 협상하셨는지 자유롭게 적어주세요.
                    협상 전략, 팁, 경험을 공유해 주시면 좋습니다.
                  </p>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advice">다른 지원자를 위한 조언</Label>
            <Controller
              name="advice"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                제출 중...
              </>
            ) : (
              "면접 리뷰 제출"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
