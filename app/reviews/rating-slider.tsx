// components/RatingSlider.tsx

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface RatingSliderProps {
  control: any; // The form control object from react-hook-form
  name: string; // Name of the field
  label: string; // The label to display above the slider
  min?: number; // Minimum value of the slider (default: 1)
  max?: number; // Maximum value of the slider (default: 5)
  leftHelperText?: string; // Text to display at the left-bottom (for min value)
  rightHelperText?: string;
}

export const RatingSlider: React.FC<RatingSliderProps> = ({
  control,
  name,
  label,
  min = 1,
  max = 5,
  leftHelperText, // Added for left helper text
  rightHelperText, // Added for right helper text
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <>
            <Slider
              min={min}
              max={max}
              step={1}
              value={[value]}
              onValueChange={(values) => onChange(values[0])}
            />
            <div className="flex justify-between text-sm text-gray-400">
              {/* Display left and right helper texts */}
              <span>{leftHelperText}</span>
              <span>{rightHelperText}</span>
            </div>
            <div className="text-right">
              {value}/{max}
            </div>
          </>
        )}
      />
    </div>
  );
};
