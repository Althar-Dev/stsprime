
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

    // Inisialisasi S3 Client dengan opsi tambahan untuk stabilitas R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      // Penting untuk R2 agar tidak terjadi kesalahan resolusi bucket
      forcePathStyle: true,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Pembersihan nama file yang lebih aman
    const fileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Pembersihan Base URL (Menghilangkan trailing slash dan memastikan https)
    let baseUrl = config.publicUrl.trim();
    if (!baseUrl) {
      throw new Error("Public URL Endpoint belum diisi di pengaturan.");
    }

    if (!baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}`;
    }
    baseUrl = baseUrl.replace(/\/$/, "");
    
    // Gunakan URL absolut yang bersih
    const finalUrl = `${baseUrl}/${key}`;
    
    return {
      success: true,
      url: finalUrl,
    };
  } catch (error: any) {
    console.error("R2 Upload Error details:", error);
    return {
      success: false,
      error: error.message || "Gagal mengunggah file ke R2 karena gangguan koneksi.",
    };
  }
}
