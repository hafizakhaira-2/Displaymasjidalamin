/**
 * ============================================================
 *  AL AMIN DISPLAY — Google Apps Script
 * ============================================================
 *  Cara pakai:
 *  1. Buka Google Sheet yang sudah disiapkan (lihat SETUP.md)
 *  2. Extensions → Apps Script
 *  3. Hapus kode default, paste seluruh isi file ini
 *  4. Deploy → New deployment → Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy URL Web App → paste ke config.js (APPS_SCRIPT_URL)
 * ============================================================
 */

// Nama sheet (harus sama persis dengan di Google Sheet)
const SHEET = {
  CONFIG: "Config",
  PENGUMUMAN: "Pengumuman",
  QUOTE: "Quote",
  STATUS: "Status",
  KAJIAN: "Kajian"
};

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = {
      config: getConfig(ss),
      pengumuman: getPengumuman(ss),
      quote: getQuote(ss),
      status: getStatus(ss),
      kajian: getKajian(ss),
      updated_at: new Date().toISOString()
    };
    return jsonResponse(data);
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

/* ---------- HELPERS ---------- */
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h => String(h).trim().toLowerCase());
  return values.slice(1)
    .filter(row => row.some(cell => cell !== "" && cell !== null))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  return String(v).toLowerCase() === "true" || String(v) === "1" || String(v).toLowerCase() === "ya";
}

/* ---------- CONFIG (key-value) ---------- */
function getConfig(ss) {
  const sheet = ss.getSheetByName(SHEET.CONFIG);
  if (!sheet) return {};
  const values = sheet.getDataRange().getValues();
  const cfg = {};
  values.slice(1).forEach(row => {
    const key = String(row[0] || "").trim();
    const val = row[1];
    if (key) cfg[key] = val;
  });
  // Normalisasi tipe
  if (cfg.latitude) cfg.latitude = Number(cfg.latitude);
  if (cfg.longitude) cfg.longitude = Number(cfg.longitude);
  if (cfg.method) cfg.method = Number(cfg.method);
  if (cfg.use_fixed_location !== undefined) {
    cfg.use_fixed_location = toBool(cfg.use_fixed_location);
  }
  return cfg;
}

/* ---------- PENGUMUMAN ---------- */
function getPengumuman(ss) {
  const sheet = ss.getSheetByName(SHEET.PENGUMUMAN);
  if (!sheet) return [];
  return sheetToObjects(sheet)
    .filter(r => toBool(r.active !== undefined ? r.active : true))
    .map(r => ({
      text: String(r.text || "").trim(),
      active: true,
      priority: Number(r.priority) || 0
    }))
    .filter(r => r.text)
    .sort((a, b) => b.priority - a.priority);
}

/* ---------- QUOTE (ambil 1 yang aktif, atau random) ---------- */
function getQuote(ss) {
  const sheet = ss.getSheetByName(SHEET.QUOTE);
  if (!sheet) return null;
  const rows = sheetToObjects(sheet)
    .filter(r => toBool(r.active !== undefined ? r.active : true));
  if (!rows.length) return null;
  // Ambil yang punya priority tertinggi, atau random
  rows.sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0));
  const pick = rows[0];
  return {
    arabic: String(pick.arabic || "").trim(),
    text: String(pick.text || "").trim(),
    source: String(pick.source || "").trim()
  };
}

/* ---------- STATUS ---------- */
function getStatus(ss) {
  const sheet = ss.getSheetByName(SHEET.STATUS);
  if (!sheet) return [];
  return sheetToObjects(sheet)
    .filter(r => toBool(r.active !== undefined ? r.active : true))
    .map(r => ({
      icon: String(r.icon || "").trim(),
      label: String(r.label || "").trim(),
      value: String(r.value || "").trim()
    }))
    .filter(r => r.label);
}

/* ---------- KAJIAN ---------- */
function getKajian(ss) {
  const sheet = ss.getSheetByName(SHEET.KAJIAN);
  if (!sheet) return [];
  return sheetToObjects(sheet)
    .filter(r => toBool(r.active !== undefined ? r.active : true))
    .map(r => ({
      judul: String(r.judul || "").trim(),
      ustadz: String(r.ustadz || "").trim(),
      hari: String(r.hari || "").trim(),
      jam: String(r.jam || "").trim(),
      keterangan: String(r.keterangan || "").trim(),
      active: true
    }))
    .filter(r => r.judul);
}
