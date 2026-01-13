import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { uploadImageToS3Bucket } from '@/services/upload-file';
import { imageMetaSchema } from '@/validations/image';
import {
  changeFromUserIdToClerk,
  isAdmin,
  updateUserByClerkId
} from '@/services/user/user.services';
import { requirePermissionToUpdateUser } from '@/validations/update';
import { handleError } from '@/lib/api-error-handler';

export const runtime = 'nodejs';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;
    await requirePermissionToUpdateUser(userId);
    const userClerkId = await changeFromUserIdToClerk(userId);

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

    await updateUserByClerkId(userClerkId, data);

    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return handleError(err);
  }
}
