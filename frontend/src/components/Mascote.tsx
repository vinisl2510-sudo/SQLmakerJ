interface MascoteProps {
  tamanho?: number
  piscando?: boolean
  className?: string
}

// Cores fixas: o mascote é uma ilustração e fica igual nos dois temas.
const TINTA = '#231f42'

function Mascote({ tamanho = 48, piscando = false, className }: MascoteProps) {
  const classes = ['mascote', piscando && 'mascote-vivo', className]
    .filter(Boolean)
    .join(' ')

  return (
    <svg
      className={classes}
      width={tamanho}
      height={tamanho}
      viewBox="0 12 120 120"
      aria-hidden="true"
    >
      <g
        stroke={TINTA}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 34 V108 A46 15 0 0 0 106 108 V34" fill="#ffc53d" />
        <path d="M14 94 A46 15 0 0 0 106 94" fill="none" strokeWidth="4" />
        <ellipse cx="60" cy="34" rx="46" ry="15" fill="#ffe08a" />
      </g>

      <g className="mascote-olhos" fill={TINTA}>
        <ellipse cx="44" cy="60" rx="6" ry="8" />
        <ellipse cx="76" cy="60" rx="6" ry="8" />
        <circle cx="46" cy="57" r="2.2" fill="#ffffff" />
        <circle cx="78" cy="57" r="2.2" fill="#ffffff" />
      </g>

      <ellipse cx="31" cy="74" rx="7" ry="4" fill="#ff9bb0" />
      <ellipse cx="89" cy="74" rx="7" ry="4" fill="#ff9bb0" />
      <path
        d="M50 73 Q60 83 70 73"
        fill="none"
        stroke={TINTA}
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default Mascote
