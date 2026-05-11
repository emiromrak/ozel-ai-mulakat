import useAppStore from '../../store/useAppStore'

export default function LoadingOverlay() {
  const { loading, loadingText, loadingSub } = useAppStore()
  if (!loading) return null

  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <div className="loading-text">{loadingText}</div>
      <div className="loading-sub">{loadingSub}</div>
    </div>
  )
}
