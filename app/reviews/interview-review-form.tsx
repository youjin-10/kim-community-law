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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const interviewReviewSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  interviewDate: z.string().min(1, "Interview date is required"),
  interviewDifficulty: z.number().min(1).max(5),
  interviewExperience: z.number().min(1).max(5),
  interviewOutcome: z.enum(["Accepted", "Rejected", "Pending", "Withdrew"]),
  interviewProcess: z.string().optional(),
  interviewQuestions: z.string().optional(),
  advice: z.string().optional(),
});

type InterviewReviewFormData = z.infer<typeof interviewReviewSchema>;

export default function InterviewReviewForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, formState: { errors } } = useForm<InterviewReviewFormData>({
    resolver: zodResolver(interviewReviewSchema),
    defaultValues: {
      interviewDifficulty: 3,
      interviewExperience: 3,
      interviewOutcome: "Pending",
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
          position: data.position,
          interview_date: data.interviewDate,
          interview_difficulty: data.interviewDifficulty,
          interview_experience: data.interviewExperience,
          interview_outcome: data.interviewOutcome,
          interview_process: data.interviewProcess,
          interview_questions: data.interviewQuestions,
          advice: data.advice,
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

  const RatingSlider = ({ control, name, label }: { control: any; name: keyof InterviewReviewFormData; label: string }) => (
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
        <CardTitle>Submit Interview Review</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
            {errors.position && <p className="text-red-500 text-sm">{errors.position.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewDate">Interview Date</Label>
            <Controller
              name="interviewDate"
              control={control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            {errors.interviewDate && <p className="text-red-500 text-sm">{errors.interviewDate.message}</p>}
          </div>

          <RatingSlider control={control} name="interviewDifficulty" label="Interview Difficulty" />
          <RatingSlider control={control} name="interviewExperience" label="Interview Experience" />

          <div className="space-y-2">
            <Label htmlFor="interviewOutcome">Interview Outcome</Label>
            <Controller
              name="interviewOutcome"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Withdrew">Withdrew</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewProcess">Interview Process</Label>
            <Controller
              name="interviewProcess"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interviewQuestions">Interview Questions</Label>
            <Controller
              name="interviewQuestions"
              control={control}
              render={({ field }) => <Textarea {...field} />}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advice">Advice for Other Candidates</Label>
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
                Submitting...
              </>
            ) : (
              "Submit Interview Review"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}