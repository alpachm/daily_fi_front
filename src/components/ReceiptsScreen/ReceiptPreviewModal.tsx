// src/components/ReceiptsScreen/ReceiptPreviewModal.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { LoaderCircle, X } from "lucide-react";
import "./styles/ReceiptPreviewModal.css";

export interface ReceiptPreviewModalProps {
    isOpen: boolean;
    fileUrl: string;
    altText: string;
    onClose: () => void;
}

export const ReceiptPreviewModal = ({
    isOpen,
    fileUrl,
    altText,
    onClose,
}: ReceiptPreviewModalProps) => {
    const { t } = useTranslation("");
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const handleClose = useCallback((): void => {
        onClose();
    }, [onClose]);

    // Reset the load state every time the modal opens or points to a new
    // receipt, so the close button stays hidden until the new image loads.
    useEffect(() => {
        setIsImageLoaded(false);
    }, [isOpen, fileUrl]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="receipt-preview-modal__overlay"
            onClick={handleOverlayClick}
        >
            {!isImageLoaded ? (
                <div
                    className="receipt-preview-modal__loading"
                    role="status"
                    aria-label={t("Common.loading")}
                >
                    <LoaderCircle
                        size={40}
                        className="receipt-preview-modal__spinner"
                        aria-hidden="true"
                    />
                </div>
            ) : null}

            <div
                ref={dialogRef}
                className="receipt-preview-modal"
                role="dialog"
                aria-modal="true"
                aria-label={altText}
                tabIndex={-1}
            >
                {isImageLoaded ? (
                    <button
                        type="button"
                        className="receipt-preview-modal__close"
                        onClick={handleClose}
                        aria-label={t("Actions.close")}
                    >
                        <X size={24} aria-hidden="true" />
                    </button>
                ) : null}

                <img
                    src={fileUrl}
                    alt={altText}
                    className={`receipt-preview-modal__image${
                        isImageLoaded
                            ? " receipt-preview-modal__image--visible"
                            : ""
                    }`}
                    onLoad={() => setIsImageLoaded(true)}
                />
            </div>
        </div>,
        document.body,
    );
};

export default ReceiptPreviewModal;
