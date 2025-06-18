# Receipt Extractor Backend

A robust NestJS backend for extracting structured data from receipt images using Google Document AI and storing the results in MongoDB.

---

## 🚀 Features

- **Upload receipt images** (PNG, JPG, JPEG)
- **Extracts receipt data** (vendor, date, items, tax, total, currency, etc.) using **Google Document AI** (can be enhanced to other AI models in the future)
- **Stores extracted data** in **MongoDB (Atlas)**
- **REST API** for integration with frontend or other services
- **Comprehensive error handling** and validation
- **Unit tests** with Jest

---

## 🛠️ Dependencies

- [NestJS](https://nestjs.com/)
- [Mongoose](https://mongoosejs.com/) (MongoDB ODM)
- [Google Document AI](https://cloud.google.com/document-ai)
- [Multer](https://github.com/expressjs/multer) (file uploads)
- [Jest](https://jestjs.io/) (testing)
- [dotenv](https://www.npmjs.com/package/dotenv) (environment variables)
- [uuid](https://www.npmjs.com/package/uuid) (unique file names)

---

## 🗄️ Database

- **Type:** MongoDB (Atlas or local)
- **Usage:** Stores all extracted receipt data in the `receipts` collection.
- **Connection:** Configured via the `MONGO_URI` environment variable.

---

## 🤖 AI Model

- **Provider:** Google Document AI
- **Usage:** Extracts structured data from receipt images (date, vendor, items, tax, total, etc.)
- **Configuration:** Requires a Google Cloud project, Document AI processor, and a service account with the necessary permissions.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root.  
**Sample:**

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=<your_base64_encoded_service_account_json>
BASE_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
GCP_PROJECT_ID=<your_gcp_project_id>
GCP_LOCATION=us
GCP_PROCESSOR_ID=<your_document_ai_processor_id>
```
- **Google Cloud Document AI Setup:** 
  1. Go to [Google Cloud Console](https://console.cloud.google.com/).
  2. Create a new project (or use an existing one).
  3. Enable the **Document AI API** for your project.
  4. Create a **Document AI Processor** (type: "Document OCR" or "Expense Parser").
  5. Note your **GCP_PROJECT_ID**, **GCP_LOCATION**, and **GCP_PROCESSOR_ID**.
  6. Create a **service account** with the "Document AI API User or (Project ->  Owner)" role.
  **Then configure `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64`:**
  7. Download the service account JSON key.
  8. Encode the JSON file to base64:
     ```sh
     base64 -w 0 your-service-account.json
     ```
  9. Paste the base64 string into your [.env] as `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64`.



## 🧑‍💻 How to Run This Application

### 1. Clone the repository

```sh
git clone <repo-url>
cd receipt-extractor-backend-ai-engineer-rishbitsnbytes
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up your `.env` file

- Copy the sample above and fill in your values.

### 4. Run the application

```sh
npm run start:dev
```

- The server will start on the port specified in `.env` (`PORT`, default: 3000).

### 5. API Usage

- **POST** `/extract-receipt-details`
  - Form-data: `file` (image)
  - Returns: Extracted receipt data as JSON

---

## 🧪 Running Tests

```sh
npm run test
```

- Runs all Jest unit tests.

---

## 🗂️ What to Expect

- **Database:** All extracted receipts are stored in MongoDB.
- **AI Model:** Google Document AI is used for OCR and entity extraction.
- **Uploads:** Uploaded images are stored in `public/uploads/`.
- **Error Handling:** All errors are returned in a consistent JSON format.

---

## 📝 Notes for Developers

- **No hardcoded URLs:** All URLs and credentials are managed via `.env`.
- **Google credentials:** Never commit your raw service account JSON; always use base64 and `.env`.
- **Extensible:** You can add more AI providers by implementing the `DocumentAiProvider` interface.
- **Testing:** Tests are isolated and do not require a real MongoDB or Google AI connection.

---

## 🆘 Troubleshooting

- **MongoDB connection errors:** Check your `MONGO_URI` and network/firewall settings.
- **Google AI errors:** Ensure your service account has Document AI permissions and the processor ID is correct.
- **File upload errors:** Only PNG, JPG, and JPEG files are accepted.

---

## 📬 Contact

For questions or issues, please open an issue in the repository or contact the maintainer.
Rishabh Rathore - rishabhrathore1613@gmail.com

---
