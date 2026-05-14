# 🎯 Şirkete Özel Mülakat Hazırlık Uygulaması

Mülakata gireceğin şirketin adını, web sitesini veya dokümanlarını yükle — yapay zeka sana özel sorular hazırlasın ve seni test etsin.

![Demo](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Node.js-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📸 Arayüzden Görüntüler

<div align="center">
  <img src="frontend/public/img/screenshot (1).png" alt="Arayüz Görseli 1" width="32%">
  <img src="frontend/public/img/screenshot (2).png" alt="Arayüz Görseli 2" width="32%">
  <img src="frontend/public/img/screenshot (3).png" alt="Arayüz Görseli 3" width="32%">
  <br><br>
  <img src="frontend/public/img/screenshot (4).png" alt="Arayüz Görseli 4" width="48%">
  <img src="frontend/public/img/screenshot (5).png" alt="Arayüz Görseli 5" width="48%">
</div>

---

## ✨ Özellikler

- 🏢 **Çoklu Bilgi Kaynağı** — Şirket adı, web sitesi URL'si, serbest metin veya PDF/DOCX dosyası
- 🤖 **AI Soru Üretimi** — Gemini ile şirkete ve pozisyona özel 15 mülakat sorusu
- 📋 **5 Soru Kategorisi** — Şirket araştırması, motivasyon, teknik, davranışsal, senaryo
- ⭐ **Anlık Değerlendirme** — Her cevap puanlanır, güçlü/zayıf yönler gösterilir
- 📊 **Final Raporu** — Test sonunda genel puan, eylem planı ve motivasyon mesajı

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- [Google Gemini API Key](https://aistudio.google.com/apikey) (ücretsiz)

### Adımlar

1. **Repoyu klonlayın:**
```bash
git clone https://github.com/kullanici-adi/sirkete_ozel_mulakat.git
cd sirkete_ozel_mulakat
```

2. **Backend kurulumunu yapın ve sunucuyu başlatın:**
```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını açın ve GEMINI_API_KEY değerini girin
npm start
```

3. **Yeni bir terminal açıp Frontend kurulumunu yapın ve uygulamayı başlatın:**
```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışmaya başlayacaktır. Backend sunucunuz ise `3001` portunda çalışmaya devam etmelidir.

---

## 📁 Proje Yapısı

```
sirkete_ozel_mulakat/
├── backend/
│   ├── server.js              # Express sunucusu
│   ├── routes/                # API Rotaları (analyze, evaluate)
│   ├── services/              # Servisler (Gemini, Scraper, FileParser)
│   ├── uploads/               # Geçici yükleme dizini
│   ├── .env.example           # Ortam değişkeni şablonu
│   └── package.json
└── frontend/
    ├── index.html             # Ana giriş sayfası
    ├── vite.config.js         # Vite ayarları
    ├── package.json
    └── src/
        ├── components/        # React bileşenleri
        ├── api/               # API servisleri
        ├── assets/            # CSS (index.css)
        └── store/             # Global state (Zustand)
```

---

## 🔑 Ortam Değişkenleri

`backend/.env` dosyasına aşağıdaki değişkenleri girin:

| Değişken | Açıklama | Örnek |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API anahtarı | `AIza...` |
| `PORT` | Sunucu portu (opsiyonel) | `3001` |

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | React, Zustand, Vite, CSS |
| Backend | Node.js, Express.js |
| AI | Google Gemini 2.5 Flash |
| Web Scraping | Axios, Cheerio |
| Dosya İşleme | pdf-parse, mammoth |
| Dosya Yükleme | multer |

---

## 📸 Kullanım Akışı

1. **Şirket Bilgisi Gir** → Pozisyon + şirket adı / URL / dosya / metin
2. **Soruları İncele** → 15 soruluk liste görüntülenir
3. **Teste Başla** → Her soruya cevap yaz, anında değerlendir
4. **Raporu Gör** → Genel puan, güçlü yönler ve eylem planı

---

## 📝 Lisans

**Tüm Hakları Saklıdır (All Rights Reserved)**
Bu projenin kaynak kodları herkese açıktır ancak kopyalanamaz ve ticari amaçlarla dağıtılamaz.
© 2026 Emir Omrak