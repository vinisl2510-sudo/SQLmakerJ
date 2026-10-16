interface IconeProps {
  tamanho?: number
}

function base(tamanho: number) {
  return {
    width: tamanho,
    height: tamanho,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
}

export function IconeTabela({ tamanho = 20 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18M9 10v10" />
    </svg>
  )
}

export function IconeChave({ tamanho = 14 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  )
}

export function IconeEnviar({ tamanho = 18 }: IconeProps) {
  return (
    <svg {...base(tamanho)} strokeWidth={2.25}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

export function IconeSol({ tamanho = 18 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

export function IconeLua({ tamanho = 18 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function IconeSeta({ tamanho = 14 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function IconeMais({ tamanho = 18 }: IconeProps) {
  return (
    <svg {...base(tamanho)} strokeWidth={2.5}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconeFechar({ tamanho = 16 }: IconeProps) {
  return (
    <svg {...base(tamanho)} strokeWidth={2.5}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function IconeCheck({ tamanho = 14 }: IconeProps) {
  return (
    <svg {...base(tamanho)} strokeWidth={3}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function IconeRetorno({ tamanho = 16 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <path d="M5 4v7a4 4 0 0 0 4 4h11" />
      <path d="m15 10 5 5-5 5" />
    </svg>
  )
}

export function IconeCopiar({ tamanho = 18 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  )
}

export function IconeSetaDireita({ tamanho = 18 }: IconeProps) {
  return (
    <svg {...base(tamanho)} strokeWidth={2.5}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function IconeExterno({ tamanho = 16 }: IconeProps) {
  return (
    <svg {...base(tamanho)} strokeWidth={2.5}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

export function IconeEmail({ tamanho = 22 }: IconeProps) {
  return (
    <svg {...base(tamanho)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}

// As marcas do LinkedIn e do GitHub são preenchidas, não traçadas.
export function IconeLinkedin({ tamanho = 22 }: IconeProps) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" aria-hidden="true">
      <g fill="currentColor">
        <circle cx="4.75" cy="4.75" r="2.6" />
        <rect x="2.4" y="9" width="4.7" height="12.5" rx="0.6" />
        <path d="M10 9h4.4v1.9c.7-1.3 2.3-2.3 4.5-2.3 3.4 0 4.9 2.1 4.9 5.9v7h-4.6v-6.2c0-1.7-.6-2.9-2.2-2.9s-2.4 1.2-2.4 2.9v6.2H10Z" />
      </g>
    </svg>
  )
}

export function IconeGithub({ tamanho = 22 }: IconeProps) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  )
}
