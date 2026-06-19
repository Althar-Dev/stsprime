'use server';

import fs from 'fs';
import path from 'path';

/**
 * Server action untuk mengambil daftar file .png dari direktori avatar.
 */
export async function getAvatarFiles() {
  try {
    const directoryPath = path.join(process.cwd(), 'public', 'img', 'ava');
    
    // Pastikan direktori ada
    if (!fs.existsSync(directoryPath)) {
      console.warn('Direktori avatar tidak ditemukan:', directoryPath);
      return [];
    }

    const files = fs.readdirSync(directoryPath);
    
    // Filter hanya file .png dan abaikan dev.png
    return files.filter(file => 
      file.toLowerCase().endsWith('.png') && 
      file.toLowerCase() !== 'dev.png'
    );
  } catch (error) {
    console.error('Gagal membaca direktori avatar:', error);
    return [];
  }
}
