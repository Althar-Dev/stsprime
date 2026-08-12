'use server';

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export type UploadResult = {
  success: boolean;
  url?: string;
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
 * Server Action untuk mengunggah file ke Cloudflare R2 menggunakan konfigurasi dinamis
 * @param formData Data form yang berisi file
 * @param folder Folder tujuan di R2
 * @param config Konfigurasi R2 yang diambil dari Firestore
 */
export async function uploadToR2(
  formData: FormData, 
  folder: string, 
  config: R2ConfigData
): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error("Tidak ada file yang dipilih.");
    }

    if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucketName) {
      throw new Error("Konfigurasi R2 tidak lengkap. Harap periksa pengaturan R2 Storage di menu System.");
    }

    // Inisialisasi S3 Client secara dinamis dengan konfigurasi dari database
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Gunakan nama asli file (file.name)
    // Kita membersihkan nama file dari karakter yang mungkin bermasalah di URL (opsional)
    const sanitizedFileName = file.name.replace(/\s+/g, '-');
    const key = `${folder}/${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Gunakan publicUrl dari config, atau fallback ke format standar R2 dev
    const baseUrl = config.publicUrl.replace(/\/$/, "");
    
    return {
      success: true,
      url: `${baseUrl}/${key}`,
    };
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return {
      success: false,
      error: error.message || "Gagal mengunggah file ke R2.",
    };
  }
}
