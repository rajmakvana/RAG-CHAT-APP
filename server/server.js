import app from './src/app.js';
import { connectDB } from './src/config/dataBase.js';
import dotenv from 'dotenv';
dotenv.config();

// #13 — Validate required env vars at startup
const REQUIRED_ENV_VARS = [
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'DATABASE_URL',
  'GROQ_API_KEY',
  'PINECONE_API_KEY',
  'NOMIC_API_KEY',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
];

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});