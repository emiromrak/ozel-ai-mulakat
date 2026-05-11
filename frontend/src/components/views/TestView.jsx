import { useState, useEffect, useRef } from 'react'
import useAppStore from '../../store/useAppStore'
import { evaluateAnswer, generateReport } from '../../api/api'

export default function TestView() {
  const {
    questions, currentIndex, results, companyInfo, position, companyName,
    setCurrentIndex, setResult, setHintVisible, hintVisible,
    showLoading, hideLoading, showToast,
    setView, setStep,
  } = useAppStore()

  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const evalRef = useRef(null)

  const q = questions[currentIndex]
  const total = questions.length
  const current = currentIndex + 1
  const progress = ((current - 1) / total) * 100

  // Restore saved answer & evaluation when navigating
  useEffect(() => {
    const saved = results[currentIndex]
    if (saved) {
      setAnswer(saved.answer || '')
      setEvaluation(saved.evaluation || null)
    } else {
      setAnswer('')
      setEvaluation(null)
    }
    setHintVisible(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentIndex])

  async function handleSubmit() {
    if (answer.trim().length < 10)
      return showToast('Lütfen daha detaylı bir cevap yaz (en az 10 karakter).')

    setSubmitting(true)
    showLoading('Cevabın değerlendiriliyor...', 'Yapay zeka analiz ediyor...')

    try {
      const ev = await evaluateAnswer({ question: q, answer, companyInfo, position })
      setResult(currentIndex, { score: ev.score, category: q.category, question: q.question, answer, evaluation: ev })
      setEvaluation(ev)
      setTimeout(() => evalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100)
    } catch (err) {
      showToast('Hata: ' + err.message)
    } finally {
      hideLoading()
      setSubmitting(false)
    }
  }

  function skipQuestion() {
    setResult(currentIndex, { score: 0, category: q.category, question: q.question, answer: '', evaluation: null })
    goNext()
  }

  async function goNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      await doReport()
    }
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  async function doReport() {
    showLoading('Genel rapor hazırlanıyor...', 'Tüm cevapların analiz ediliyor...')
    try {
      const data = await generateReport({ companyName, position, results })
      useAppStore.getState().setView('report')
      useAppStore.getState().setStep(3)
      // Store report data via a store action
      useAppStore.setState({ reportData: data })
    } catch (err) {
      showToast('Rapor oluşturulamadı: ' + err.message)
    } finally {
      hideLoading()
    }
  }

  const scoreColor = (s) =>
    s >= 80 ? 'var(--success)' : s >= 60 ? 'var(--warning)' : 'var(--danger)'

  if (!q) return null

  return (
    <div className="view-enter">
      {/* Progress */}
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Question */}
      <div className="question-display">
        <div className="question-meta">
          <span className="cat-badge">{q.categoryIcon || ''} {q.category}</span>
          <span className="q-counter">{current} / {total}</span>
        </div>
        <h3>{q.question}</h3>
      </div>

      {/* Hint */}
      {hintVisible && q.hint && (
        <div className="hint-box">
          <span>💡</span>
          <span>{q.hint}</span>
        </div>
      )}

      {/* Answer */}
      <div className="answer-area">
        <label htmlFor="answer-input">Cevabın</label>
        <textarea
          id="answer-input"
          rows={5}
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Cevabını buraya yaz..."
        />
      </div>

      {/* Actions */}
      <div className="answer-actions">
        {currentIndex > 0 && (
          <button className="btn btn-secondary" onClick={goPrev}>← Önceki</button>
        )}
        <button className="btn btn-secondary" onClick={() => setHintVisible(!hintVisible)}>
          💡 İpucu
        </button>
        <button className="btn btn-secondary" onClick={skipQuestion}>⏭ Geç</button>
        {!submitting && (
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
            {evaluation ? 'Cevabı Güncelle & Değerlendir →' : 'Cevapla & Değerlendir →'}
          </button>
        )}
      </div>

      {/* Evaluation */}
      {evaluation && (
        <div className="evaluation-card" ref={evalRef}>
          <div className="score-row">
            <div
              className="score-circle"
              style={{
                background: `conic-gradient(${scoreColor(evaluation.score)} ${evaluation.score}%, var(--bg-card) 0%)`,
              }}
            >
              <div className="score-inner">{evaluation.score}</div>
            </div>
            <div className="score-details">
              <h4>{evaluation.scoreLabel}</h4>
              <p>{evaluation.feedback}</p>
            </div>
          </div>

          <div className="eval-section">
            <h5>Güçlü Yönlerin</h5>
            <ul className="eval-list good">
              {(evaluation.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="eval-section">
            <h5>Geliştirilebilecekler</h5>
            <ul className="eval-list improve">
              {(evaluation.improvements || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="eval-section">
            <h5>İdeal Cevap</h5>
            <div className="ideal-answer">{evaluation.idealAnswer}</div>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-primary btn-full" onClick={goNext}>
              {currentIndex < total - 1 ? 'Sonraki Soru →' : '📊 Raporu Gör'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
