// src/components/shared/TablePagination.tsx
import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import "./styles/TablePagination.css";

export interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    pageSizeOptions?: number[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

type PaginationRangeItem = number | "ellipsis";

const DEFAULT_PAGE_SIZE_OPTIONS: number[] = [10, 50, 100];

const getPaginationRange = (
    currentPage: number,
    totalPages: number,
): PaginationRangeItem[] => {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const candidatePages = new Set<number>([
        1,
        totalPages,
        currentPage,
        currentPage - 1,
        currentPage + 1,
    ]);

    const range: PaginationRangeItem[] = [];
    let previousPage = 0;

    Array.from(candidatePages)
        .filter((page) => page >= 1 && page <= totalPages)
        .sort((a, b) => a - b)
        .forEach((page) => {
            if (page - previousPage > 1) {
                range.push("ellipsis");
            }
            range.push(page);
            previousPage = page;
        });

    return range;
};

export const TablePagination = ({
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    canPreviousPage,
    canNextPage,
    onPageChange,
    onPageSizeChange,
}: TablePaginationProps) => {
    const { t } = useTranslation("");
    const paginationRange = getPaginationRange(currentPage, totalPages);

    return (
        <footer className="table-pagination">
            <div className="table-pagination__page-size">
                <label
                    className="table-pagination__page-size-label"
                    htmlFor="table-pagination-page-size"
                >
                    {t("TablePagination.rowsPerPageLabel")}
                </label>
                <div className="table-pagination__select-wrapper">
                    <select
                        id="table-pagination-page-size"
                        className="table-pagination__select"
                        value={pageSize}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                            onPageSizeChange(Number(event.target.value));
                        }}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        size={16}
                        className="table-pagination__select-chevron"
                        aria-hidden="true"
                    />
                </div>
            </div>

            <div className="table-pagination__controls">
                <button
                    type="button"
                    className="table-pagination__page-btn"
                    onClick={() => onPageChange(1)}
                    disabled={!canPreviousPage}
                    aria-label={t("TablePagination.firstPageLabel")}
                >
                    <ChevronsLeft size={18} aria-hidden="true" />
                </button>

                <button
                    type="button"
                    className="table-pagination__page-btn"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canPreviousPage}
                    aria-label={t("TablePagination.prevPageLabel")}
                >
                    <ChevronLeft size={18} aria-hidden="true" />
                </button>

                {paginationRange.map((item, index) => {
                    if (item === "ellipsis") {
                        return (
                            <span
                                key={`table-pagination__ellipsis-${index}`}
                                className="table-pagination__ellipsis"
                                aria-hidden="true"
                            >
                                …
                            </span>
                        );
                    }

                    const pageNumber = item;

                    return (
                        <button
                            key={pageNumber}
                            type="button"
                            className={
                                pageNumber === currentPage
                                    ? "table-pagination__page-btn table-pagination__page-btn--active"
                                    : "table-pagination__page-btn"
                            }
                            onClick={() => onPageChange(pageNumber)}
                            aria-label={t("TablePagination.goToPageLabel", {
                                page: pageNumber,
                            })}
                            aria-current={pageNumber === currentPage ? "page" : undefined}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                <button
                    type="button"
                    className="table-pagination__page-btn"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canNextPage}
                    aria-label={t("TablePagination.nextPageLabel")}
                >
                    <ChevronRight size={18} aria-hidden="true" />
                </button>

                <button
                    type="button"
                    className="table-pagination__page-btn"
                    onClick={() => onPageChange(totalPages)}
                    disabled={!canNextPage}
                    aria-label={t("TablePagination.lastPageLabel")}
                >
                    <ChevronsRight size={18} aria-hidden="true" />
                </button>
            </div>
        </footer>
    );
};

export default TablePagination;
