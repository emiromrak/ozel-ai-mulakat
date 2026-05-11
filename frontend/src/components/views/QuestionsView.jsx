import useAppStore from '../../store/useAppStore'

export default function QuestionsView() {
  const { companyName, companySummary, position, questions, setCurrentIndex, resetResults, setView, setStep } =
    useAppStore()

  function startTestFrom(index) {
    resetResults()      // önce sıfırla (currentIndex=0 yapıyor)
    setCurrentIndex(index)  // sonra doğru soruya geç
    setStep(2)
    setView('test')
  }

  function startTest() {
    startTestFrom(0)
  }

  return (
    <div className="view-enter">
      {/* Company Banner */}
      <div className="company-banner">
        <div className="company-logo-placeholder">🏢</div>
        <div className="company-info">
          <h2>{companyName}</h2>
          <p>{companySummary}</p>
          <div className="position-tag">💼 {position}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title" style={{ fontSize: '1.2rem' }}>📋 Mülakat Soruları</h2>
        <p className="section-subtitle" style={{ marginBottom: '1.25rem' }}>
          {questions.length} soru hazırlandı. "Teste Başla" butonuna tıkla veya soru üzerine tıklayarak başla.
        </p>

        <div className="questions-grid">
          {questions.map((q, i) => (
            <div key={i} className="question-card" onClick={() => startTestFrom(i)}>
              <div className="q-icon">{q.categoryIcon || '❓'}</div>
              <div className="question-num">{i + 1}</div>
              <div>
                <div className="question-cat">{q.category}</div>
                <div className="question-text">{q.question}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-full" onClick={startTest}>
          <span>🎯</span> Teste Başla
        </button>
      </div>
    </div>
  )
}
