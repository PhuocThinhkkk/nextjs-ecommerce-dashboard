import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadImageToS3Bucket } from '@/services/upload-file';
import { imageMetaSchema } from '@/validations/image';
import { updateProductTyped } from '@/services/product';
import { getUserIdInToken } from '@/validations/auth';
import { isAdmin } from '@/services/user';

export async function POST(req: Request) {
  try {
    const userClerkId = await getUserIdInToken();
    const admin = await isAdmin(userClerkId);
    if (!admin) {
      return NextResponse.json({ message: 'not an admin' }, { status: 403 });
    }
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const productIdStr = formData.get('productId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }
    if (!productIdStr) {
      return NextResponse.json({ error: 'No productId' }, { status: 400 });
    }
    const productId = parseInt(productIdStr);

    imageMetaSchema.parse({
      type: file.type,
      size: file.size
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    const processed = await sharp(buffer)
      .resize(256, 256)
      .webp({ quality: 85 })
      .toBuffer();

    const key = `upload/product/${productId}/${crypto.randomUUID()}.webp`;

    await uploadImageToS3Bucket(processed, key, 'image/webp');

    const url = `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const data = {
      photo_url: url
    };

    await updateProductTyped(productId, data);

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 });
  }
}
