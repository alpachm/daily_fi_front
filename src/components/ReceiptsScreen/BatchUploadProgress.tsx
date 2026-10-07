// src/components/ReceiptsScreen/BatchUploadProgress.tsx
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, Clock, LoaderCircle } from "lucide-react";
import type {
    BatchStatus,
    BatchStatusKind,
} from "../../hooks/useUploadReceipts";
import "./styles/BatchUploadProgress.css";

interface BatchUploadProgressProps {
    batches: BatchStatus[];
}

type BatchStatusLabelKey =
    | "ReceiptsScreen.uploadModalBatchStatusCompleted"
    | "ReceiptsScreen.uploadModalBatchStatusError"
    | "ReceiptsScreen.uploadModalBatchStatusUploading"
    | "ReceiptsScreen.uploadModalBatchStatusPending";

const statusLabelKey = (status: BatchStatusKind): BatchStatusLabelKey => {
    switch (status) {
        case "completed":
            return "ReceiptsScreen.uploadModalBatchStatusCompleted";
        case "error":
            return "ReceiptsScreen.uploadModalBatchStatusError";
        case "uploading":
            return "ReceiptsScreen.uploadModalBatchStatusUploading";
        case "pending":
        default:
            return "ReceiptsScreen.uploadModalBatchStatusPending";
    }
};

const statusIcon = (status: BatchStatusKind): ReactNode => {
    switch (status) {
        case "completed":
            return <CheckCircle2 size={18} aria-hidden="true" />;
        case "error":
            return <AlertCircle size={18} aria-hidden="true" />;
        case "uploading":
            return (
                <LoaderCircle
                    size={18}
                    aria-hidden="true"
                    className="batch-upload-progress__spinner"
                />
            );
        case "pending":
        default:
            return <Clock size={18} aria-hidden="true" />;
    }
};

export const BatchUploadProgress = ({
    batches,
}: BatchUploadProgressProps) => {
    const { t } = useTranslation("");

    const totalBatches = batches.length;
    const completedBatches = batches.filter(
        (batch) => batch.status === "completed",
    ).length;
    const progressPercent =
        totalBatches === 0 ? 0 : Math.round((completedBatches / totalBatches) * 100);

    if (totalBatches === 0) {
        return null;
    }

    return (
        <section
            className="batch-upload-progress"
            aria-label={t("ReceiptsScreen.uploadModalProgressLabel")}
        >
            <div className="batch-upload-progress__header">
                <span className="batch-upload-progress__title">
                    {t("ReceiptsScreen.uploadModalProgressLabel")}
                </span>
                <span className="batch-upload-progress__percent">
                    {progressPercent}%
                </span>
            </div>

            <div
                className="batch-upload-progress__track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressPercent}
                aria-label={t("ReceiptsScreen.uploadModalProgressLabel")}
            >
                <div
                    className="batch-upload-progress__fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <ul className="batch-upload-progress__list">
                {batches.map((batch) => (
                    <li
                        key={batch.id}
                        className={`batch-upload-progress__item batch-upload-progress__item--${batch.status}`}
                    >
                        <span className="batch-upload-progress__icon">
                            {statusIcon(batch.status)}
                        </span>
                        <span className="batch-upload-progress__label">
                            {t("ReceiptsScreen.uploadModalBatchLabel", {
                                batch: batch.id,
                            })}
                        </span>
                        <span className="batch-upload-progress__files">
                            {t("ReceiptsScreen.uploadModalBatchFiles", {
                                count: batch.totalFiles,
                            })}
                        </span>
                        <span className="batch-upload-progress__status">
                            {t(statusLabelKey(batch.status))}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default BatchUploadProgress;
