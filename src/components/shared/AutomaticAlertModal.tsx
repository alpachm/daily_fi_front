// src/components/shared/AutomaticAlertModal.tsx
import { useEffect } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import "./styles/AutomaticAlertModal.css";

export type AutomaticAlertVariant = "success" | "error" | "warning" | "info";

export interface AutomaticAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    icon?: ReactNode;
    variant?: AutomaticAlertVariant;
    duration?: number;
}

export const AutomaticAlertModal = ({
    isOpen,
    onClose,
    message,
    icon,
    variant = "info",
    duration = 3000,
}: AutomaticAlertModalProps) => {
    useEffect(() => {
        if (!isOpen) return;

        const timeoutId = window.setTimeout(() => {
            onClose();
        }, duration);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="automatic-alert-modal__overlay">
            <div
                className={`automatic-alert-modal automatic-alert-modal--${variant}`}
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                <div className="automatic-alert-modal__content">
                    {icon && (
                        <span className="automatic-alert-modal__icon" aria-hidden="true">
                            {icon}
                        </span>
                    )}
                    <p className="automatic-alert-modal__message">{message}</p>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default AutomaticAlertModal;
