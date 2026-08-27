"use server";

import { createHash } from "crypto";
import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";

// Initialize/get SQLite database connection
function getDB(): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const dbDir = path.join(process.cwd(), "database");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, "product.db");
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          sku_code TEXT PRIMARY KEY,
          product_name TEXT,
          category TEXT,
          brand TEXT,
          type TEXT,
          seller_name TEXT,
          price INTEGER,
          buyer_product_status INTEGER,
          seller_product_status INTEGER,
          unlimited_stock INTEGER,
          stock INTEGER,
          multi INTEGER,
          desc TEXT,
          updated_at TEXT
        )
      `, (err2) => {
        if (err2) return reject(err2);
        resolve(db);
      });
    });
  });
}

// Fetch price list from Digiflazz
export async function fetchPriceList(username: string, apiKey: string, cmd: "prepaid" | "pasca" = "prepaid") {
  try {
    if (!username || !apiKey) {
      throw new Error("Username dan API Key wajib diisi");
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
      throw new Error(`Failed to fetch pricelist: HTTP ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result.data || [] };
  } catch (error: any) {
    console.error("Error fetching Digiflazz price list:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}

// Save products to SQLite
export async function savePriceListToSQLite(products: any[]) {
  const db = await getDB();
  return new Promise<{ success: boolean }>((resolve, reject) => {
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO products (
          sku_code, product_name, category, brand, type, seller_name, price,
          buyer_product_status, seller_product_status, unlimited_stock, stock, multi, desc, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const now = new Date().toISOString();
      let hasError = false;
      
      for (const item of products) {
        stmt.run(
          item.buyer_sku_code,
          item.product_name,
          item.category,
          item.brand,
          item.type || "",
          item.seller_name || "",
          item.price || 0,
          item.buyer_product_status ? 1 : 0,
          item.seller_product_status ? 1 : 0,
          item.unlimited_stock ? 1 : 0,
          item.stock || 0,
          item.multi ? 1 : 0,
          item.desc || "",
          now,
          (err) => {
            if (err) {
              hasError = true;
              console.error("Error inserting item:", err);
            }
          }
        );
      }
      
      stmt.finalize((err) => {
        if (err || hasError) {
          db.run("ROLLBACK");
          db.close();
          return reject(err || new Error("Failed to insert some products"));
        }
        
        db.run("COMMIT", (commitErr) => {
          db.close();
          if (commitErr) return reject(commitErr);
          resolve({ success: true });
        });
      });
    });
  });
}

// Fetch products from SQLite
export async function getSyncedProductsFromSQLite() {
  try {
    const db = await getDB();
    return new Promise<{ success: boolean; data: any[] }>((resolve, reject) => {
      db.all("SELECT * FROM products ORDER BY brand ASC, price ASC", (err, rows) => {
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
          price: row.price,
          buyerProductStatus: row.buyer_product_status === 1,
          sellerProductStatus: row.seller_product_status === 1,
          unlimitedStock: row.unlimited_stock === 1,
          stock: row.stock,
          multi: row.multi === 1,
          desc: row.desc,
          updatedAt: row.updated_at
        }));
        
        resolve({ success: true, data: products });
      });
    });
  } catch (error: any) {
    console.error("Error loading products from SQLite:", error);
    return { success: false, error: error.message || "Failed to load products", data: [] };
  }
}

// Sync products from Digiflazz to SQLite directly
export async function syncDigiflazzProducts(username: string, apiKey: string) {
  const result = await fetchPriceList(username, apiKey, "prepaid");
  if (!result.success) {
    return { success: false, error: result.error };
  }
  
  try {
    await savePriceListToSQLite(result.data);
    return { success: true, count: result.data.length };
  } catch (err: any) {
    return { success: false, error: `Failed to save to SQLite: ${err.message}` };
  }
}

// Get actual account balance from Digiflazz
export async function getDigiflazzBalance(username: string, apiKey: string) {
  try {
    if (!username || !apiKey) {
      throw new Error("Username and API Key are required");
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
      throw new Error(result.data.message || "Failed to retrieve balance");
    }
    
    throw new Error(result.message || "Invalid response structure");
  } catch (error: any) {
    console.error("Error fetching Digiflazz balance:", error);
    return { success: false, error: error.message || "Unknown error occurred" };
  }
}

