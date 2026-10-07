// src/utils/chunkArray.ts

/**
 * Splits `items` into consecutive chunks of at most `size` elements.
 *
 * The last chunk may contain fewer items than `size`. Returns an empty array
 * when `items` is empty, and throws when `size` is not a positive integer.
 */
export const chunkArray = <T>(items: readonly T[], size: number): T[][] => {
    if (!Number.isInteger(size) || size <= 0) {
        throw new RangeError("chunkArray: size must be a positive integer.");
    }

    const chunks: T[][] = [];
    for (let index = 0; index < items.length; index += size) {
        chunks.push(items.slice(index, index + size));
    }
    return chunks;
};

export default chunkArray;
