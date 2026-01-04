import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { uploadImageToS3Bucket } from '@/services/upload-file';

async function testUpload() {
  const imagePath = path.join(process.cwd(), 'public/images/sign-in.png');

  const fileBuffer = fs.readFileSync(imagePath);

  await uploadImageToS3Bucket(fileBuffer, 'test/avatar.png');

  console.log('✅ Upload success');
}

testUpload().catch(console.error);
