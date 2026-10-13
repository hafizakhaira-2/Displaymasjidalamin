# Setup Al Amin Display + Google Sheets (Gratis)

Panduan lengkap dari nol sampai live di GitHub Pages.

---

## 1. Siapkan Google Sheet

1. Buka [https://sheets.google.com](https://sheets.google.com) → **Blank spreadsheet**.
2. Rename spreadsheet jadi: **Al Amin Display DB**
3. Buat **5 sheet** dengan nama persis berikut (klik + di bawah):

| Nama Sheet   | Fungsi                          |
|--------------|---------------------------------|
| Config       | Pengaturan masjid               |
| Pengumuman   | Running text / banner           |
| Quote        | Ayat / Hadits hari ini          |
| Status       | Status fasilitas masjid         |
| Kajian       | Jadwal kajian & kegiatan        |

### Isi setiap sheet (baris 1 = header)

#### Sheet: **Config**
| key                  | value                                      |
|----------------------|--------------------------------------------|
| mosque_name          | AL AMIN                                    |
| tagline              | Islamic Digital Display                    |
| hero_eyebrow         | ✦ WELCOME TO MASJID AL AMIN                |
| hero_desc            | Display masjid modern yang adaptif...      |
| footer               | Al Amin • Sebuah ruang untuk pulang kepada-Nya. |
| latitude             | -6.200000                                  |
| longitude            | 106.816666                                 |
| method               | 11                                         |
| timezone             | Asia/Jakarta                               |
| use_fixed_location   | true                                       |

> **Catatan koordinat**: Ganti `latitude` & `longitude` dengan koordinat masjidmu.  
> `use_fixed_location = true` → tidak minta izin lokasi browser (disarankan untuk TV masjid).  
> `method = 11` = Kementerian Agama RI (bisa diganti sesuai kebutuhan).

#### Sheet: **Pengumuman**
| text                                                                 | active | priority |
|----------------------------------------------------------------------|--------|----------|
| Selamat datang di Masjid Al Amin. Mari jaga kebersihan dan kekhusyukan. | TRUE   | 1        |
| Kajian malam Jumat ba'da Maghrib — jangan lewatkan!                  | TRUE   | 2        |

#### Sheet: **Quote**
| arabic                        | text                                              | source              | active | priority |
|-------------------------------|---------------------------------------------------|---------------------|--------|----------|
| إِنَّ مَعَ الْعُسْرِ يُسْرًا | “Sesungguhnya bersama kesulitan ada kemudahan.”   | QS. Al-Insyirah: 6  | TRUE   | 1        |
| وَاذْكُرُوا اللَّهَ كَثِيرًا | “Dan ingatlah Allah sebanyak-banyaknya.”          | QS. Al-Ahzab: 41    | TRUE   | 0        |

#### Sheet: **Status**
| icon | label      | value           | active |
|------|------------|-----------------|--------|
| 🕌   | Suasana    | Damai & nyaman  | TRUE   |
| 💧   | Air wudhu  | Tersedia        | TRUE   |
| 📶   | Wi-Fi      | AlAmin_Guest    | TRUE   |
| 🅿️   | Parkir     | Tersedia        | TRUE   |
| 🌙   | Kajian     | Malam Jumat     | TRUE   |

#### Sheet: **Kajian**
| judul                      | ustadz          | hari   | jam   | keterangan       | active |
|----------------------------|-----------------|--------|-------|------------------|--------|
| Kajian Rutin Malam Jumat   | Ustadz Ahmad    | Jumat  | 19:30 | Ba'da Maghrib    | TRUE   |
| Tahsin Al-Qur'an           | Ustadzah Fatimah| Sabtu  | 16:00 | Khusus akhwat    | TRUE   |

---

## 2. Pasang Apps Script

1. Di Google Sheet → menu **Extensions** → **Apps Script**.
2. Hapus semua kode default.
3. Buka file `apps-script/Code.gs` dari zip ini → **copy semua** → paste ke editor Apps Script.
4. Klik **Save** (Ctrl+S) → beri nama project: `AlAmin Display API`.
5. Klik **Deploy** → **New deployment**.
6. Klik ikon gear → pilih **Web app**.
7. Isi:
   - Description: `v1`
   - Execute as: **Me**
   - Who has access: **Anyone**
8. Klik **Deploy** → izinkan akses Google Account.
9. **Copy URL** yang muncul (bentuknya: `https://script.google.com/macros/s/XXXX/exec`).

---

## 3. Hubungkan ke Website

1. Buka file `config.js`.
2. Ganti baris ini:

```js
APPS_SCRIPT_URL: "",
```

menjadi:

```js
APPS_SCRIPT_URL: "https://script.google.com/macros/s/XXXX/exec",
```

(paste URL yang tadi di-copy).

3. Simpan.

---

## 4. Deploy ke GitHub Pages

1. Buat repository baru di GitHub (misal: `display-masjid-alamin`).
2. Upload **semua file** di folder ini **kecuali** folder `apps-script/` (opsional, boleh ikut).
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` → folder `/ (root)`.
4. Tunggu 1–2 menit → website live di `https://username.github.io/display-masjid-alamin/`.

Atau pakai custom domain lewat file `CNAME` (sudah disediakan jika sebelumnya ada).

---

## 5. Cara Update Konten Sehari-hari

Cukup buka Google Sheet dari HP/laptop:

- Ganti pengumuman → langsung muncul di display (maks. 3 menit).
- Nonaktifkan kajian → set kolom `active` jadi `FALSE`.
- Ganti ayat hari ini → edit sheet Quote.
- Update status air wudhu / Wi-Fi → edit sheet Status.

Tidak perlu sentuh kode sama sekali.

---

## Tips

| Situasi | Solusi |
|---------|--------|
| TV masjid tidak boleh minta izin lokasi | Set `use_fixed_location = true` + isi koordinat masjid |
| Ingin ganti metode perhitungan shalat | Ubah `method` di Config (lihat dokumentasi AlAdhan) |
| Data tidak muncul | Cek apakah URL di `config.js` benar & deployment "Anyone" |
| Ingin refresh lebih cepat | Ubah `REFRESH_INTERVAL` di `config.js` (ms) |

---

**Selesai!**  
Website tetap 100% gratis (GitHub Pages + Google Sheets + Apps Script).
