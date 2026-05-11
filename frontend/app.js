const API = 'http://localhost:3001/api';

// ── STATE ──────────────────────────────────────────────────────────
let state = {
  position: '',
  companyName: '',
  companySummary: '',
  companyInfo: '',   // tüm ham bilgi (değerlendirme için)
  questions: [],
  currentIndex: 0,
  results: [],       // { score, category, question }
  hintVisible: false,
};

// ── DOSYA YÜKLEME ──────────────────────────────────────────────────
const fileDrop = document.getElementById('file-drop');
const fileInput = document.getElementById('file-input');
const fileNameDisplay = document.getElementById('file-name-display');

fileDrop.addEventListener('dragover', e => { e.preventDefault(); fileDrop.classList.add('dragover'); });
fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('dragover'));
fileDrop.addEventListener('drop', e => {
  e.preventDefault();
  fileDrop.classList.remove('dragover');
  if (e.dataTransfer.files[0]) {
    fileInput.files = e.dataTransfer.files;
    showFileName(e.dataTransfer.files[0].name);
  }
});
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) showFileName(fileInput.files[0].name);
});
function showFileName(name) {
  fileNameDisplay.textContent = '✅ ' + name;
  fileNameDisplay.classList.add('visible');
}

// ── STEP GÖSTERGE ──────────────────────────────────────────────────
function setStep(n) {
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById('step' + i);
    el.classList.remove('active', 'done');
    if (i < n) el.classList.add('done');
    else if (i === n) el.classList.add('active');
  }
}

// ── VIEW YÖNETİMİ ──────────────────────────────────────────────────
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── LOADING ────────────────────────────────────────────────────────
function showLoading(text = 'Yapay zeka çalışıyor...', sub = 'Bu işlem 10-20 saniye sürebilir') {
  document.getElementById('loading-text').textContent = text;
  document.getElementById('loading-sub').textContent = sub;
  document.getElementById('loading').classList.add('active');
}
function hideLoading() {
  document.getElementById('loading').classList.remove('active');
}

// ── TOAST ──────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'error') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = type === 'success' ? 'show success-toast' : 'show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = '', 3500);
}

// ── ADIM 1: ANALİZ BAŞLAT ─────────────────────────────────────────
async function startAnalysis() {
  const position = document.getElementById('position-input').value.trim();
  const companyName = document.getElementById('company-input').value.trim();
  const url = document.getElementById('url-input').value.trim();
  const text = document.getElementById('text-input').value.trim();
  const file = fileInput.files[0];

  if (!position) return showToast('Lütfen başvurduğun pozisyonu gir.');
  if (!companyName && !url && !text && !file) return showToast('En az bir şirket bilgisi gir (ad, URL, metin veya dosya).');

  const formData = new FormData();
  formData.append('position', position);
  if (companyName) formData.append('companyName', companyName);
  if (url) formData.append('url', url);
  if (text) formData.append('text', text);
  if (file) formData.append('file', file);

  showLoading('Şirket bilgileri analiz ediliyor...', 'Web sitesi taranıyor ve sorular hazırlanıyor...');
  document.getElementById('analyze-btn').disabled = true;

  try {
    const res = await fetch(`${API}/analyze`, { method: 'POST', body: formData });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Bilinmeyen hata');

    const data = json.data;
    state.position = data.position || position;
    state.companyName = data.companyName || companyName;
    state.companySummary = data.companySummary || '';
    state.questions = data.questions || [];
    // Değerlendirme için bilgiyi sakla
    state.companyInfo = [companyName, url, text].filter(Boolean).join(' | ') || data.companyName;

    renderQuestionsList();
    setStep(1);
    showView('view-questions');

    // Header güncelle
    document.getElementById('header-info').style.display = 'block';
    document.getElementById('header-company').textContent = state.companyName;
    document.getElementById('header-position').textContent = state.position;

  } catch (err) {
    showToast('Hata: ' + err.message);
  } finally {
    hideLoading();
    document.getElementById('analyze-btn').disabled = false;
  }
}

// ── SORULAR LİSTESİ ────────────────────────────────────────────────
function renderQuestionsList() {
  document.getElementById('banner-company').textContent = state.companyName;
  document.getElementById('banner-summary').textContent = state.companySummary;
  document.getElementById('banner-position').textContent = state.position;

  const grid = document.getElementById('questions-grid');
  grid.innerHTML = state.questions.map((q, i) => `
    <div class="question-card" onclick="startTestFrom(${i})">
      <div class="q-icon">${q.categoryIcon || '❓'}</div>
      <div class="question-num">${i + 1}</div>
      <div>
        <div class="question-cat">${q.category}</div>
        <div class="question-text">${q.question}</div>
      </div>
    </div>
  `).join('');
}

// ── ADIM 2 → 3: TEST BAŞLAT ───────────────────────────────────────
function startTest() { startTestFrom(0); }

function startTestFrom(index) {
  state.currentIndex = index;
  state.results = [];
  setStep(2);
  showView('view-test');
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  const total = state.questions.length;
  const current = state.currentIndex + 1;

  document.getElementById('q-counter').textContent = `${current} / ${total}`;
  document.getElementById('progress-fill').style.width = `${((current - 1) / total) * 100}%`;
  document.getElementById('q-category-badge').innerHTML = `${q.categoryIcon || ''} ${q.category}`;
  document.getElementById('current-question').textContent = q.question;
  document.getElementById('hint-text').textContent = q.hint || '';
  
  const existingResult = state.results[state.currentIndex];
  if (existingResult && existingResult.answer !== undefined) {
    document.getElementById('answer-input').value = existingResult.answer;
    document.getElementById('submit-btn').innerHTML = 'Cevabı Güncelle & Değerlendir →';
    document.getElementById('submit-btn').style.display = 'inline-flex';
    if (existingResult.evaluation) {
      renderEvaluation(existingResult.evaluation, false);
    } else {
      document.getElementById('evaluation-card').classList.remove('visible');
    }
  } else {
    document.getElementById('answer-input').value = '';
    document.getElementById('submit-btn').innerHTML = 'Cevapla & Değerlendir →';
    document.getElementById('submit-btn').style.display = 'inline-flex';
    document.getElementById('evaluation-card').classList.remove('visible');
  }

  document.getElementById('hint-box').style.display = 'none';
  document.getElementById('next-btn').textContent = state.currentIndex < state.questions.length - 1 ? 'Sonraki Soru →' : '📊 Raporu Gör';
  
  const prevBtn = document.getElementById('prev-btn');
  if (prevBtn) prevBtn.style.display = state.currentIndex > 0 ? 'inline-flex' : 'none';

  state.hintVisible = false;
}

function toggleHint() {
  state.hintVisible = !state.hintVisible;
  document.getElementById('hint-box').style.display = state.hintVisible ? 'flex' : 'none';
}

async function submitAnswer() {
  const answer = document.getElementById('answer-input').value.trim();
  if (answer.length < 10) return showToast('Lütfen daha detaylı bir cevap yaz (en az 10 karakter).');

  const q = state.questions[state.currentIndex];
  document.getElementById('submit-btn').style.display = 'none';
  showLoading('Cevabın değerlendiriliyor...', 'Yapay zeka analiz ediyor...');

  try {
    const res = await fetch(`${API}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: q,
        answer,
        companyInfo: state.companyInfo,
        position: state.position,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Değerlendirme hatası');

    const ev = json.data;
    state.results[state.currentIndex] = { score: ev.score, category: q.category, question: q.question, answer: answer, evaluation: ev };
    renderEvaluation(ev);

  } catch (err) {
    showToast('Hata: ' + err.message);
    document.getElementById('submit-btn').style.display = 'inline-flex';
  } finally {
    hideLoading();
  }
}

function renderEvaluation(ev, scrollToIt = true) {
  const pct = ev.score;
  const color = pct >= 80 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';

  const circle = document.getElementById('score-circle');
  circle.style.background = `conic-gradient(${color} ${pct}%, var(--bg-card) 0%)`;
  document.getElementById('score-val').textContent = pct;
  document.getElementById('score-label').textContent = ev.scoreLabel || '';
  document.getElementById('score-feedback').textContent = ev.feedback || '';

  document.getElementById('eval-strengths').innerHTML = (ev.strengths || []).map(s => `<li>${s}</li>`).join('');
  document.getElementById('eval-improvements').innerHTML = (ev.improvements || []).map(s => `<li>${s}</li>`).join('');
  document.getElementById('eval-ideal').textContent = ev.idealAnswer || '';

  document.getElementById('evaluation-card').classList.add('visible');
  if (scrollToIt) {
    document.getElementById('evaluation-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function nextQuestion() {
  if (state.currentIndex < state.questions.length - 1) {
    state.currentIndex++;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    generateReport();
  }
}

function skipQuestion() {
  state.results[state.currentIndex] = { score: 0, category: state.questions[state.currentIndex].category, question: state.questions[state.currentIndex].question, answer: '', evaluation: null };
  nextQuestion();
}

function prevQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex--;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// ── ADIM 4: RAPOR ──────────────────────────────────────────────────
async function generateReport() {
  showLoading('Genel rapor hazırlanıyor...', 'Tüm cevapların analiz ediliyor...');

  try {
    const res = await fetch(`${API}/evaluate/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: state.companyName,
        position: state.position,
        results: state.results,
      }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Rapor hatası');
    renderReport(json.data);
  } catch (err) {
    showToast('Rapor oluşturulamadı: ' + err.message);
  } finally {
    hideLoading();
  }
}

function renderReport(r) {
  const score = r.overallScore || 0;
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';

  document.getElementById('big-score-circle').style.background =
    `conic-gradient(${color} ${score}%, var(--bg-card) 0%)`;
  document.getElementById('final-score').textContent = score;
  document.getElementById('report-label').textContent = r.overallLabel || '';
  document.getElementById('readiness-level').textContent = r.readinessLevel || '';
  document.getElementById('report-summary').textContent = r.summary || '';
  document.getElementById('report-strengths').innerHTML = (r.topStrengths || []).map(s => `<li>${s}</li>`).join('');
  document.getElementById('report-focus').innerHTML = (r.focusAreas || []).map(s => `<li>${s}</li>`).join('');
  document.getElementById('report-action').innerHTML = (r.actionPlan || []).map(s => `<li>${s}</li>`).join('');
  document.getElementById('report-motivation').textContent = r.motivationMessage || '';

  setStep(3);
  showView('view-report');
}

function restartSameCompany() {
  state.currentIndex = 0;
  state.results = [];
  setStep(2);
  showView('view-test');
  renderQuestion();
}

function startFresh() {
  state = { position: '', companyName: '', companySummary: '', companyInfo: '', questions: [], currentIndex: 0, results: [], hintVisible: false };
  document.getElementById('position-input').value = '';
  document.getElementById('company-input').value = '';
  document.getElementById('url-input').value = '';
  document.getElementById('text-input').value = '';
  fileInput.value = '';
  fileNameDisplay.classList.remove('visible');
  document.getElementById('header-info').style.display = 'none';
  setStep(1);
  showView('view-input');
}
