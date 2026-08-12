
'use server';

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";
import { v4 as uuidv4 } from 'uuid';

export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * Server Action untuk mengunggah file ke Cloudflare R2
 * @param formData Data form yang berisi file
 * @param folder Folder tujuan di R2 (e.g., 'banners', 'icons')
 */
export async function uploadToR2(formData: FormData, folder: string): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error("Tidak ada file yang dipilih.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const key = `${folder}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    return {
      success: true,
      url: `${R2_PUBLIC_URL}/${key}`,
    };
  } catch (error: any) {
    console.error("R2 Upload Error:", error);
    return {
      success: false,
      error: error.message || "Gagal mengunggah file ke R2.",
    };
  }
}
