# Ajaxtreon Backend

Ajaxtreon Backend adalah sistem ERP modular berbasis Node.js dan Firebase yang mendukung proses bisnis seperti manajemen inventaris, pembelian, penjualan, pelanggan, supplier, dan laporan-laporan operasional.

---

## 🚀 Teknologi yang Digunakan

- **Node.js + Express** – Framework backend
- **TypeScript** – Bahasa utama
- **Firebase Firestore** – Basis data
- **Firebase Authentication** – Autentikasi pengguna
- **Modular service architecture** – Terpisah per fitur

---

## 🧱 Struktur Layanan

### 🔐 Auth Service
- Registrasi & login pengguna
- Firebase Authentication

### 👤 User Service
- CRUD pengguna sistem

### 📦 Inventory Service
- Produk
- Kategori produk
- Stok & histori perubahan stok

### 🛒 Order Service
- Manajemen penjualan (sales order)

### 💳 Payment Service
- Integrasi Midtrans (mode sandbox)

### 🧾 Purchase Service
- Manajemen pembelian dari supplier

### 🧑‍💼 Supplier Service
- CRUD data supplier

### 👥 Customer Service
- CRUD data customer/pelanggan

### 📊 Report Service
- `purchasereport` – Laporan pembelian
- `revenuereport` – Laporan pendapatan
- `salesreport` – Laporan penjualan
- `stockreport` – Laporan stok & mutasi
- `customerreport` – Laporan pelanggan
- `supplierreport` – Laporan supplier
- `inventoryturnover` – Perputaran persediaan

---

## ⚙️ Cara Menjalankan Proyek

### 1. Clone Repo
```bash
git clone https://github.com/Ajax-Z01/ajaxtreon-backend
cd ajaxtreon-backend
