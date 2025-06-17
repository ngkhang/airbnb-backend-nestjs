import { v4 as uuidV4, stringify } from 'uuid';

/**
 * Generate a binary UUID (Buffer)
 *
 * @returns A Buffer containing the generated UUID.
 */
export const generateBinaryId = (): Buffer => {
  const buffer = Buffer.alloc(16);
  return uuidV4({}, buffer);
};

/**
 * Converts a binary UUID (Buffer) to its string representation.
 *
 * @returns A UUID string
 */
export const binaryToUuid = (binaryUuid: Uint8Array): string => stringify(binaryUuid);
