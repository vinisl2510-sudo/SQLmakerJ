import './estrelas.css'

interface Estrela {
  x: number
  y: number
  tamanho: number
  forma: 'estrela' | 'brilho'
  cor: string
  atraso: number
  duracao: number
  soDesktop?: boolean
}

// Posições fixas (em % da tela), concentradas nas laterais para não
// ficarem atrás do texto. As marcadas soDesktop somem em telas estreitas.
const estrelas: Estrela[] = [
  { x: 2.5, y: 19, tamanho: 40, forma: 'estrela', cor: 'var(--sol)', atraso: 0, duracao: 3.2 },
  { x: 6.5, y: 44, tamanho: 26, forma: 'brilho', cor: 'var(--estrela-rosa)', atraso: 0.8, duracao: 2.6 },
  { x: 2, y: 66, tamanho: 30, forma: 'brilho', cor: 'var(--estrela-violeta)', atraso: 1.6, duracao: 3 },
  { x: 5.5, y: 86, tamanho: 34, forma: 'estrela', cor: 'var(--sol)', atraso: 2.2, duracao: 3.6 },
  { x: 14, y: 16, tamanho: 20, forma: 'brilho', cor: 'var(--estrela-azul)', atraso: 1.3, duracao: 2.4, soDesktop: true },
  { x: 27, y: 14, tamanho: 18, forma: 'brilho', cor: 'var(--sol)', atraso: 2.9, duracao: 2.2, soDesktop: true },
  { x: 41, y: 17, tamanho: 28, forma: 'estrela', cor: 'var(--sol)', atraso: 0.5, duracao: 3.4, soDesktop: true },
  { x: 49, y: 34, tamanho: 22, forma: 'brilho', cor: 'var(--estrela-azul)', atraso: 0.4, duracao: 2.4, soDesktop: true },
  { x: 50, y: 58, tamanho: 30, forma: 'estrela', cor: 'var(--sol)', atraso: 1.2, duracao: 3.4, soDesktop: true },
  { x: 48.5, y: 82, tamanho: 20, forma: 'brilho', cor: 'var(--estrela-rosa)', atraso: 2.4, duracao: 2.8, soDesktop: true },
  { x: 60, y: 15, tamanho: 18, forma: 'brilho', cor: 'var(--estrela-rosa)', atraso: 1.7, duracao: 2.6, soDesktop: true },
  { x: 74, y: 13, tamanho: 22, forma: 'brilho', cor: 'var(--estrela-violeta)', atraso: 0.9, duracao: 2.5, soDesktop: true },
  { x: 30, y: 95, tamanho: 22, forma: 'brilho', cor: 'var(--estrela-violeta)', atraso: 2.6, duracao: 2.6, soDesktop: true },
  { x: 70, y: 95, tamanho: 26, forma: 'brilho', cor: 'var(--estrela-rosa)', atraso: 1, duracao: 3, soDesktop: true },
  { x: 93.5, y: 18, tamanho: 36, forma: 'estrela', cor: 'var(--sol)', atraso: 0.6, duracao: 3 },
  { x: 96, y: 39, tamanho: 24, forma: 'brilho', cor: 'var(--estrela-rosa)', atraso: 1.9, duracao: 2.8 },
  { x: 92.5, y: 60, tamanho: 30, forma: 'brilho', cor: 'var(--estrela-azul)', atraso: 0.2, duracao: 3.2 },
  { x: 95.5, y: 82, tamanho: 38, forma: 'estrela', cor: 'var(--sol)', atraso: 1.4, duracao: 3.8 },
]

const CAMINHO_ESTRELA =
  'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'

const CAMINHO_BRILHO =
  'M12 2C12.8 8.5 15.5 11.2 22 12 15.5 12.8 12.8 15.5 12 22 11.2 15.5 8.5 12.8 2 12 8.5 11.2 11.2 8.5 12 2Z'

function FundoEstrelas() {
  return (
    <div className="fundo-estrelas" aria-hidden="true">
      {estrelas.map((estrela) => (
        <svg
          key={`${estrela.x}-${estrela.y}`}
          className={`estrela estrela-${estrela.forma}${estrela.soDesktop ? ' so-desktop' : ''}`}
          width={estrela.tamanho}
          height={estrela.tamanho}
          viewBox="0 0 24 24"
          style={{
            left: `${estrela.x}%`,
            top: `${estrela.y}%`,
            color: estrela.cor,
            animationDelay: `${estrela.atraso}s`,
            animationDuration: `${estrela.duracao}s`,
          }}
        >
          {estrela.forma === 'estrela' ? (
            <>
              <path
                d={CAMINHO_ESTRELA}
                fill="currentColor"
                stroke="#231f42"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="9.5" r="1.1" fill="#ffffff" />
            </>
          ) : (
            <path d={CAMINHO_BRILHO} fill="currentColor" />
          )}
        </svg>
      ))}
    </div>
  )
}

export default FundoEstrelas
