"use server";

import { createHash } from "crypto";
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

function runSql(db: sqlite3.Database, sql: string): Promise<void> {
  return new Promise((resolve) => {
    db.run(sql, () => {
      // Resolve regardless of error (e.g., if column already exists or table exists)
      resolve();
    });
  });
}

// Initialize/get SQLite database connection with guaranteed schema migration
function getDB(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const dbDir = path.join(process.cwd(), "database");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, "product.db");
    const db = new sqlite3.Database(dbPath, async (err) => {
      if (err) return reject(err);

      try {
        // 1. Create table if not exists
        await runSql(db, `
          CREATE TABLE IF NOT EXISTS products (
            sku_code TEXT PRIMARY KEY,
            product_name TEXT,
            category TEXT,
            brand TEXT,
            type TEXT,
            seller_name TEXT,
            price INTEGER,
            admin INTEGER DEFAULT 0,
            commission INTEGER DEFAULT 0,
            buyer_product_status INTEGER,
            seller_product_status INTEGER,
            unlimited_stock INTEGER,
            stock INTEGER,
            multi INTEGER,
            cmd_type TEXT DEFAULT 'prepaid',
            desc TEXT,
            updated_at TEXT
          )
        `);

        // 2. Run migrations sequentially and await completion
        await runSql(db, "ALTER TABLE products ADD COLUMN admin INTEGER DEFAULT 0");
        await runSql(db, "ALTER TABLE products ADD COLUMN commission INTEGER DEFAULT 0");
        await runSql(db, "ALTER TABLE products ADD COLUMN cmd_type TEXT DEFAULT 'prepaid'");

        resolve(db);
      } catch (migrationErr) {
        reject(migrationErr);
      }
    });
  });
}

// Fetch price list from Digiflazz (supports prepaid & pasca)
export async function fetchPriceList(username: string, apiKey: string, cmd: "prepaid" | "pasca" = "prepaid") {
  try {
    if (!username || !apiKey) {
      throw new Error("Username dan API Key wajib diisi di pengaturan");
    }

    // signature formula: md5(username + apiKey + "pricelist")
    const sign = createHash("md5")
      .update(username + apiKey + "pricelist")
      .digest("hex");

    const response = await fetch("https://api.digiflazz.com/v1/price-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cmd,
        username,
        sign,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil pricelist: HTTP ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error(`Error fetching Digiflazz (${cmd}) price list:`, error);
    return { success: false, error: error.message || "Terjadi kesalahan tidak dikenal", data: [] };
  }
}

// Save products (prepaid or pasca) to SQLite database/product.db
export async function savePriceListToSQLite(products: any[], cmdType: "prepaid" | "pasca" = "prepaid") {
  if (!products || products.length === 0) return { success: true, count: 0 };
  const db = await getDB();
  return new Promise<{ success: boolean; count: number }>((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO products (
          sku_code, product_name, category, brand, type, seller_name, price,
          admin, commission, buyer_product_status, seller_product_status,
          unlimited_stock, stock, multi, cmd_type, desc, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
      let hasError = false;
      let count = 0;
      
      for (const item of products) {
        if (!item.buyer_sku_code) continue;
        count++;
        stmt.run(
          item.buyer_sku_code,
          item.product_name || "",
          item.category || "",
          item.brand || "",
          item.type || "",
          item.seller_name || "",
          item.price || 0,
          item.admin || 0,
          item.commission || 0,
          item.buyer_product_status ? 1 : 0,
          item.seller_product_status ? 1 : 0,
          item.unlimited_stock ? 1 : 0,
          item.stock || 0,
          item.multi ? 1 : 0,
          cmdType,
          item.desc || "",
          now,
          (err) => {
            if (err) {
              hasError = true;
              console.error("Error inserting item into SQLite:", err);
            }
          }
        );
      }
      
      stmt.finalize((err) => {
        if (err || hasError) {
          db.run("ROLLBACK");
          db.close();
          return reject(err || new Error("Gagal menyimpan sebagian produk ke SQLite"));
        }
        
        db.run("COMMIT", (commitErr) => {
          db.close();
          if (commitErr) return reject(commitErr);
          resolve({ success: true, count });
        });
      });
    });
  });
}

// Fetch products from SQLite database/product.db
export async function getSyncedProductsFromSQLite() {
  try {
    const db = await getDB();
    return new Promise<{ success: boolean; data: any[] }>((resolve, reject) => {
      db.all("SELECT * FROM products ORDER BY cmd_type ASC, category ASC, brand ASC, price ASC", (err, rows) => {
        db.close();
        if (err) return reject(err);
        
        const products = rows.map((row: any) => ({
          id: row.sku_code,
          skuCode: row.sku_code,
          productName: row.product_name,
          category: row.category,
          brand: row.brand,
          type: row.type,
          sellerName: row.seller_name,
          price: row.price || 0,
          admin: row.admin || 0,
          commission: row.commission || 0,
          buyerProductStatus: row.buyer_product_status === 1,
          sellerProductStatus: row.seller_product_status === 1,
          unlimitedStock: row.unlimited_stock === 1,
          stock: row.stock || 0,
          multi: row.multi === 1,
          cmdType: row.cmd_type || "prepaid",
          desc: row.desc,
          updatedAt: row.updated_at
        }));
        
        resolve({ success: true, data: products });
      });
    });
  } catch (error: any) {
    console.error("Error loading products from SQLite database/product.db:", error);
    return { success: false, error: error.message || "Gagal memuat produk dari SQLite", data: [] };
  }
}

// Sync products from Digiflazz (Prepaid & Pascabayar) to SQLite database/product.db
export async function syncDigiflazzProducts(username: string, apiKey: string) {
  try {
    if (!username || !apiKey) {
      return { success: false, error: "Username dan API Key DigiFlazz belum diatur." };
    }

    // 1. Fetch Prepaid
    const prepaidRes = await fetchPriceList(username, apiKey, "prepaid");
    let prepaidCount = 0;
    if (prepaidRes.success && prepaidRes.data.length > 0) {
      const saveRes = await savePriceListToSQLite(prepaidRes.data, "prepaid");
      prepaidCount = saveRes.count;
    }

    // 2. Fetch Pasca
    const pascaRes = await fetchPriceList(username, apiKey, "pasca");
    let pascaCount = 0;
    if (pascaRes.success && pascaRes.data.length > 0) {
      const saveRes = await savePriceListToSQLite(pascaRes.data, "pasca");
      pascaCount = saveRes.count;
    }

    if (!prepaidRes.success && !pascaRes.success) {
      return { success: false, error: prepaidRes.error || pascaRes.error };
    }

    return { 
      success: true, 
      count: prepaidCount + pascaCount,
      prepaidCount,
      pascaCount
    };
  } catch (err: any) {
    return { success: false, error: `Gagal sinkronisasi ke SQLite database/product.db: ${err.message}` };
  }
}

// Get actual account balance from Digiflazz
export async function getDigiflazzBalance(username: string, apiKey: string) {
  try {
    if (!username || !apiKey) {
      throw new Error("Username dan API Key wajib diisi");
    }

    const sign = createHash("md5")
      .update(username + apiKey + "depo")
      .digest("hex");

    const response = await fetch("https://api.digiflazz.com/v1/cek-saldo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cmd: "deposit",
        username,
        sign,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to check balance: HTTP ${response.status}`);
    }

    const result = await response.json();
    
    if (result.data && typeof result.data.deposit === "number") {
      return { success: true, balance: result.data.deposit };
    } else if (result.data && result.data.rc === "01") {
      throw new Error(result.data.message || "Gagal mengambil saldo");
    }
    
    throw new Error(result.message || "Struktur respon tidak valid");
  } catch (error: any) {
    console.error("Error fetching Digiflazz balance:", error);
    return { success: false, error: error.message || "Terjadi kesalahan tidak dikenal" };
  }
}
