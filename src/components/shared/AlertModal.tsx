// src/components/shared/AlertModal.tsx
import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { LoaderCircle } from "lucide-react";
import "./styles/AlertModal.css";

export type AlertModalVariant = "danger" | "warning" | "info";

export interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    icon?: ReactNode;
    confirmText?: string;
    cancelText?: string;
    variant?: AlertModalVariant;
    isLoading?: boolean;
}

export const AlertModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    icon,
    confirmText,
    cancelText,
    variant = "info",
    isLoading = false,
}: AlertModalProps) => {
    const { t } = useTranslation("");
    const dialogRef = useRef<HTMLDivElement | null>(null);
    const titleId = useId();
    const descriptionId = useId();

    const resolvedConfirmText = confirmText ?? t("Actions.confirm");
    const resolvedCancelText = cancelText ?? t("Actions.cancel");

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape" && !isLoading) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, isLoading, onClose]);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
        if (event.target === event.currentTarget && !isLoading) {
            onClose();
        }
    };

    return createPortal(
        <div className="alert-modal__overlay" onClick={handleOverlayClick}>
            <div
                ref={dialogRef}
                className={`alert-modal alert-modal--${variant}`}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : descriptionId}
                aria-describedby={descriptionId}
                tabIndex={-1}
            >
                <div className="alert-modal__content">
                    {icon && (
                        <span className="alert-modal__icon" aria-hidden="true">
                            {icon}
                        </span>
                    )}

                    {title && (
                        <h2 id={titleId} className="alert-modal__title">
                            {title}
                        </h2>
                    )}

                    <p id={descriptionId} className="alert-modal__message">
                        {message}
                    </p>
                </div>

                <footer className="alert-modal__footer">
                    <button
                        type="button"
                        className="alert-modal__cancel-btn"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {resolvedCancelText}
                    </button>
                    <button
                        type="button"
                        className="alert-modal__confirm-btn"
                        onClick={onConfirm}
                        disabled={isLoading}
                        aria-busy={isLoading}
                    >
                        {isLoading && (
                            <LoaderCircle
                                size={18}
                                className="alert-modal__spinner"
                                aria-hidden="true"
                            />
                        )}
                        {resolvedConfirmText}
                    </button>
                </footer>
            </div>
        </div>,
        document.body,
    );
};

export default AlertModal;
