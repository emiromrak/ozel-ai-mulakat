const API = '/api'

export async function analyzeCompany(formData) {
  const res = await fetch(`${API}/analyze`, { method: 'POST', body: formData })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Bilinmeyen hata')
  return json.data
}

export async function evaluateAnswer(payload) {
  const res = await fetch(`${API}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Değerlendirme hatası')
  return json.data
}

export async function generateReport(payload) {
  const res = await fetch(`${API}/evaluate/report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Rapor hatası')
  return json.data
}
