// app/reviews/lawyer-type-select.tsx

import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface LawyerTypeSelectProps {
  control: any; // This can be typed based on your specific `useForm` control
  name: string; // Name of the form field
  errors: any; // Form errors (for error handling)
}

export const LawyerTypeSelect: React.FC<LawyerTypeSelectProps> = ({
  control,
  name,
  errors,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>직무 유형</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="직무 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corporate Lawyer">송무변</SelectItem>
              <SelectItem value="Inhouse Lawyer">사내변</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
      {errors && errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </div>
  );
};
