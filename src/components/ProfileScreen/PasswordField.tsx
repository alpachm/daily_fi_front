// src/components/ProfileScreen/PasswordField.tsx
import type { ChangeEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./styles/PasswordField.css";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    isVisible: boolean;
    autoComplete: "current-password" | "new-password";
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onToggleVisibility: () => void;
    showLabel: string;
    hideLabel: string;
}

export const PasswordField = ({
    id,
    label,
    value,
    isVisible,
    autoComplete,
    onChange,
    onToggleVisibility,
    showLabel,
    hideLabel,
}: PasswordFieldProps) => {
    return (
        <div className="password-field">
            <label className="password-field__label" htmlFor={id}>
                {label}
            </label>
            <div className="password-field__wrap">
                <input
                    id={id}
                    className="password-field__input"
                    type={isVisible ? "text" : "password"}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                />
                <button
                    type="button"
                    className="password-field__toggle"
                    onClick={onToggleVisibility}
                    aria-label={isVisible ? hideLabel : showLabel}
                >
                    {isVisible ? (
                        <EyeOff size={18} aria-hidden="true" />
                    ) : (
                        <Eye size={18} aria-hidden="true" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordField;
