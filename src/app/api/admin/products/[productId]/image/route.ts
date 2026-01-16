import { NextResponse, NextRequest } from 'next/server';
import sharp from 'sharp';
import { uploadImageToS3Bucket } from '@/services/upload-file';
import { imageMetaSchema } from '@/validations/image';
import { updateProductTyped } from '@/services/product';
import { requireAdmin } from '@/validations/admin';
import { handleError } from '@/lib/api-error-handler';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    await requireAdmin();

    const productId = parseInt((await params).productId);
    if (Number.isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid productId' }, { status: 400 });
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
    return handleError(err);
  }
}
