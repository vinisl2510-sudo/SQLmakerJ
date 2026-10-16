import { useState } from 'react'
import type { ArquivoSql } from '../types/sqlmaker'
import './arquivo.css'

type EstadoCopia = 'pronto' | 'copiado' | 'falhou'

const rotulosCopia: Record<EstadoCopia, string> = {
  pronto: 'Copiar',
  copiado: 'Copiado',
  falhou: 'Erro ao copiar',
}

interface ArquivoGeradoProps {
  arquivo: ArquivoSql
  baixando: boolean
  onBaixar: () => void
  onBaixarZip: () => void
}

function ArquivoGerado({
  arquivo,
  baixando,
  onBaixar,
  onBaixarZip,
}: ArquivoGeradoProps) {
  const [copia, setCopia] = useState<EstadoCopia>('pronto')

  async function copiar() {
    try {
      await navigator.clipboard.writeText(arquivo.conteudo)
      setCopia('copiado')
    } catch {
      setCopia('falhou')
    }

    window.setTimeout(() => {
      setCopia('pronto')
    }, 2000)
  }

  return (
    <figure className="arquivo">
      <figcaption className="arquivo-topo">
        <span className="arquivo-nome">{arquivo.nome}</span>

        <span className="arquivo-acoes">
          <button
            type="button"
            className="botao-pequeno"
            onClick={() => {
              void copiar()
            }}
          >
            {rotulosCopia[copia]}
          </button>
          <button
            type="button"
            className="botao-pequeno"
            disabled={baixando}
            onClick={onBaixar}
          >
            Baixar .sql
          </button>
          <button
            type="button"
            className="botao-pequeno"
            disabled={baixando}
            onClick={onBaixarZip}
          >
            Baixar .zip
          </button>
        </span>
      </figcaption>

      <pre>
        <code>{arquivo.conteudo}</code>
      </pre>

      <span className="visualmente-oculto" aria-live="polite">
        {copia === 'pronto' ? '' : rotulosCopia[copia]}
      </span>
    </figure>
  )
}

export default ArquivoGerado
