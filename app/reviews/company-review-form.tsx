// app/reviews/company-review-form.tsx

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
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const reviewSchema = z
  .object({
    companyName: z.string().min(1, "Company name is required"),
    lawyerType: z.enum(["Corporate Lawyer", "Inhouse Lawyer"]),
    employmentTerms: z.enum(["Regular", "Part-time", "etc"]),
    goodThings: z.array(z.string()).refine((value) => value.length > 0, {
      message: "Please select at least one good thing",
    }),
    otherGoodThings: z.string().optional().nullable(),
    overallRating: z.number().min(1).max(5),
    workLifeBalance: z.number().min(1).max(5),
    salaryBenefits: z.number().min(1).max(5),
    careerGrowth: z.number().min(1).max(5),
    cultureFit: z.number().min(1).max(5),
    management: z.number().min(1).max(5),
    pros: z.string().optional(),
    cons: z.string().optional(),
    additionalComments: z.string().optional(),
    overtimeFrequency: z.enum(["없음", "주 1-2회", "주 3-4회", "주 5회"]),
    overtimeComments: z.string().optional(),
    yearsOfExperience: z.number().min(0).max(50).optional(),
    salary: z.number().min(0).optional(),
    salaryType: z.enum(["연봉", "월급"]).optional(),
    freeOpinion: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.goodThings.includes("기타") && !data.otherGoodThings) {
        return false;
      }
      return true;
    },
    {
      message: "Please specify other good things",
      path: ["otherGoodThings"],
    }
  );

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function CompanyReviewForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      goodThings: [],
      overallRating: 3,
      workLifeBalance: 3,
      salaryBenefits: 3,
      careerGrowth: 3,
      cultureFit: 3,
      management: 3,
      overtimeFrequency: undefined,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    try {
      const goodThings = data.goodThings.includes("기타")
        ? [
            ...data.goodThings.filter((item) => item !== "기타"),
            data.otherGoodThings,
          ]
        : data.goodThings;

      const response = await fetch("/api/reviews/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: data.companyName,
          lawyer_type: data.lawyerType,
          employment_terms: data.employmentTerms,
          good_things: goodThings,
          overall_rating: data.overallRating,
          work_life_balance: data.workLifeBalance,
          salary_benefits: data.salaryBenefits,
          career_growth: data.careerGrowth,
          culture_fit: data.cultureFit,
          management: data.management,
          pros: data.pros,
          cons: data.cons,
          additional_comments: data.additionalComments,
          overtime_frequency: data.overtimeFrequency,
          overtime_comments: data.overtimeComments,
          years_of_experience: data.yearsOfExperience,
          salary: data.salary,
          salary_type: data.salaryType,
          free_opinion: data.freeOpinion,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.redirectTo) {
          router.push(result.redirectTo);
        }
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const RatingSlider = ({
    control,
    name,
    label,
  }: {
    control: any;
    name: keyof ReviewFormData;
    label: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <Slider
              min={1}
              max={5}
              step={1}
              value={[value]}
              onValueChange={(values) => onChange(values[0])}
            />
            <div className="text-right">{value}/5</div>
          </>
        )}
      />
    </div>
  );

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>재직 후기 제출</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">회사 이름</Label>
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

          <div className="space-y-2">
            <Label htmlFor="lawyerType">Lawyer Type</Label>
            <Controller
              name="lawyerType"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lawyer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate Lawyer">
                      Corporate Lawyer
                    </SelectItem>
                    <SelectItem value="Inhouse Lawyer">
                      Inhouse Lawyer
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.lawyerType && (
              <p className="text-red-500 text-sm">
                {errors.lawyerType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentTerms">고용 형태</Label>
            <Controller
              name="employmentTerms"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="고용 형태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular">정직</SelectItem>
                    <SelectItem value="Part-time">계약직</SelectItem>
                    <SelectItem value="etc">기타</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employmentTerms && (
              <p className="text-red-500 text-sm">
                {errors.employmentTerms.message}
              </p>
            )}
          </div>

          <RatingSlider
            control={control}
            name="overallRating"
            label="전체 평점"
          />
          <RatingSlider
            control={control}
            name="careerGrowth"
            label="커리어 & 성장"
          />
          <RatingSlider
            control={control}
            name="workLifeBalance"
            label="워라밸"
          />
          <RatingSlider control={control} name="cultureFit" label="조직 문화" />
          <RatingSlider control={control} name="management" label="임원진" />
          <RatingSlider
            control={control}
            name="salaryBenefits"
            label="연봉 & 복지"
          />

          <div className="space-y-2">
            <Label>재직 하셨을 때 좋았던 점은 무엇이었나요?</Label>
            <div className="space-y-2">
              {[
                "정시출퇴근",
                "유연근무제 사용가능",
                "자유로운 연차사용 가능",
                "야근 거의 없음",
                "여름 휴정 휴가",
                "겨울 휴정 휴가",
                "기타",
              ].map((item) => (
                <div key={item} className="flex items-center">
                  <Controller
                    name="goodThings"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value?.includes(item)}
                        onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          const updatedValue = checked
                            ? [...currentValue, item]
                            : currentValue.filter((i) => i !== item);
                          field.onChange(updatedValue);
                        }}
                      />
                    )}
                  />
                  <Label className="ml-2">{item}</Label>
                </div>
              ))}
            </div>
            {errors.goodThings && (
              <p className="text-red-500 text-sm">
                {errors.goodThings.message}
              </p>
            )}
          </div>

          {watch("goodThings")?.includes("기타") && (
            <div className="space-y-2">
              <Label htmlFor="otherGoodThings">기타 좋은 점</Label>
              <Controller
                name="otherGoodThings"
                control={control}
                rules={{ required: "Please specify other good things" }}
                render={({ field }) => (
                  <Textarea {...field} value={field.value ?? ""} />
                )}
              />
              {errors.otherGoodThings && (
                <p className="text-red-500 text-sm">
                  {errors.otherGoodThings.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pros">좋은 점</Label>
            <Controller
              name="pros"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Textarea {...field} />
                  <p className="text-sm text-muted-foreground">
                    회사의 장점이나 긍정적인 측면을 작성해 주세요.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1. 복지 및 급여, 2. 워라밸, 3. 조직문화(연수원과 로스쿨 차별
                    등), 4. 전문분야, 5. 기타 이슈에 대해 작성해 주시면 좋아요.
                  </p>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cons">아쉬운 점</Label>
            <Controller
              name="cons"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Textarea {...field} />
                  <p className="text-sm text-muted-foreground">
                    회사의 단점이나 개선이 필요한 부분을 자유롭게 작성해주세요.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    1. 복지 및 급여, 2. 워라밸, 3. 조직문화(연수원과 로스쿨 차별
                    등), 4. 전문분야, 5. 기타 이슈에 대해 작성해 주시면 좋아요.
                  </p>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalComments">Additional Comments</Label>
            <Controller
              name="additionalComments"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>

          <div className="space-y-2">
            <Label>1주일 기준 야근 횟수</Label>
            <Controller
              name="overtimeFrequency"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1">
                  {["없음", "주 1-2회", "주 3-4회", "주 5회"].map((option) => (
                    <div key={option} className="flex items-center space-x-3">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.overtimeFrequency && (
              <p className="text-red-500 text-sm">
                {errors.overtimeFrequency.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="overtimeComments">야근 관련 추가 코멘트</Label>
            <Controller
              name="overtimeComments"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">경력 (년)</Label>
            <Controller
              name="yearsOfExperience"
              control={control}
              render={({ field }) => (
                <div className="space-y-1">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    onChange={(e) => {
                      const value = Math.max(0, e.target.valueAsNumber);
                      field.onChange(isNaN(value) ? "" : value);
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    경력은 선택사항이며, 통계 목적으로만 사용해요.
                  </p>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>급여 (만원)</Label>
            <div className="flex space-x-2">
              <Controller
                name="salary"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className="flex-grow"
                  />
                )}
              />
              <Controller
                name="salaryType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="연봉">연봉</SelectItem>
                      <SelectItem value="월급">월급</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              급여는 선택사항이며, 통계 목적으로만 사용해요.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeOpinion">자유 의견</Label>
            <Controller
              name="freeOpinion"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="커뮤니티 웹사이트에 대한 자유로운 의견을 남겨주세요."
                />
              )}
            />
            <p className="text-sm text-muted-foreground">
              커뮤니티 웹사이트에 대한 피드백이나 제안 사항을 자유롭게
              작성해주세요.
            </p>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                제출하는 중
              </>
            ) : (
              "재직 후기 제출"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
