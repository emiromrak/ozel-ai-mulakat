# 🎯 Şirkete Özel Mülakat Hazırlık Uygulaması

Mülakata gireceğin şirketin adını, web sitesini veya dokümanlarını yükle — yapay zeka sana özel sorular hazırlasın ve seni test etsin.

![Demo](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Stack-Node.js%20%2B%20Vanilla%20JS-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

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

```bash
# 1. Repoyu klonla
git clone https://github.com/kullanici-adi/sirkete_ozel_mulakat.git
cd sirkete_ozel_mulakat

# 2. Backend bağımlılıklarını yükle
cd backend
npm install

# 3. .env dosyasını oluştur
cp .env.example .env
# .env dosyasını aç ve GEMINI_API_KEY değerini gir

# 4. Sunucuyu başlat
npm start
```

```
# 5. Tarayıcıda aç
http://localhost:3001
```

---

## 📁 Proje Yapısı

```
sirkete_ozel_mulakat/
├── backend/
│   ├── server.js              # Express sunucusu
│   ├── routes/
│   │   ├── analyze.js         # Şirket analizi + soru üretimi
│   │   └── evaluate.js        # Cevap değerlendirme + rapor
│   ├── services/
│   │   ├── gemini.js          # Google Gemini API wrapper
│   │   ├── scraper.js         # Web scraping (cheerio)
│   │   └── fileParser.js      # PDF & DOCX metin çıkarımı
│   ├── uploads/               # Geçici yükleme dizini
│   ├── .env.example           # Ortam değişkeni şablonu
│   └── package.json
└── frontend/
    ├── index.html             # Ana sayfa
    ├── style.css              # Premium dark mode tasarım
    └── app.js                 # Uygulama mantığı
```

---

## 🔑 Ortam Değişkenleri

`backend/.env` dosyasına aşağıdaki değişkenleri gir:

| Değişken | Açıklama | Örnek |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API anahtarı | `AIza...` |
| `PORT` | Sunucu portu (opsiyonel) | `3001` |

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknoloji |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| AI | Google Gemini 1.5 Flash |
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