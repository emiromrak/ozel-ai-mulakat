import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // ── Navigation ──────────────────────────────────────
  currentView: 'input', // 'input' | 'questions' | 'test' | 'report'
  currentStep: 1,

  // ── App data ─────────────────────────────────────────
  position: '',
  companyName: '',
  companySummary: '',
  companyInfo: '',
  questions: [],
  currentIndex: 0,
  results: [],
  hintVisible: false,

  // ── UI state ─────────────────────────────────────────
  loading: false,
  loadingText: 'Yapay zeka çalışıyor...',
  loadingSub: 'Bu işlem 10-20 saniye sürebilir',
  toast: null, // { msg, type }

  // ── Actions ───────────────────────────────────────────
  setView: (view) => set({ currentView: view }),
  setStep: (step) => set({ currentStep: step }),

  showLoading: (text = 'Yapay zeka çalışıyor...', sub = 'Bu işlem 10-20 saniye sürebilir') =>
    set({ loading: true, loadingText: text, loadingSub: sub }),

  hideLoading: () => set({ loading: false }),

  showToast: (msg, type = 'error') => {
    set({ toast: { msg, type } })
    setTimeout(() => set({ toast: null }), 3500)
  },

  setAnalysisResult: (data, formInputs) =>
    set({
      position: data.position || formInputs.position,
      companyName: data.companyName || formInputs.companyName,
      companySummary: data.companySummary || '',
      companyInfo:
        [formInputs.companyName, formInputs.url, formInputs.text]
          .filter(Boolean)
          .join(' | ') || data.companyName,
      questions: data.questions || [],
    }),

  setCurrentIndex: (index) => set({ currentIndex: index }),
  setHintVisible: (v) => set({ hintVisible: v }),

  setResult: (index, result) =>
    set((state) => {
      const results = [...state.results]
      results[index] = result
      return { results }
    }),

  resetResults: () => set({ results: [], currentIndex: 0 }),

  startFresh: () =>
    set({
      currentView: 'input',
      currentStep: 1,
      position: '',
      companyName: '',
      companySummary: '',
      companyInfo: '',
      questions: [],
      currentIndex: 0,
      results: [],
      hintVisible: false,
    }),
}))

export default useAppStore
