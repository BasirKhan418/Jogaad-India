import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { verifyUserToken } from '@/utils/user/usertoken.verify';
import { cookies } from 'next/headers';
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value || '';
    const isTokenValid = await verifyUserToken(token);
    if (!isTokenValid.success) {
      return NextResponse.json(
        { message: 'Invalid token', success: false },
        { status: 401 }
      );
    }
    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    // Add timestamp to filename to avoid conflicts
    const uniqueFilename = `${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const fileURL = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    return NextResponse.json({ 
      uploadURL, 
      fileURL,
      filename: uniqueFilename 
    });

  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}