const express = require("express");
const router = express.Router();
const { evaluateAnswer, generateFinalReport } = require("../services/gemini");

/**
 * POST /api/evaluate
 * Tek bir cevabı değerlendir
 */
router.post("/", async (req, res) => {
  const { question, answer, companyInfo, position } = req.body;

  if (!question || !answer || !companyInfo || !position) {
    return res.status(400).json({ error: "Eksik parametre." });
  }

  if (answer.trim().length < 10) {
    return res.status(400).json({ error: "Cevap çok kısa. Lütfen daha detaylı yanıt verin." });
  }

  try {
    const evaluation = await evaluateAnswer(question, answer, companyInfo, position);
    res.json({ success: true, data: evaluation });
  } catch (err) {
    console.error("[Evaluate hatası]", err.message);
    res.status(500).json({ error: `Değerlendirme yapılamadı: ${err.message}` });
  }
});

/**
 * POST /api/evaluate/report
 * Tüm testin final raporunu üret
 */
router.post("/report", async (req, res) => {
  const { companyName, position, results } = req.body;

  if (!companyName || !position || !results || results.length === 0) {
    return res.status(400).json({ error: "Eksik parametre." });
  }

  try {
    const report = await generateFinalReport(companyName, position, results);
    res.json({ success: true, data: report });
  } catch (err) {
    console.error("[Report hatası]", err.message);
    res.status(500).json({ error: `Rapor oluşturulamadı: ${err.message}` });
  }
});

module.exports = router;
