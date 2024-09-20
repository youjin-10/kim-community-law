// components/EmploymentTermsSelect.tsx

import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface EmploymentTermsSelectProps {
  control: any; // The form control object from react-hook-form
  name: string; // Name of the field
  errors: any; // Form errors (for error handling)
}

export const EmploymentTermsSelect: React.FC<EmploymentTermsSelectProps> = ({
  control,
  name,
  errors,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>고용 형태</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      {errors && errors[name] && (
        <p className="text-red-500 text-sm">{errors[name].message}</p>
      )}
    </div>
  );
};
