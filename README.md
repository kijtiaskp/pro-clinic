# Pro Clinic

**EN** | [TH](#pro-clinic-th)

LINE LIFF app for customer satisfaction rating form, designed to run inside LINE messenger via LIFF URL.

## Tech Stack

- Vue 3 (Composition API, `<script setup>`)
- Vite 7
- Tailwind CSS v4
- LINE LIFF SDK
- Axios
- browser-image-compression (image compression)
- heic2any (HEIC to JPEG conversion)
- Font Awesome 6

## Getting Started

```bash
npm install
cp .env.example .env   # fill in values
npm run dev
```

Dev server runs with HTTPS (via `@vitejs/plugin-basic-ssl`).
Vite proxy forwards `/api` and `/auth` to dev backend automatically.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server (HTTPS) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Deployment

### 1. Configure Environment Variables

Create a `.env` file with **production** values:

```env
VITE_LIFF_ID=your-liff-id
VITE_AUTH_BASE_URL=https://auth.proclinicth.com
VITE_API_BASE_URL=https://api.proclinicth.com
VITE_API_CLIENT_ID=your-client-id
VITE_API_CLIENT_SECRET=your-client-secret
```

> **Note:** In development, API calls go through Vite's proxy (`/api`, `/auth`).
> In production, the app calls `VITE_AUTH_BASE_URL` and `VITE_API_BASE_URL` directly — there is no proxy.

### 2. Build

```bash
npm run build
```

Output is in the `dist/` directory — static HTML/JS/CSS files ready to serve.

### 3. Preview (Optional)

```bash
npm run preview
```

Serves the `dist/` folder locally to verify the build before deploying.

### 4. Deploy

Upload the `dist/` folder to any static hosting provider. Examples:

**Nginx**

```nginx
server {
    listen 443 ssl;
    server_name rating.proclinicth.com;

    root /var/www/pro-clinic/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> `try_files` is required so that deep links and page refreshes work correctly.

**Vercel / Netlify / Cloudflare Pages**

- Build command: `npm run build`
- Output directory: `dist`
- These platforms handle SPA routing automatically.

**S3 + CloudFront**

- Upload `dist/` to S3 bucket
- Set error document to `index.html`

### 5. Backend CORS

The backend (auth + API servers) must allow the deployed origin in their CORS configuration.
Without this, browser requests from the production domain will be blocked.

### 6. LINE LIFF Console

In the [LINE Developers Console](https://developers.line.biz/), update the LIFF endpoint URL to match the deployed domain (e.g., `https://rating.proclinicth.com`).

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_LIFF_ID` | LINE LIFF app ID |
| `VITE_AUTH_BASE_URL` | Auth server URL (production only) |
| `VITE_API_BASE_URL` | API server URL (production only) |
| `VITE_API_CLIENT_ID` | OAuth client ID for client_credentials flow |
| `VITE_API_CLIENT_SECRET` | OAuth client secret |

---

# Pro Clinic (TH)

[EN](#pro-clinic) | **TH**

แอป LINE LIFF สำหรับแบบประเมินความพึงพอใจของลูกค้า ใช้งานภายใน LINE messenger ผ่าน LIFF URL

## เทคโนโลยีที่ใช้

- Vue 3 (Composition API, `<script setup>`)
- Vite 7
- Tailwind CSS v4
- LINE LIFF SDK
- Axios
- browser-image-compression (บีบอัดรูปภาพ)
- heic2any (แปลง HEIC เป็น JPEG)
- Font Awesome 6

## เริ่มต้นใช้งาน

```bash
npm install
cp .env.example .env   # กรอกค่าตัวแปร
npm run dev
```

Dev server รันผ่าน HTTPS (ใช้ `@vitejs/plugin-basic-ssl`)
Vite proxy จะ forward `/api` และ `/auth` ไปยัง dev backend โดยอัตโนมัติ

## คำสั่ง

| คำสั่ง | รายละเอียด |
| --- | --- |
| `npm run dev` | เริ่ม dev server (HTTPS) |
| `npm run build` | Build สำหรับ production |
| `npm run preview` | ดูตัวอย่าง production build |

## การ Deploy

### 1. ตั้งค่าตัวแปร Environment

สร้างไฟล์ `.env` โดยใส่ค่า **production**:

```env
VITE_LIFF_ID=your-liff-id
VITE_AUTH_BASE_URL=https://auth.proclinicth.com
VITE_API_BASE_URL=https://api.proclinicth.com
VITE_API_CLIENT_ID=your-client-id
VITE_API_CLIENT_SECRET=your-client-secret
```

> **หมายเหตุ:** ใน development, API calls จะผ่าน Vite proxy (`/api`, `/auth`)
> ใน production, แอปจะเรียก `VITE_AUTH_BASE_URL` และ `VITE_API_BASE_URL` โดยตรง — ไม่มี proxy

### 2. Build

```bash
npm run build
```

ผลลัพธ์อยู่ในโฟลเดอร์ `dist/` — ไฟล์ HTML/JS/CSS พร้อม deploy

### 3. Preview (ไม่บังคับ)

```bash
npm run preview
```

เปิดดูโฟลเดอร์ `dist/` ในเครื่องเพื่อตรวจสอบก่อน deploy

### 4. Deploy

อัปโหลดโฟลเดอร์ `dist/` ไปยัง static hosting ที่ต้องการ ตัวอย่าง:

**Nginx**

```nginx
server {
    listen 443 ssl;
    server_name rating.proclinicth.com;

    root /var/www/pro-clinic/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> ต้องใช้ `try_files` เพื่อให้ deep links และการ refresh หน้าทำงานได้ถูกต้อง

**Vercel / Netlify / Cloudflare Pages**

- Build command: `npm run build`
- Output directory: `dist`
- แพลตฟอร์มเหล่านี้จัดการ SPA routing ให้อัตโนมัติ

**S3 + CloudFront**

- อัปโหลด `dist/` ไปยัง S3 bucket
- ตั้ง error document เป็น `index.html`

### 5. Backend CORS

Backend (auth + API servers) ต้องอนุญาต origin ของโดเมนที่ deploy ในการตั้งค่า CORS
หากไม่ตั้งค่า browser จะบล็อก request จากโดเมน production

### 6. LINE LIFF Console

ใน [LINE Developers Console](https://developers.line.biz/) อัปเดต LIFF endpoint URL ให้ตรงกับโดเมนที่ deploy (เช่น `https://rating.proclinicth.com`)

## ตัวแปร Environment

| ตัวแปร | รายละเอียด |
| --- | --- |
| `VITE_LIFF_ID` | LINE LIFF app ID |
| `VITE_AUTH_BASE_URL` | URL ของ Auth server (เฉพาะ production) |
| `VITE_API_BASE_URL` | URL ของ API server (เฉพาะ production) |
| `VITE_API_CLIENT_ID` | OAuth client ID สำหรับ client_credentials flow |
| `VITE_API_CLIENT_SECRET` | OAuth client secret |
