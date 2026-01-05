import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadImageToS3Bucket } from '@/services/upload-file';
import { imageMetaSchema } from '@/validations/image';
import { getUserIdInToken } from '@/validations/auth';
import { isAdmin, updateUserByClerkId } from '@/services/user/user.services';

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    let userClerkId: string;
    try {
      userClerkId = await getUserIdInToken();
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const admin = await isAdmin(userClerkId);
    if (!admin && userId !== userClerkId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
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

    const key = `upload/users/${userId}/${crypto.randomUUID()}.webp`;

    await uploadImageToS3Bucket(processed, key, 'image/webp');

    const url = `https://${process.env.AWS_S3_BUCKET}.s3-${process.env.AWS_REGION}.amazonaws.com/${key}`;
    const data = {
      avatar_url: url
    };

    await updateUserByClerkId(userId, data);

    return NextResponse.json({ url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 400 });
  }
}
