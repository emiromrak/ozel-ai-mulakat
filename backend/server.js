require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const analyzeRouter = require("./routes/analyze");
const evaluateRouter = require("./routes/evaluate");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5500", "http://127.0.0.1:5500", "null"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/analyze", analyzeRouter);
app.use("/api/evaluate", evaluateRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    apiKey: process.env.GEMINI_API_KEY ? "configured" : "missing",
    timestamp: new Date().toISOString()
  });
});

// Frontend için catch-all
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Hata yakalayıcı
app.use((err, req, res, next) => {
  console.error("[Sunucu Hatası]", err.message);
  res.status(err.status || 500).json({ error: err.message || "Sunucu hatası" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Mülakat Hazırlık Sunucusu çalışıyor!`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🔑 Gemini API: ${process.env.GEMINI_API_KEY ? "✅ Yapılandırıldı" : "❌ Eksik (.env dosyasını kontrol et)"}\n`);
});
