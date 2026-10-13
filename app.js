/* ============================================================
   AL AMIN — Islamic Digital Display
   Integrasi Google Sheets via Apps Script
   ============================================================ */

const PRAYERS = [
  { key: "Fajr",    name: "Subuh",  emoji: "🌙" },
  { key: "Sunrise", name: "Terbit", emoji: "🌅" },
  { key: "Dhuhr",   name: "Dzuhur", emoji: "☀️" },
  { key: "Asr",     name: "Ashar",  emoji: "🌤️" },
  { key: "Maghrib", name: "Maghrib",emoji: "🌇" },
  { key: "Isha",    name: "Isya",   emoji: "🌌" }
];

let prayerTimes = {};
let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Jakarta";
let city = "Lokasi perangkat";
let remoteData = null; // data dari Sheets

const $ = id => document.getElementById(id);

/* ---------- UTIL ---------- */
function fmtTime(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone
  }).format(date);
}
function fmtDate(date = new Date()) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: timezone
  }).format(date);
}
function localDateParts() {
  const d = new Date();
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(d);
  return Object.fromEntries(p.filter(x => x.type !== "literal").map(x => [x.type, x.value]));
}
function minutes(t) {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
}

/* ---------- CLOCK ---------- */
function clockTick() {
  $("clock").textContent = fmtTime();
  $("date").textContent = fmtDate();
  $("lastUpdated").textContent = "Live • " + fmtTime();
  updateNext();
}

/* ---------- DATA DARI GOOGLE SHEETS ---------- */
async function fetchRemoteData() {
  const url = CONFIG.APPS_SCRIPT_URL;
  if (!url || url.trim() === "") {
    console.info("[AlAmin] APPS_SCRIPT_URL kosong — pakai data lokal.");
    return null;
  }
  try {
    const r = await fetch(url + "?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const j = await r.json();
    if (j.error) throw new Error(j.error);
    console.info("[AlAmin] Data Sheets berhasil dimuat.");
    return j;
  } catch (e) {
    console.warn("[AlAmin] Gagal fetch Sheets:", e.message);
    return null;
  }
}

function applyData(data) {
  const cfg = (data && data.config) || CONFIG.FALLBACK.config;
  const pengumuman = (data && data.pengumuman) || CONFIG.FALLBACK.pengumuman;
  const quote = (data && data.quote) || CONFIG.FALLBACK.quote;
  const status = (data && data.status) || CONFIG.FALLBACK.status;
  const kajian = (data && data.kajian) || CONFIG.FALLBACK.kajian;

  // Config
  if (cfg.mosque_name) $("mosqueName").textContent = cfg.mosque_name;
  if (cfg.tagline) $("mosqueTagline").textContent = cfg.tagline;
  if (cfg.hero_eyebrow) $("heroEyebrow").textContent = cfg.hero_eyebrow;
  if (cfg.hero_desc) $("heroDesc").textContent = cfg.hero_desc;
  if (cfg.footer) $("footerText").textContent = cfg.footer;
  if (cfg.timezone) timezone = cfg.timezone;

  // Pengumuman
  const activeAnnounce = (pengumuman || []).filter(p => p.active !== false && p.text);
  if (activeAnnounce.length) {
    $("announceBar").hidden = false;
    $("announceText").textContent = activeAnnounce.map(p => p.text).join("   •   ");
  } else {
    $("announceBar").hidden = true;
  }

  // Quote
  if (quote) {
    if (quote.arabic) $("quoteArabic").textContent = quote.arabic;
    if (quote.text) $("quoteText").textContent = quote.text;
    if (quote.source) $("quoteSource").textContent = quote.source;
  }

  // Status
  if (status && status.length) {
    $("statusList").innerHTML = status.map(s =>
      `<div class="info-row"><span>${s.icon || ""} ${s.label}</span><strong>${s.value}</strong></div>`
    ).join("");
  }

  // Kajian
  const activeKajian = (kajian || []).filter(k => k.active !== false);
  if (activeKajian.length) {
    $("kajianSection").hidden = false;
    $("kajianList").innerHTML = activeKajian.map(k => `
      <div class="kajian-card">
        <div class="judul">${k.judul || "—"}</div>
        <div class="meta">
          ${k.ustadz ? `<div>👤 <strong>${k.ustadz}</strong></div>` : ""}
          <div>📅 ${k.hari || "—"} • ${k.jam || "—"}</div>
          ${k.keterangan ? `<div>${k.keterangan}</div>` : ""}
        </div>
      </div>
    `).join("");
  } else {
    $("kajianSection").hidden = true;
  }

  return cfg;
}

/* ---------- LOKASI & JADWAL SHALAT ---------- */
async function getLocation(forceFixed = false) {
  $("locationPill").textContent = "📍 Mencari lokasi...";
  const cfg = (remoteData && remoteData.config) || CONFIG.FALLBACK.config;

  if (forceFixed || cfg.use_fixed_location) {
    city = cfg.mosque_name || "Lokasi Masjid";
    $("locationPill").textContent = `📍 ${city}`;
    timezone = cfg.timezone || timezone;
    await loadPrayerTimes(cfg.latitude, cfg.longitude, cfg.method);
    return;
  }

  if (!navigator.geolocation) {
    await useDefault(cfg);
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const { latitude, longitude } = pos.coords;
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=id`
      );
      const j = await r.json();
      const a = j.address || {};
      city = a.city || a.town || a.village || a.municipality || "Lokasi Anda";
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || timezone;
      $("locationPill").textContent = `📍 ${city}`;
      await loadPrayerTimes(latitude, longitude, cfg.method);
    } catch (e) {
      await useDefault(cfg);
    }
  }, () => useDefault(cfg), { enableHighAccuracy: false, timeout: 7000 });
}

async function useDefault(cfg) {
  city = "Lokasi default";
  $("locationPill").textContent = "📍 Lokasi belum dipilih";
  const lat = cfg.latitude || -2.991;
  const lon = cfg.longitude || 104.756;
  await loadPrayerTimes(lat, lon, cfg.method);
}

async function loadPrayerTimes(lat, lon, method = 11) {
  try {
    const date = localDateParts();
    const url = `https://api.aladhan.com/v1/timings/${date.day}-${date.month}-${date.year}?latitude=${lat}&longitude=${lon}&method=${method}`;
    const r = await fetch(url);
    const j = await r.json();
    prayerTimes = j.data.timings || {};
    renderPrayers();
    updateNext();
  } catch (e) {
    fallbackTimes();
  }
}

function fallbackTimes() {
  prayerTimes = {
    Fajr: "04:45", Sunrise: "06:00", Dhuhr: "12:05",
    Asr: "15:20", Maghrib: "18:05", Isha: "19:15"
  };
  renderPrayers();
}

function renderPrayers() {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  $("prayerGrid").innerHTML = PRAYERS.map(p => {
    const t = prayerTimes[p.key] || "--:--";
    const active = t !== "--:--" && cur >= minutes(t) && cur < minutes(t) + 90;
    return `<div class="prayer ${active ? "active" : ""}">
      <div class="emoji">${p.emoji}</div>
      <div class="prayer-name">${p.name}</div>
      <div class="prayer-time">${t}</div>
    </div>`;
  }).join("");
}

function updateNext() {
  if (!Object.keys(prayerTimes).length) return;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  let next = PRAYERS
    .filter(p => p.key !== "Sunrise")
    .map(p => ({ p, t: prayerTimes[p.key] }))
    .filter(x => x.t)
    .find(x => minutes(x.t) > cur);
  if (!next) next = { p: PRAYERS[0], t: prayerTimes.Fajr };
  $("nextPrayer").textContent = `${next.p.name} • ${next.t}`;
  let diff = minutes(next.t) - cur;
  if (diff < 0) diff += 1440;
  $("countdown").textContent =
    `${String(Math.floor(diff / 60)).padStart(2, "0")}j ${String(diff % 60).padStart(2, "0")}m lagi`;
  renderPrayers();
}

/* ---------- INIT ---------- */
async function init() {
  // 1. Ambil data Sheets
  remoteData = await fetchRemoteData();
  const cfg = applyData(remoteData);

  // 2. Lokasi & jadwal shalat
  await getLocation(cfg.use_fixed_location);

  // 3. Event listeners
  $("locateBtn").addEventListener("click", () => getLocation(false));
  $("fullscreenBtn").addEventListener("click", () => {
    document.documentElement.requestFullscreen?.();
  });
  $("themeBtn").addEventListener("click", () => {
    document.body.classList.toggle("soft");
  });

  // 4. Clock
  setInterval(clockTick, 1000);
  clockTick();

  // 5. Auto-refresh data Sheets
  if (CONFIG.APPS_SCRIPT_URL) {
    setInterval(async () => {
      const fresh = await fetchRemoteData();
      if (fresh) {
        remoteData = fresh;
        applyData(fresh);
      }
    }, CONFIG.REFRESH_INTERVAL);
  }
}

init();
