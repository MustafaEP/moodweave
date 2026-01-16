# 📄 MoodWeave — AI-Powered Mood Based Music Recommendation

MoodWeave, kullanıcının yazdığı metinden ruh halini analiz eden ve bu ruh haline göre Spotify üzerinden müzik önerileri sunan, production-grade bir web uygulamasıdır.

## 🌐 Live Demo

https://moodweave.mustafaerhanportakal.com

## 🚀 Özellikler

- 🧠 AI destekli ruh hali analizi (FastAPI)
- 🎵 Ruh haline göre Spotify müzik önerileri
- 🌍 Tek VPS üzerinde çoklu servis mimarisi
- 🔐 HTTPS + rate limiting + logging
- ♻️ Docker healthcheck + otomatik restart
- ⚙️ GitHub Actions ile push → production CI/CD

## 🧱 Sistem Mimarisi

```
Browser
   │
   ▼
Nginx (80/443)
   │
   ▼
Gateway (NestJS)
   │
   ├── AI Service (FastAPI)  → Mood Analysis
   │
   └── Core Service (Django) → Spotify API
   │
   ▼
Frontend (React)
```

### Mimari Kararlar

**Gateway Pattern:**
Tüm istekler tek bir giriş noktasından geçer.

**Service Isolation:**
AI, Core ve Web birbirinden bağımsız container'lardır.

**Security First:**
Core ve AI servisleri internete doğrudan açık değildir.

## 🛠️ Teknoloji Stack

### Backend

- NestJS — API Gateway
- Django — Business logic & Spotify integration
- FastAPI — AI / Mood analysis

### Frontend

- React (Vite)

### DevOps

- Docker & Docker Compose
- Nginx (Reverse Proxy)
- Let's Encrypt (HTTPS)
- GitHub Actions (CI/CD)

## 🔁 API Akışı (Örnek)

```
POST /api/ai/analyze
→ Mood tespiti

GET /api/core/music?mood=happy
→ Spotify müzik önerileri
```

## 🧪 Healthcheck Endpoints

| Servis  | Endpoint      |
| ------- | ------------- |
| Gateway | `/api/health` |
| Core    | `/health/`    |
| AI      | `/health`     |

Docker container'lar unhealthy olduğunda otomatik restart edilir.

## ⚙️ Local Development

```bash
git clone https://github.com/MustafaEP/moodweave.git
cd moodweave
docker compose up -d
```

`.env` dosyası gereklidir (Spotify credentials).

### 🔐 Environment Variables

```env
SPOTIFY_CLIENT_ID=xxxx
SPOTIFY_CLIENT_SECRET=yyyy
ENV=production
```

Secrets repo'ya dahil edilmez.

## 🚀 CI/CD

Her main branch push'unda:

- GitHub Actions tetiklenir
- VPS'e SSH ile bağlanılır
- Docker image'lar rebuild edilir
- Container'lar otomatik güncellenir

Zero-touch deploy.

## 📌 Öğrenilenler

- Gateway & microservice mimarisi
- Production Docker kullanımı
- Healthcheck, rate limiting, logging
- Gerçek CI/CD pipeline kurulumu
- VPS üzerinde multi-domain deployment

## 👤 Geliştirici

**Mustafa Erhan Portakal**  
Backend & DevOps odaklı yazılım geliştirici

- GitHub: https://github.com/MustafaEP
- LinkedIn: (eklemeni öneririm)

## 📎 Lisans

MIT