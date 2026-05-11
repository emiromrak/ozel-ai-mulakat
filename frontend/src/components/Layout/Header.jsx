import useAppStore from '../../store/useAppStore'
import LogoSvg from '../ui/LogoSvg'

export default function Header() {
  const { startFresh, companyName, position } = useAppStore()

  return (
    <header className="header">
      <div className="logo" onClick={startFresh}>
        <div className="logo-icon">
          <LogoSvg size={22} color="var(--text-primary)" />
        </div>
        <div className="logo-text">
          <span>Özel</span>Mülakat
        </div>
      </div>

      {companyName && (
        <div style={{ fontSize: '.82rem', color: 'var(--text-muted)' }}>
          <span>{companyName}</span>
          {position && <> · <span>{position}</span></>}
        </div>
      )}
    </header>
  )
}
