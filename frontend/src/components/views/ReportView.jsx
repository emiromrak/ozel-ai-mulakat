import useAppStore from '../../store/useAppStore'

export default function ReportView() {
  const { reportData, companyName, position, startFresh, setView, setStep, resetResults, setCurrentIndex, questions } =
    useAppStore()

  function restartSameCompany() {
    resetResults()
    setCurrentIndex(0)
    setStep(2)
    setView('test')
  }

  if (!reportData) return null

  const score = reportData.overallScore || 0
  const color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)'

  return (
    <div className="view-enter">
      <div className="card">
        <div className="report-header">
          <div
            className="big-score"
            style={{ background: `conic-gradient(${color} ${score}%, var(--bg-card) 0%)` }}
          >
            <div className="big-score-inner">
              <span className="score-val">{score}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
          <div className="report-label">{reportData.overallLabel}</div>
          <div style={{ fontSize: '.85rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>
            {reportData.readinessLevel}
          </div>
          <p className="report-summary">{reportData.summary}</p>
        </div>

        <div className="report-grid">
          <div className="report-box">
            <h4>⭐ Güçlü Yönlerin</h4>
            <ul className="strengths">
              {(reportData.topStrengths || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="report-box">
            <h4>🎯 Odaklanılacak Alanlar</h4>
            <ul className="focus">
              {(reportData.focusAreas || []).map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>

        <div className="report-box" style={{ marginTop: '1rem' }}>
          <h4>📌 Eylem Planı</h4>
          <ul className="action">
            {(reportData.actionPlan || []).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        {reportData.motivationMessage && (
          <div className="motivation-box">{reportData.motivationMessage}</div>
        )}

        <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={restartSameCompany}>
            🔄 Tekrar Test Et
          </button>
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={startFresh}>
            🏠 Yeni Şirket
          </button>
        </div>
      </div>
    </div>
  )
}
