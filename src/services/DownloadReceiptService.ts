// src/services/DownloadReceiptService.ts

const DOWNLOAD_RECEIPT_FALLBACK_EXTENSION = "pdf";

const DOWNLOAD_RECEIPT_FALLBACK_FILENAME = "comprobante.png";

/**
 * Fetches a receipt file and forces a native browser download to the user's
 * local disk instead of opening the image/PDF in a new tab.
 *
 * The fetch is performed anonymously (no `Authorization` or custom API
 * headers) so the request never triggers a CORS preflight. The signed
 * Cloudflare R2 URL is already publicly accessible, so no credentials are
 * required to read the file content.
 */
export const downloadReceiptFile = async (
    fileUrl: string,
    fileName?: string,
): Promise<void> => {
    try {
        const response = await fetch(fileUrl, { method: "GET" });

        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        // Extract a clean filename or fall back to a sensible default.
        const finalFileName =
            fileName ||
            fileUrl.split("/").pop()?.split("?")[0] ||
            DOWNLOAD_RECEIPT_FALLBACK_FILENAME;

        // Programmatically trigger the native file download.
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", finalFileName);
        document.body.appendChild(link);
        link.click();

        // Clean up the temporary DOM node and revoke the in-memory URL.
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Error downloading receipt file:", error);
        throw error;
    }
};

/**
 * Downloads a single receipt file using its already-resolved storage URL.
 *
 * `fileUrl` comes straight from the receipts list (`ReceiptItem.fileUrl`), so
 * the API download endpoint is never called and no authenticated request is
 * issued, avoiding the CORS failure entirely.
 */
export const downloadReceipt = async (
    receiptId: number | string,
    fileUrl: string,
    filename?: string,
): Promise<void> => {
    const resolvedFilename =
        filename !== undefined && filename !== ""
            ? filename
            : `comprobante-${receiptId}.${DOWNLOAD_RECEIPT_FALLBACK_EXTENSION}`;
    await downloadReceiptFile(fileUrl, resolvedFilename);
};

export const DownloadReceiptService = {
    downloadReceipt,
    downloadReceiptFile,
};
