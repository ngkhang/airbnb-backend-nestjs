import { v4 as uuidV4, stringify, parse } from 'uuid';

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

/**
 * Convert a string UUID to a binary UUID
 *
 * @returns A UUID binary
 */
export const uuidToBinary = (uuid: string): Uint8Array => parse(uuid);
