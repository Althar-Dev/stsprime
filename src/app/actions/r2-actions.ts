'use server';

import { PutObjectCommand, DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";

export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export type DeleteResult = {
  success: boolean;
  count?: number;
  error?: string;
};

export type R2ConfigData = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
};

/**
 * Inisialisasi S3 Client untuk R2
 */
function getS3Client(config: R2ConfigData) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId.trim()}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId.trim(),
      secretAccessKey: config.secretAccessKey.trim(),
    },
    forcePathStyle: true,
  });
}

/**
 * Server Action untuk mengunggah file ke Cloudflare R2
 */
export async function uploadToR2(
  formData: FormData, 
  folder: string, 
  config: R2ConfigData
): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error("Tidak ada file yang dipilih.");
    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucketName) {
      throw new Error("Konfigurasi R2 tidak lengkap.");
    }

    const s3Client = getS3Client(config);
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const key = `${folder}/${safeFileName}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: config.bucketName.trim(),
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }));

    let baseUrl = config.publicUrl.trim().replace(/\/$/, "");
    if (!baseUrl.startsWith('http')) baseUrl = `https://${baseUrl}`;
    
    return {
      success: true,
      url: `${baseUrl}/${key}`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Server Action untuk menghapus banyak file dari R2 sekaligus
 * @param keys Array of object keys (e.g. ['banners/image.jpg', 'banners/image2.png'])
 * @param config Konfigurasi R2
 */
export async function deleteBatchFromR2(
  keys: string[],
  config: R2ConfigData
): Promise<DeleteResult> {
  try {
    if (keys.length === 0) return { success: true, count: 0 };
    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucketName) {
      throw new Error("Konfigurasi R2 tidak lengkap.");
    }

    const s3Client = getS3Client(config);
    
    const command = new DeleteObjectsCommand({
      Bucket: config.bucketName.trim(),
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
        Quiet: false
      }
    });

    const response = await s3Client.send(command);
    
    return {
      success: true,
      count: response.Deleted?.length || 0
    };
  } catch (error: any) {
    console.error("R2 Batch Delete Error:", error);
    return {
      success: false,
      error: error.message || "Gagal menghapus file dari storage R2."
    };
  }
}