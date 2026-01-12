# 🎧 MoodWeave

**Explainable, Context-Aware Music Intelligence Platform**

MoodWeave, kullanıcıların yazdığı metinleri (chat, günlük, notlar) analiz ederek duygu, niyet ve bağlam farkındalığına sahip, açıklanabilir ve kişiselleştirilmiş müzik önerileri üreten yapay zeka destekli bir platformdur.

Mevcut müzik platformlarının aksine MoodWeave, yalnızca "benzer şarkılar" önermekle kalmaz; neden bu şarkının önerildiğini açıkça ifade eder ve kullanıcı güvenini merkeze alır.

## 🚩 Problem

- Kullanıcılar ruh hallerini net kelimelerle ifade edemez
- Playlist'ler bağlamdan (zaman, ruh hali, önceki dinlemeler) kopuktur
- Tek bir playlist her duruma uymaz
- Öneriler açıklanmadığı için rastgele hissedilir

MoodWeave, bu problemi metin analizi + bağlam + geçmiş tercihler + explainable AI ile çözer.

## 🧠 Yapay Zeka Yaklaşımı

MoodWeave'de AI yalnızca bir "ekstra" değil, karar mekanizmasının merkezidir.

### Emotion & Intent Extraction
Metinden çoklu duygu ve niyet çıkarımı

### Hybrid Recommendation
- Kural tabanlı filtreler (energy, BPM, valence)
- Kişisel dinleme profili (skip, favori türler)
- LLM destekli strateji seçimi

### Explainability
Her öneri 2–4 maddelik gerekçe ile döner

### Feedback Loop
Kullanıcı geri bildirimleriyle sürekli kalibrasyon

## 🏗️ Sistem Mimarisi

Microservice + BFF yaklaşımı

### 🔹 Node.js (NestJS) – API Gateway / BFF
- Frontend için tek giriş noktası (`/api/*`)
- JWT auth, rate limiting, validation
- WebSocket ile real-time mood & now-playing
- Backend servislerinden gelen verileri birleştirir

### 🔹 Django – Core Platform Service
- Auth, kullanıcı yönetimi, roller
- MoodEntry, MusicHistory, Playlist domain modelleri
- Admin panel & raporlama
- PostgreSQL (jsonb, opsiyonel pgvector)

### 🔹 FastAPI – AI Service
- NLP & LLM orkestrasyonu
- Emotion / intent analizi
- Recommendation planlama
- Embedding & özetleme servisleri
- MongoDB (AI context, logs, prompt/response)

## 🔁 Örnek Akış

**Kullanıcı:** "Deadline var, kafam dolu ama odaklanmam lazım."

**AI Analizi:**
- `anxiety ↑`
- `intent = focus`

**Müzik Hedefleri:**
- Düşük vokal
- Orta tempo
- Dengeli energy

**Çıktı:**
- Odak playlist'i
- 3 maddelik açıklama
- Spotify'da otomatik playlist

## 📊 Üretilen Çıktılar

- Kişiselleştirilmiş şarkı listeleri
- Açıklanabilir öneriler
- Spotify playlist'leri
- Günlük / haftalık mood & listening insight'ları

## 🚀 Geliştirme Durumu

- **MVP:** Temel analiz, öneri, Spotify entegrasyonu
- **V1:** Embedding + feedback loop
- **V2:** Real-time mood chat, A/B test, multi-objective ranking

## 🎯 Hedeflenen Roller

- Backend Developer / Backend Lead
- AI Engineer (LLM Applications)
- Full-Stack Developer
- Solution / AI Architect
