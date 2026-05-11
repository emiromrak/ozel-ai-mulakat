import LogoSvg from '../ui/LogoSvg'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
          <LogoSvg size={18} color="var(--accent-light)" />
          <div><span>Özel</span>Mülakat</div>
        </div>
        <div className="footer-copy">© 2026 Emir Omrak. Tüm hakları saklıdır.</div>
      </div>
      <div className="footer-links">
        <a href="#" className="footer-link">Gizlilik Politikası</a>
        <a href="https://linkedin.com/in/emiromrak" target="_blank" rel="noreferrer" className="footer-link">
          İletişim
        </a>
      </div>
    </footer>
  )
}
