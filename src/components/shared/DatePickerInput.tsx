// src/components/shared/DatePickerInput.tsx
import type { ChangeEvent } from "react";
import "./styles/DatePickerInput.css";

interface DatePickerInputProps {
    id?: string;
    value: string | null;
    max: string;
    ariaLabel?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}

export const DatePickerInput = ({
    id,
    value,
    max,
    ariaLabel,
    disabled = false,
    onChange,
}: DatePickerInputProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
    };

    return (
        <input
            id={id}
            type="date"
            className="date-picker-input"
            value={value ?? ""}
            max={max}
            disabled={disabled}
            onChange={handleChange}
            aria-label={ariaLabel}
        />
    );
};

export default DatePickerInput;
