const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Verilen URL'den metin içeriğini çeker
 */
async function scrapeUrl(url) {
  // URL'nin başında http/https yoksa ekle
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "tr,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);

    // Gereksiz elementleri temizle
    $("script, style, nav, footer, header, iframe, noscript, svg").remove();
    $("[class*='cookie'], [class*='popup'], [class*='modal'], [id*='cookie']").remove();

    // Önce önemli alanları topla
    const sections = [];

    // Meta bilgileri
    const title = $("title").text().trim();
    const description = $('meta[name="description"]').attr("content") || "";
    const ogTitle = $('meta[property="og:title"]').attr("content") || "";
    const ogDesc = $('meta[property="og:description"]').attr("content") || "";

    if (title) sections.push(`Başlık: ${title}`);
    if (description) sections.push(`Açıklama: ${description}`);
    if (ogDesc && ogDesc !== description) sections.push(`Site Açıklaması: ${ogDesc}`);

    // Hakkımızda bölümleri
    const aboutSelectors = [
      '[class*="about"]', '[id*="about"]',
      '[class*="hakkimizda"]', '[class*="hakkında"]',
      '[class*="mission"]', '[class*="vision"]',
      '[class*="values"]', '[class*="degerler"]',
      "main", "article", ".content", "#content",
    ];

    for (const selector of aboutSelectors) {
      const text = $(selector).text().trim().replace(/\s+/g, " ");
      if (text && text.length > 100) {
        sections.push(text.substring(0, 1000));
        break;
      }
    }

    // Genel body metni (fallback)
    if (sections.length < 3) {
      const bodyText = $("body").text().trim().replace(/\s+/g, " ");
      sections.push(bodyText.substring(0, 3000));
    }

    // H1, H2 başlıkları - şirket değerleri hakkında ipucu verir
    const headings = [];
    $("h1, h2, h3").each((i, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 3 && text.length < 100) {
        headings.push(text);
      }
    });
    if (headings.length > 0) {
      sections.push("Sayfa Bölümleri: " + headings.slice(0, 20).join(" | "));
    }

    const combinedText = sections.join("\n\n").substring(0, 5000);
    
    return {
      success: true,
      url,
      text: combinedText,
      title: title || ogTitle || url,
    };
  } catch (error) {
    // Scraping başarısız olsa bile şirket adını LLM'e verebiliriz
    return {
      success: false,
      url,
      error: error.message,
      text: null,
    };
  }
}

module.exports = { scrapeUrl };
