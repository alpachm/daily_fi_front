// src/components/ReceipsScreen/UploadReceiptsModal.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import type {
    ChangeEvent,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Upload, X } from "lucide-react";
import "./styles/UploadReceiptsModal.css";

export interface UploadReceiptsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess?: (date: string, files: File[]) => void;
}

const getTodayIsoDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const UploadReceiptsModal = ({
    isOpen,
    onClose,
    onUploadSuccess,
}: UploadReceiptsModalProps) => {
    const { t } = useTranslation("");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const today = useMemo(() => getTodayIsoDate(), []);

    // Reset local state every time the modal closes so it opens fresh next time.
    useEffect(() => {
        if (!isOpen) {
            setSelectedDate(null);
            setSelectedFiles([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
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
    }, [isOpen, onClose]);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedDate(event.target.value || null);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;
        setSelectedFiles(files);
    };

    const handleDropzoneClick = (): void => {
        if (!selectedDate) return;
        fileInputRef.current?.click();
    };

    const handleDropzoneKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleDropzoneClick();
    };

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleUpload = (): void => {
        if (!selectedDate || selectedFiles.length === 0) return;
        onUploadSuccess?.(selectedDate, selectedFiles);
    };

    const canUpload = selectedDate !== null && selectedFiles.length > 0;

    return createPortal(
        <div className="upload-receipts-modal__overlay" onClick={handleOverlayClick}>
            <div
                ref={dialogRef}
                className="upload-receipts-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-receipts-modal-title"
                tabIndex={-1}
            >
                <header className="upload-receipts-modal__header">
                    <h2 id="upload-receipts-modal-title" className="upload-receipts-modal__title">
                        {t("ReceipsScreen.uploadLabel")}
                    </h2>
                    <button
                        type="button"
                        className="upload-receipts-modal__close"
                        onClick={onClose}
                        aria-label={t("Actions.close")}
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </header>

                <div className="upload-receipts-modal__body">
                    <section className="upload-receipts-modal__date-section">
                        <label
                            className="upload-receipts-modal__date-label"
                            htmlFor="upload-receipts-modal-date"
                        >
                            {t("ReceipsScreen.uploadModalDateLabel")}
                        </label>
                        <input
                            id="upload-receipts-modal-date"
                            type="date"
                            className="upload-receipts-modal__date-input"
                            value={selectedDate ?? ""}
                            max={today}
                            onChange={handleDateChange}
                        />
                    </section>

                    <section className="upload-receipts-modal__dropzone-section">
                        <div
                            className={`upload-receipts-modal__dropzone${
                                selectedDate
                                    ? ""
                                    : " upload-receipts-modal__dropzone--disabled"
                            }`}
                            role="button"
                            tabIndex={selectedDate ? 0 : -1}
                            aria-disabled={!selectedDate}
                            onClick={handleDropzoneClick}
                            onKeyDown={handleDropzoneKeyDown}
                        >
                            <Upload
                                size={24}
                                aria-hidden="true"
                                className="upload-receipts-modal__dropzone-icon"
                            />
                            <p className="upload-receipts-modal__dropzone-title">
                                {t("ReceipsScreen.uploadLabel")}
                            </p>
                            <p className="upload-receipts-modal__dropzone-hint">
                                {selectedFiles.length === 0
                                    ? t("ReceipsScreen.uploadModalSelectFiles")
                                    : t("ReceipsScreen.uploadModalFilesSelected", {
                                          count: selectedFiles.length,
                                      })}
                            </p>
                            {selectedFiles.length > 0 && (
                                <ul className="upload-receipts-modal__file-list">
                                    {selectedFiles.map((file, index) => (
                                        <li
                                            key={`${file.name}-${index}`}
                                            className="upload-receipts-modal__file-item"
                                        >
                                            {file.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="upload-receipts-modal__file-input"
                            onChange={handleFileChange}
                            disabled={!selectedDate}
                        />
                    </section>
                </div>

                <footer className="upload-receipts-modal__footer">
                    <button
                        type="button"
                        className="upload-receipts-modal__cancel-btn"
                        onClick={onClose}
                    >
                        {t("Actions.cancel")}
                    </button>
                    <button
                        type="button"
                        className="upload-receipts-modal__upload-btn"
                        disabled={!canUpload}
                        onClick={handleUpload}
                    >
                        {t("ReceipsScreen.uploadModalUploadButton")}
                    </button>
                </footer>
            </div>
        </div>,
        document.body,
    );
};

export default UploadReceiptsModal;
