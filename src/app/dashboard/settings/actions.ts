'use server';

import fs from 'fs';
import path from 'path';

/**
 * Server action untuk mengambil daftar file .png unik dari direktori avatar.
 */
export async function getAvatarFiles() {
  try {
    const directoryPath = path.join(process.cwd(), 'public', 'img', 'ava');
    
    if (!fs.existsSync(directoryPath)) {
      console.warn('Direktori avatar tidak ditemukan:', directoryPath);
      return [];
    }

    const files = fs.readdirSync(directoryPath);
    
    // Filter hanya file .png, abaikan dev.png (akan ditangani manual di klien)
    const pngFiles = files.filter(file => 
      file.toLowerCase().endsWith('.png') && 
      file.toLowerCase() !== 'dev.png'
    );

    // Pastikan daftar file unik (mencegah masalah casing pada sistem file tertentu)
    const uniqueFiles = Array.from(new Set(pngFiles));
    
    return uniqueFiles;
  } catch (error) {
    console.error('Gagal membaca direktori avatar:', error);
    return [];
  }
}
