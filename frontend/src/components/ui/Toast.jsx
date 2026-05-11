import useAppStore from '../../store/useAppStore'

export default function Toast() {
  const { toast } = useAppStore()
  if (!toast) return null

  return (
    <div className={`toast${toast.type === 'success' ? ' success-toast' : ''}`}>
      {toast.msg}
    </div>
  )
}
