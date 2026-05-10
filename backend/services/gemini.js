const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { apiVersion: "v1alpha" },
});

const MODEL = "gemini-3-flash-preview";

async function generate(prompt) {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: { temperature: 0.8, maxOutputTokens: 8192 },
  });
  return response.text;
}

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("LLM'den geçerli JSON alınamadı");
  return JSON.parse(match[0]);
}

/**
 * Şirket bilgisinden mülakat soruları üretir
 */
async function generateInterviewQuestions(companyInfo, position) {
  const prompt = `
Sen deneyimli bir İK uzmanı ve mülakat koçusun. Aşağıdaki şirket bilgilerine dayanarak, "${position}" pozisyonu için kapsamlı mülakat soruları hazırla.

ŞİRKET BİLGİSİ:
${companyInfo}

DİKKAT: Eğer verilen şirket bilgisi anlamsızsa (örn: "asdsad", "123123"), gerçek bir şirket değilse veya mülakat sorusu hazırlamak için aşırı yetersiz/uydurma ise, KESİNLİKLE uydurma bilgilerle soru hazırlama. Bu durumda SADECE aşağıdaki formatta bir hata JSON'u döndür:
{
  "error": true,
  "errorMessage": "Girdiğiniz şirket bilgisi anlamsız veya yetersiz. Lütfen geçerli bir şirket adı girin veya daha iyi sonuç için şirketin web sitesi linkini/hakkında yazısını ekleyin."
}

Eğer şirket bilgisi geçerli ve mantıklıysa, Lütfen aşağıdaki kategorilerde toplam 15 soru oluştur ve SADECE JSON formatında yanıt ver:

{
  "companyName": "Şirketin adı",
  "companySummary": "Şirket hakkında 3-4 cümlelik özet (kültür, sektör, öne çıkan özellikler)",
  "position": "${position}",
  "questions": [
    {
      "id": 1,
      "category": "Şirket Araştırması",
      "categoryIcon": "🏢",
      "question": "Soru metni",
      "hint": "İyi bir cevabın nasıl olması gerektiğine dair ipucu",
      "keyPoints": ["Önemli nokta 1", "Önemli nokta 2"]
    }
  ]
}

Kategoriler ve soru dağılımı:
- "Şirket Araştırması" (🏢) - 3 soru: Şirketin misyonu, vizyonu, ürünleri, rekabet avantajları hakkında
- "Motivasyon & Uyum" (🎯) - 3 soru: Neden bu şirket, neden bu pozisyon, kariyer hedefleri
- "Teknik & Pozisyon" (💼) - 4 soru: ${position} pozisyonuna özel teknik/fonksiyonel sorular
- "Davranışsal" (⭐) - 3 soru: STAR yöntemi ile geçmiş deneyimler (şirketin değerleriyle ilişkili)
- "Durum & Senaryo" (🔍) - 2 soru: Şirkete ve pozisyona özel hipotetik senaryolar

ÖNEMLİ: Sadece JSON döndür, başka açıklama ekleme.
`;

  const text = await generate(prompt);
  const resultJSON = extractJSON(text);

  if (resultJSON.error) {
    throw new Error(resultJSON.errorMessage);
  }

  return resultJSON;
}

/**
 * Kullanıcının cevabını değerlendirir
 */
async function evaluateAnswer(question, answer, companyInfo, position) {
  const prompt = `
Sen deneyimli bir İK uzmanı ve mülakat değerlendiricisin. Aşağıdaki mülakat sorusuna verilen cevabı değerlendir.

BAĞLAM:
- Pozisyon: ${position}
- Şirket Bilgisi: ${companyInfo.substring(0, 500)}...
- Soru Kategorisi: ${question.category}
- Önemli Noktalar: ${question.keyPoints.join(", ")}

SORU: ${question.question}

VERİLEN CEVAP: ${answer}

Değerlendirmeyi SADECE JSON formatında ver:
{
  "score": 85,
  "scoreLabel": "İyi",
  "strengths": ["Güçlü yön 1", "Güçlü yön 2"],
  "improvements": ["Geliştirilecek nokta 1", "Geliştirilecek nokta 2"],
  "idealAnswer": "Bu soruya verilecek ideal cevabın kısa özeti (2-3 cümle)",
  "feedback": "Genel, motive edici geri bildirim metni (2-3 cümle)"
}

Puanlama: 90-100: Mükemmel | 75-89: İyi | 60-74: Orta | 45-59: Geliştirilmeli | 0-44: Yetersiz

ÖNEMLİ: Sadece JSON döndür.
`;

  const text = await generate(prompt);
  return extractJSON(text);
}

/**
 * Tüm testin genel raporunu üretir
 */
async function generateFinalReport(companyName, position, results) {
  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);

  const prompt = `
Sen bir mülakat koçusun. Aşağıdaki mülakat simülasyonu sonuçlarına dayanarak kapsamlı bir değerlendirme raporu hazırla.

Şirket: ${companyName}
Pozisyon: ${position}
Ortalama Puan: ${avgScore}/100
Soru Sayısı: ${results.length}

Sonuçlar:
${results.map((r, i) => `Soru ${i + 1} (${r.category}): ${r.score}/100`).join("\n")}

Raporu SADECE JSON formatında ver:
{
  "overallScore": ${avgScore},
  "overallLabel": "Değerlendirme etiketi",
  "readinessLevel": "Mülakat hazırlık seviyesi (örn: 'Yüksek Hazırlık', 'Orta Hazırlık')",
  "summary": "Genel değerlendirme özeti (3-4 cümle)",
  "topStrengths": ["En güçlü alan 1", "En güçlü alan 2", "En güçlü alan 3"],
  "focusAreas": ["Odaklanılacak alan 1", "Odaklanılacak alan 2"],
  "actionPlan": ["Öneri 1", "Öneri 2", "Öneri 3"],
  "motivationMessage": "Motive edici kapanış mesajı"
}

ÖNEMLİ: Sadece JSON döndür.
`;

  const text = await generate(prompt);
  return extractJSON(text);
}

module.exports = { generateInterviewQuestions, evaluateAnswer, generateFinalReport };
