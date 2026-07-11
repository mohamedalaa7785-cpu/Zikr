import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerEnv } from '@/lib/env';

export type S3ObjectPurpose = 'avatar' | 'media' | 'audio' | 'document';

export type PresignedUpload = {
  key: string;
  uploadUrl: string;
  publicUrl: string | null;
  expiresIn: number;
};

const MAX_UPLOAD_BYTES: Record<S3ObjectPurpose, number> = {
  avatar: 5 * 1024 * 1024,
  media: 250 * 1024 * 1024,
  audio: 100 * 1024 * 1024,
  document: 25 * 1024 * 1024,
};

function getS3Config() {
  const env = getServerEnv();
  const configured = Boolean(
    env.AWS_S3_ACCESS_KEY_ID &&
      env.AWS_S3_SECRET_ACCESS_KEY &&
      env.AWS_S3_BUCKET_NAME &&
      env.AWS_S3_REGION,
  );

  return {
    configured,
    accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
    bucket: env.AWS_S3_BUCKET_NAME,
    region: env.AWS_S3_REGION,
    publicBaseUrl: env.AWS_S3_PUBLIC_BASE_URL,
  };
}

export function isS3Configured() {
  return getS3Config().configured;
}

function createS3Client() {
  const config = getS3Config();
  if (!config.configured) {
    throw new Error('AWS S3 is not configured. Set AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME, and AWS_S3_REGION.');
  }

  return {
    bucket: config.bucket,
    publicBaseUrl: config.publicBaseUrl,
    client: new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
  };
}

export function sanitizeS3Segment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

export function buildS3Key(purpose: S3ObjectPurpose, ownerId: string, filename: string) {
  const cleanOwner = sanitizeS3Segment(ownerId) || 'anonymous';
  const cleanFilename = sanitizeS3Segment(filename) || 'file';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${purpose}/${cleanOwner}/${timestamp}-${cleanFilename}`;
}

export async function createPresignedUploadUrl(params: {
  purpose: S3ObjectPurpose;
  ownerId: string;
  filename: string;
  contentType: string;
  contentLength: number;
  expiresIn?: number;
}): Promise<PresignedUpload> {
  const maxBytes = MAX_UPLOAD_BYTES[params.purpose];
  if (params.contentLength <= 0 || params.contentLength > maxBytes) {
    throw new Error(`File size exceeds the ${Math.round(maxBytes / 1024 / 1024)}MB limit for ${params.purpose} uploads.`);
  }

  if (!params.contentType || !/^[\w.+-]+\/[\w.+-]+$/.test(params.contentType)) {
    throw new Error('A valid content type is required for S3 uploads.');
  }

  const { bucket, client, publicBaseUrl } = createS3Client();
  const key = buildS3Key(params.purpose, params.ownerId, params.filename);
  const expiresIn = Math.min(Math.max(params.expiresIn ?? 300, 60), 900);
  const uploadUrl = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: params.contentType,
      ContentLength: params.contentLength,
      Metadata: {
        purpose: params.purpose,
        owner: params.ownerId,
      },
    }),
    { expiresIn },
  );

  return {
    key,
    uploadUrl,
    publicUrl: publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, '')}/${key}` : null,
    expiresIn,
  };
}

export async function createPresignedDownloadUrl(key: string, expiresIn = 300) {
  const { bucket, client } = createS3Client();
  const safeExpiresIn = Math.min(Math.max(expiresIn, 60), 900);
  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), {
    expiresIn: safeExpiresIn,
  });
}

export async function deleteS3Object(key: string) {
  const { bucket, client } = createS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
