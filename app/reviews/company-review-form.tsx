"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const reviewSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  overallRating: z.number().min(1).max(5),
  workLifeBalance: z.number().min(1).max(5),
  salaryBenefits: z.number().min(1).max(5),
  careerGrowth: z.number().min(1).max(5),
  management: z.number().min(1).max(5),
  pros: z.string().optional(),
  cons: z.string().optional(),
  additionalComments: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export default function CompanyReviewForm() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 3,
      workLifeBalance: 3,
      salaryBenefits: 3,
      careerGrowth: 3,
      management: 3,
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    const response = await fetch("/api/reviews/company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company_name: data.companyName,
        overall_rating: data.overallRating,
        work_life_balance: data.workLifeBalance,
        salary_benefits: data.salaryBenefits,
        career_growth: data.careerGrowth,
        management: data.management,
        pros: data.pros,
        cons: data.cons,
        additional_comments: data.additionalComments,
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
  };

  const RatingSlider = ({ control, name, label }: { control: any; name: keyof ReviewFormData; label: string }) => (
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
        <CardTitle>Submit Company Review</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
          </div>

          <RatingSlider control={control} name="overallRating" label="Overall Rating" />
          <RatingSlider control={control} name="workLifeBalance" label="Work-Life Balance" />
          <RatingSlider control={control} name="salaryBenefits" label="Salary & Benefits" />
          <RatingSlider control={control} name="careerGrowth" label="Career Growth" />
          <RatingSlider control={control} name="management" label="Management" />

          <div className="space-y-2">
            <Label htmlFor="pros">Pros</Label>
            <Controller
              name="pros"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cons">Cons</Label>
            <Controller
              name="cons"
              control={control}
              render={({ field }) => <Textarea {...field} />}
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
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Company Review</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
