import { useId, type ReactNode } from "react";
import { Field } from "./Field";

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
  hint?: ReactNode;
}

export function SliderField({ label, value, min, max, step, onChange, format = String, hint }: SliderFieldProps) {
  const id = useId();

  return (
    <Field htmlFor={id} label={label} aside={format(value)} hint={hint}>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={format(value)}
        onChange={(e) => onChange(e.target.valueAsNumber)}
        className="w-full accent-accent"
      />
    </Field>
  );
}
