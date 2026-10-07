// src/components/ReceiptsScreen/UploadReceiptsModal.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
    ChangeEvent,
    KeyboardEvent as ReactKeyboardEvent,
    MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Check, LoaderCircle, TriangleAlert, Upload, X } from "lucide-react";
import type { ReceiptType } from "../../hooks/useReceiptsMenu";
import { useUploadReceipts } from "../../hooks/useUploadReceipts";
import {
    UploadReceiptsApiError,
    type UploadReceiptsPayload,
} from "../../interfaces/UploadReceiptsService.interface";
import { getTodayIsoDate } from "../../utils/date";
import { AutomaticAlertModal } from "../shared/AutomaticAlertModal";
import "./styles/UploadReceiptsModal.css";

export interface UploadReceiptsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UploadAlertVariant = "success" | "error" | "warning";

interface UploadAlert {
    variant: UploadAlertVariant;
    message: string;
}

const toUploadType = (type: ReceiptType): "PURCHASE" | "SALE" =>
    type === "buy" ? "PURCHASE" : "SALE";

export const UploadReceiptsModal = ({
    isOpen,
    onClose,
}: UploadReceiptsModalProps) => {
    const { t } = useTranslation("");
    const [selectedDate, setSelectedDate] = useState<string | null>(() =>
        getTodayIsoDate(),
    );
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [receiptType, setReceiptType] = useState<ReceiptType>("buy");
    const [alert, setAlert] = useState<UploadAlert | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const dialogRef = useRef<HTMLDivElement | null>(null);

    const { mutateAsync: uploadReceiptsAsync, isPending } = useUploadReceipts();

    const today = useMemo(() => getTodayIsoDate(), []);

    // Reset local state every time the modal closes so it opens fresh next time.
    const handleClose = useCallback((): void => {
        setSelectedDate(getTodayIsoDate());
        setSelectedFiles([]);
        setReceiptType("buy");
        onClose();
    }, [onClose]);

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

    const handleAlertClose = useCallback((): void => {
        setAlert(null);
    }, []);

    const handleDateChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setSelectedDate(event.target.value || null);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;
        setSelectedFiles(files);
    };

    const handleRemoveFile = (
        event: MouseEvent<HTMLButtonElement>,
        index: number,
    ): void => {
        event.stopPropagation();
        setSelectedFiles((previousFiles) =>
            previousFiles.filter((_, fileIndex) => fileIndex !== index),
        );
    };

    const handleDropzoneClick = (): void => {
        if (!selectedDate || isPending) return;
        fileInputRef.current?.click();
    };

    const handleDropzoneKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        handleDropzoneClick();
    };

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>): void => {
        if (isPending) return;
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };

    const handleUpload = async (): Promise<void> => {
        if (!selectedDate || selectedFiles.length === 0 || isPending) return;

        const payload: UploadReceiptsPayload = {
            date: selectedDate,
            type: toUploadType(receiptType),
            receipts: selectedFiles,
        };

        try {
            const response = await uploadReceiptsAsync(payload);
            const message =
                response.message.trim() !== ""
                    ? response.message
                    : t("ReceiptsScreen.uploadModalSuccessFallback");

            setAlert({ variant: "success", message });
            handleClose();
        } catch (error: unknown) {
            let message = t("ReceiptsScreen.uploadModalErrorGeneric");
            let variant: UploadAlertVariant = "error";

            if (error instanceof UploadReceiptsApiError) {
                if (error.kind === "validation") {
                    message =
                        error.fieldErrors.length > 0
                            ? error.fieldErrors
                                  .map((fieldError) => fieldError.message)
                                  .join(" ")
                            : error.message.trim() !== ""
                              ? error.message
                              : t("ReceiptsScreen.uploadModalErrorValidation");
                } else if (error.kind === "unauthorized") {
                    message = t("ReceiptsScreen.uploadModalErrorUnauthorized");
                } else if (error.kind === "notFound") {
                    message = t("ReceiptsScreen.uploadModalErrorNotFound");
                    variant = "warning";
                } else if (error.kind === "unsupportedMediaType") {
                    message =
                        error.message.trim() !== ""
                            ? error.message
                            : t("ReceiptsScreen.uploadModalErrorFileType");
                } else if (error.kind === "network") {
                    message = t("ReceiptsScreen.uploadModalErrorNetwork");
                }
            }

            setAlert({ variant, message });
        }
    };

    const canUpload = selectedDate !== null && selectedFiles.length > 0;

    const alertIcon =
        alert !== null && alert.variant === "success" ? (
            <Check size={24} aria-hidden="true" />
        ) : (
            <TriangleAlert size={24} aria-hidden="true" />
        );

    return (
        <>
            {isOpen
                ? createPortal(
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
                        {t("ReceiptsScreen.uploadLabel")}
                    </h2>
                    <button
                        type="button"
                        className="upload-receipts-modal__close"
                        onClick={handleClose}
                        disabled={isPending}
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
                            {t("ReceiptsScreen.uploadModalDateLabel")}
                        </label>
                        <input
                            id="upload-receipts-modal-date"
                            type="date"
                            className="upload-receipts-modal__date-input"
                            value={selectedDate ?? ""}
                            max={today}
                            disabled={isPending}
                            onChange={handleDateChange}
                        />
                    </section>

                    <section className="upload-receipts-modal__type-section">
                        <span className="upload-receipts-modal__type-label">
                            {t("ReceiptsScreen.uploadModalTypeLabel")}
                        </span>
                        <div
                            className="upload-receipts-modal__type-group"
                            role="group"
                            aria-label={t("ReceiptsScreen.uploadModalTypeLabel")}
                        >
                            <button
                                type="button"
                                className={`upload-receipts-modal__type-btn${
                                    receiptType === "buy"
                                        ? " upload-receipts-modal__type-btn--active"
                                        : ""
                                }`}
                                disabled={isPending}
                                aria-pressed={receiptType === "buy"}
                                onClick={() => setReceiptType("buy")}
                            >
                                {t("ReceiptsScreen.purchaseLabel")}
                            </button>
                            <button
                                type="button"
                                className={`upload-receipts-modal__type-btn${
                                    receiptType === "sell"
                                        ? " upload-receipts-modal__type-btn--active"
                                        : ""
                                }`}
                                disabled={isPending}
                                aria-pressed={receiptType === "sell"}
                                onClick={() => setReceiptType("sell")}
                            >
                                {t("ReceiptsScreen.saleLabel")}
                            </button>
                        </div>
                    </section>

                    <section className="upload-receipts-modal__dropzone-section">
                        <div
                            className={`upload-receipts-modal__dropzone${
                                selectedDate && !isPending
                                    ? ""
                                    : " upload-receipts-modal__dropzone--disabled"
                            }`}
                            role="button"
                            tabIndex={selectedDate && !isPending ? 0 : -1}
                            aria-disabled={!selectedDate || isPending}
                            onClick={handleDropzoneClick}
                            onKeyDown={handleDropzoneKeyDown}
                        >
                            <Upload
                                size={24}
                                aria-hidden="true"
                                className="upload-receipts-modal__dropzone-icon"
                            />
                            <p className="upload-receipts-modal__dropzone-title">
                                {t("ReceiptsScreen.uploadLabel")}
                            </p>
                            <p className="upload-receipts-modal__dropzone-hint">
                                {selectedFiles.length === 0
                                    ? t("ReceiptsScreen.uploadModalSelectFiles")
                                    : t("ReceiptsScreen.uploadModalFilesSelected", {
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
                                            <span className="upload-receipts-modal__file-name">
                                                {file.name}
                                            </span>
                                            <button
                                                type="button"
                                                className="upload-receipts-modal__file-remove"
                                                onClick={(event) =>
                                                    handleRemoveFile(event, index)
                                                }
                                                disabled={isPending}
                                                aria-label={t(
                                                    "ReceiptsScreen.uploadModalRemoveFile",
                                                    { fileName: file.name },
                                                )}
                                            >
                                                <X size={14} aria-hidden="true" />
                                            </button>
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
                            disabled={!selectedDate || isPending}
                        />
                    </section>
                </div>

                <footer className="upload-receipts-modal__footer">
                    <button
                        type="button"
                        className="upload-receipts-modal__cancel-btn"
                        onClick={handleClose}
                        disabled={isPending}
                    >
                        {t("Actions.cancel")}
                    </button>
                    <button
                        type="button"
                        className="upload-receipts-modal__upload-btn"
                        disabled={!canUpload || isPending}
                        aria-busy={isPending}
                        onClick={handleUpload}
                    >
                        {isPending ? (
                            <LoaderCircle
                                size={18}
                                className="upload-receipts-modal__spinner"
                                aria-hidden="true"
                            />
                        ) : null}
                        {isPending
                            ? t("ReceiptsScreen.uploadModalUploading")
                            : t("ReceiptsScreen.uploadModalUploadButton")}
                    </button>
                </footer>
            </div>
        </div>,
        document.body,
    )
                : null}

            {alert !== null ? (
                <AutomaticAlertModal
                    isOpen
                    onClose={handleAlertClose}
                    message={alert.message}
                    icon={alertIcon}
                    variant={alert.variant}
                />
            ) : null}
        </>
    );
};

export default UploadReceiptsModal;
