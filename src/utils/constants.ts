const MIME_TYPES = {
  png: 'image/png',
  jpeg: 'image/jpeg',
} as const;

const IMAGE_MIME_TYPES: readonly string[] = [
  MIME_TYPES.png,
  MIME_TYPES.jpeg,
  'image/jpg',
];

const MAX_FILE_SIZE_IN_BYTES = 5 * 1024 * 1024; // 5 MB

export { MIME_TYPES, IMAGE_MIME_TYPES, MAX_FILE_SIZE_IN_BYTES };
