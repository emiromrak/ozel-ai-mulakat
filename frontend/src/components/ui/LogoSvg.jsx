export default function LogoSvg({ size = 22, color = 'var(--text-primary)' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      <path
        d="M12 5 C12 9.5 14.5 12 19 12 C14.5 12 12 14.5 12 19 C12 14.5 9.5 12 5 12 C9.5 12 12 9.5 12 5 Z"
        fill={color}
      />
    </svg>
  )
}
