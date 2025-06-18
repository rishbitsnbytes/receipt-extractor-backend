import * as fs from 'fs';
import * as path from 'path';

function setupGoogleServiceAccountKey() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64) {
    const keyPath = path.join(
      process.cwd(),
      'src',
      '.secret',
      'google-doc-ai-key.json',
    );
    const keyBuffer = Buffer.from(
      process.env.GOOGLE_SERVICE_ACCOUNT_KEY_BASE64,
      'base64',
    );
    fs.mkdirSync(path.dirname(keyPath), { recursive: true });
    fs.writeFileSync(keyPath, keyBuffer);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;
  }
}

export { setupGoogleServiceAccountKey };
