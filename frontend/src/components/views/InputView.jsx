import { useState, useRef } from 'react'
import useAppStore from '../../store/useAppStore'
import { analyzeCompany } from '../../api/api'

export default function InputView() {
  const { showLoading, hideLoading, showToast, setAnalysisResult, setView, setStep } = useAppStore()

  const [position, setPosition] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)

  const fileRef = useRef(null)

  function handleFile(file) {
    if (file) setFileName(file.name)
  }

  async function startAnalysis() {
    if (!position.trim()) return showToast('Lütfen başvurduğun pozisyonu gir.')
    if (!companyName.trim() && !url.trim() && !text.trim() && !fileRef.current?.files[0])
      return showToast('En az bir şirket bilgisi gir (ad, URL, metin veya dosya).')

    const formData = new FormData()
    formData.append('position', position.trim())
    if (companyName.trim()) formData.append('companyName', companyName.trim())
    if (url.trim()) formData.append('url', url.trim())
    if (text.trim()) formData.append('text', text.trim())
    if (fileRef.current?.files[0]) formData.append('file', fileRef.current.files[0])

    showLoading('Şirket bilgileri analiz ediliyor...', 'Web sitesi taranıyor ve sorular hazırlanıyor...')
    setLoading(true)

    try {
      const data = await analyzeCompany(formData)
      setAnalysisResult(data, { position, companyName, url, text })
      setStep(1)
      setView('questions')
    } catch (err) {
      showToast('Hata: ' + err.message)
    } finally {
      hideLoading()
      setLoading(false)
    }
  }

  return (
    <div className="view-enter">
      <div className="card">
        <h1 className="section-title">Mülakata Hazırlan 🚀</h1>
        <p className="section-subtitle">
          Başvurduğun şirket hakkında bilgi ver — yapay zeka sana özel sorular hazırlasın.
        </p>

        {/* Pozisyon */}
        <div className="form-group">
          <label htmlFor="position-input">Başvurduğun Pozisyon *</label>
          <input
            id="position-input"
            type="text"
            value={position}
            onChange={e => setPosition(e.target.value)}
            placeholder="örn: Backend Developer, Pazarlama Uzmanı, UX Designer..."
          />
        </div>

        {/* Şirket adı */}
        <div className="form-group">
          <label htmlFor="company-input">Şirket Adı</label>
          <input
            id="company-input"
            type="text"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            placeholder="örn: Trendyol, Getir, Google..."
          />
        </div>

        <div className="or-divider"><span>+ ek bilgi ekleyebilirsin</span></div>

        {/* URL */}
        <div className="form-group">
          <label htmlFor="url-input">Şirket Web Sitesi URL'si</label>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://www.sirket.com"
          />
        </div>

        {/* Metin */}
        <div className="form-group">
          <label htmlFor="text-input">Şirket Hakkında Ek Notlar</label>
          <textarea
            id="text-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="İş ilanı metni, şirket hakkında araştırdıkların, dikkat etmek istediğin konular..."
          />
        </div>

        {/* Dosya yükle */}
        <div className="form-group">
          <label>Dosya Yükle (PDF, DOCX, TXT)</label>
          <div
            className={`file-drop${isDragOver ? ' dragover' : ''}`}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={e => {
              e.preventDefault()
              setIsDragOver(false)
              if (e.dataTransfer.files[0]) {
                // transfer files to input
                const dt = new DataTransfer()
                dt.items.add(e.dataTransfer.files[0])
                fileRef.current.files = dt.files
                handleFile(e.dataTransfer.files[0])
              }
            }}
          >
            <input
              ref={fileRef}
              type="file"
              id="file-input"
              accept=".pdf,.docx,.doc,.txt"
              onChange={e => handleFile(e.target.files[0])}
            />
            <div className="file-drop-icon">📎</div>
            <div className="file-drop-text">
              Dosyayı buraya sürükle veya <span>tıkla</span>
            </div>
            {fileName && (
              <div className="file-name">✅ {fileName}</div>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary btn-full"
          id="analyze-btn"
          onClick={startAnalysis}
          disabled={loading}
        >
          <span>✨</span> Soruları Hazırla
        </button>
      </div>
    </div>
  )
}
