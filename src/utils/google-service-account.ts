import * as fs from 'fs';
import * as path from 'path';

/**
 * Decodes the base64 Google service account key from the environment,
 * writes it to a file, and sets GOOGLE_APPLICATION_CREDENTIALS.
 */
function setupGoogleServiceAccountKey(): void {
  const base64Key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64;
  if (typeof base64Key === 'string' && base64Key.length > 0) {
    const keyPath = path.join(
      process.cwd(),
      'src',
      '.secret',
      'google-doc-ai-key.json',
    );
    const keyBuffer = Buffer.from(base64Key, 'base64');
    fs.mkdirSync(path.dirname(keyPath), { recursive: true });
    fs.writeFileSync(keyPath, keyBuffer);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  }
}

export { setupGoogleServiceAccountKey };
