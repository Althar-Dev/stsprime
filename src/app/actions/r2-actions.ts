
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
 * @param config Konfigurasi R2 yang diambil dari Firestore (Sudah disanitasi menjadi plain object)
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
      throw new Error("Konfigurasi R2 tidak lengkap. Harap periksa pengaturan R2 Storage.");
    }

    // Inisialisasi S3 Client dengan opsi yang dioptimalkan untuk Cloudflare R2
    const s3Client = new S3Client({
      region: "auto", // R2 menggunakan region auto
      endpoint: `https://${config.accountId.trim()}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId.trim(),
        secretAccessKey: config.secretAccessKey.trim(),
      },
      forcePathStyle: true, // Direkomendasikan untuk stabilitas akses bucket R2
    });

    // Konversi file ke Buffer untuk pengiriman S3
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Pembersihan nama file: Hilangkan spasi dan karakter aneh agar URL aman
    const safeFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    const key = `${folder}/${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: config.bucketName.trim(),
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Pembersihan Base URL (Menghilangkan trailing slash dan memastikan protokol https)
    let baseUrl = config.publicUrl.trim();
    if (!baseUrl) {
      throw new Error("Public URL Endpoint belum diisi di pengaturan R2.");
    }

    if (!baseUrl.startsWith('http')) {
      baseUrl = `https://${baseUrl}`;
    }
    baseUrl = baseUrl.replace(/\/$/, "");
    
    // Gabungkan URL dengan key secara aman (tanpa double-slash)
    const finalUrl = `${baseUrl}/${key}`;
    
    return {
      success: true,
      url: finalUrl,
    };
  } catch (error: any) {
    console.error("Server-side R2 Upload Error:", error);
    // Kembalikan pesan error yang bisa dibaca oleh Client Component
    return {
      success: false,
      error: error.message || "Gagal mengunggah karena gangguan teknis pada server.",
    };
  }
}
