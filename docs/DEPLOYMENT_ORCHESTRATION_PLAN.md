# NutriTrack v2: Production Deployment Orchestration Blueprint

**Date:** 2026-11-08  
**Target:** `DickyCandraPermana/nutritrack-v2`  
**Infrastructure Strategy:** Hybrid Zero-Cost Cloud Mesh (Azure Student VM + Tailscale + Cloudflare Tunnel)  
**Status:** Approved & Ready for Deployment  

---

## 1. Resource & Infrastructure Landscape

### A. Current Compute Capacity
1. **Central Server (VPS Jakarta):**
   * **RAM:** 2.0 GiB (1.4 GiB allocated to Hermes Agent, 9Router LLM Gateway, SQLite WAL Bridge).
   * **Available Headroom:** ~500 MiB.
   * **Assessment:** Running the full NutriTrack v2 multi-service stack (Postgres + RabbitMQ + MinIO + Celery Worker) on this server will push memory to >90% and trigger Linux OOM Killer.
2. **Azure Student VM (`vm-portofolio-php`):**
   * **Size:** `Standard_B2ats_v2` (2 vCPUs, 1.0 GiB RAM, 64 GB P6 Premium SSD).
   * **Status:** Running 24/7 in East Asia (`100.67.72.117` on Tailscale Mesh).
   * **Cost:** $0.00 / month (Burstable credits maxed out at 633+).
   * **Available Headroom:** Isolated sandbox dedicated to workloads.

---

## 2. Multi-Service Architecture Breakdown

```
                       [ Internet Users ]
                               │ (HTTPS)
                    [ Cloudflare Edge Tunnel ]
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [ frontend: Nginx ]                   [ backend: Go Fiber ]
   Port :80                              Port :8080
   (Static Vite Assets +                 (REST API, Auth, Nutrition Logic)
    Reverse Proxy /api/ to backend)               │
                                       ┌──────────┼──────────┐
                                       ▼          ▼          ▼
                                  [ Postgres ] [ MinIO ] [ RabbitMQ ]
                                  Port :5432   Port :9000 Port :5672
                                                             │
                                                             ▼
                                                    [ worker-ai: Celery ]
                                                    (OCR & AI Nutrition Extraction)
```

| Service | Technology | CPU footprint | Memory footprint | Host Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | React 19 + Vite + Nginx | Low (<0.05 core) | ~15 - 25 MiB | Azure VM / Vercel Edge |
| **`backend`** | Go Fiber (Static binary) | Low (<0.1 core) | ~25 - 40 MiB | Azure VM |
| **`db`** | PostgreSQL 16 Alpine | Low-Med | ~80 - 120 MiB | Azure VM (Docker Volume) |
| **`rabbitmq`** | RabbitMQ 3 Management | Low-Med | ~100 - 150 MiB | Azure VM |
| **`minio`** | MinIO S3 Object Storage | Low | ~60 - 100 MiB | Azure VM (64 GB SSD Volume) |
| **`worker-ai`** | Python 3.11 + Celery | Med (Spike during OCR) | ~150 - 250 MiB | Azure VM |
| **Total** | 6 Container Orchestration | Peak ~0.6 Core | **Peak ~450 - 650 MiB** | **Optimal on Azure VM** |

---

## 3. Recommended Deployment Topology: Dedicated Azure VM Stack

Menjalankan seluruh stack `docker-compose.yaml` langsung di dalam **Azure VM (`vm-portofolio-php`)**:
* **Keuntungan:**
  1. **Zero Load di Server Utama:** Server Jakarta tetap hening, cepat, dan fokus untuk operasional bot/Hermes.
  2. **Zero Ingress Cost:** Tidak memerlukan IP Publik berbayar Azure. Semua traffic masuk ditangani oleh **Cloudflare Zero Trust Tunnel** (`cloudflared`).
  3. **Keamanan Maksimal:** Port database (`5432`), RabbitMQ (`5672`), dan MinIO (`9000`) tidak terekspos ke internet publik, hanya saling berkomunikasi dalam Docker bridge internal `nutritrack-network`.

---

## 4. Step-by-Step Execution Plan

### Tahap 1: Persiapan Environment di Azure VM
1. Masuk ke Azure VM melalui Tailscale:
   ```bash
   ssh -J thearinazs-server candr@100.67.72.117
   # atau via direct Tailscale SSH
   ```
2. Pastikan Docker dan Docker Compose plugin sudah terinstal:
   ```bash
   docker --version && docker compose version
   ```
3. Setup Swap Memory 2 GiB di Azure VM (sebagai safety cushion untuk Python worker):
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

### Tahap 2: Clone & Konfigurasi Secret
1. Clone repositori ke Azure VM:
   ```bash
   git clone https://github.com/DickyCandraPermana/nutritrack-v2.git /opt/nutritrack-v2
   cd /opt/nutritrack-v2
   ```
2. Buat file `.env` produksi:
   ```bash
   # Production Secrets
   POSTGRES_USER=nutri_admin
   POSTGRES_PASSWORD=<SECURE_GENERATED_PASSWORD>
   POSTGRES_DB=nutritrack
   MINIO_ROOT_USER=minio_admin
   MINIO_ROOT_PASSWORD=<SECURE_GENERATED_PASSWORD>
   RABBITMQ_DEFAULT_USER=rabbit_admin
   RABBITMQ_DEFAULT_PASS=<SECURE_GENERATED_PASSWORD>
   JWT_SECRET=<SECURE_JWT_SECRET_32_BYTES>
   VITE_API_BASE_URL=/api/v1
   ```

### Tahap 3: Build & Launch Multi-Service
1. Jalankan build dan deploy background:
   ```bash
   docker compose up -d --build
   ```
2. Verifikasi status kesehatan container:
   ```bash
   docker compose ps
   docker compose logs backend --tail 20
   ```

### Tahap 4: Routing Domain via Cloudflare Tunnel
1. Tambahkan Ingress Rule pada `cloudflared` di Azure VM:
   ```yaml
   ingress:
     - hostname: nutritrack.thearinazs.my.id
       service: http://localhost:80
     - service: http_status:404
   ```
2. Restart Cloudflare Tunnel service:
   ```bash
   sudo systemctl restart cloudflared
   ```
3. Akses aplikasi di `https://nutritrack.thearinazs.my.id` dengan SSL gratis otomatis dari Cloudflare Edge.

---

## 5. Fallback Alternatif (Serverless Edge Split)
Jika Azure VM ingin tetap ultra-minimalist (hanya Go backend & Postgres):
* **Frontend:** Deploy langsung ke **Vercel** (`pnpm build` langsung terhubung ke GitHub).
* **Database:** Pindahkan ke **Neon PostgreSQL / Supabase Free Tier** (Cloud Managed).
* **Object Storage:** Gunakan **Cloudinary Free Tier** untuk upload foto makanan.
* **Go Backend:** Tetap berjalan di Azure VM atau VPS Jakarta dengan resource <40 MB RAM.
