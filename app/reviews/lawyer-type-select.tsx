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
      <Label htmlFor={name}>Lawyer Type</Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Select lawyer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corporate Lawyer">Corporate Lawyer</SelectItem>
              <SelectItem value="Inhouse Lawyer">Inhouse Lawyer</SelectItem>
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
