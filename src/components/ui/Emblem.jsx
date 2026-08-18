export function Emblem({ size = 40, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
    >
      <defs>
        <linearGradient id="snSeal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b6b56" />
          <stop offset="100%" stopColor="#084c3d" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="31" fill="url(#snSeal)" />
      <circle cx="32" cy="32" r="26" fill="none" stroke="#f4d58d" strokeWidth="1.6" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="#f4d58d" strokeWidth="0.7" opacity="0.7" />
      <path
        d="M32 14l2.6 7.2H42l-6 4.5 2.3 7.3L32 28.8l-6.3 4.2 2.3-7.3-6-4.5h7.4z"
        fill="#f4d58d"
      />
      <text
        x="32"
        y="48"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="8"
        fontFamily="Georgia, serif"
        fontWeight="700"
        letterSpacing="1"
      >
        SN
      </text>
    </svg>
  )
}
