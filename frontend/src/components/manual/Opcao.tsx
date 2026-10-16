import type { ReactNode } from 'react'
import { IconeCheck } from '../Icones'

interface OpcaoProps {
  rotulo: string
  descricao: string
  marcada: boolean
  desabilitada?: boolean
  icone?: ReactNode
  onMudar: (marcada: boolean) => void
}

// Bloco de liga/desliga: um checkbox de verdade, desenhado como etiqueta.
function Opcao({
  rotulo,
  descricao,
  marcada,
  desabilitada = false,
  icone,
  onMudar,
}: OpcaoProps) {
  return (
    <label className="opcao" title={descricao}>
      <input
        type="checkbox"
        className="visualmente-oculto"
        checked={marcada}
        disabled={desabilitada}
        aria-label={`${rotulo}: ${descricao}`}
        onChange={(evento) => {
          onMudar(evento.target.checked)
        }}
      />
      {icone ?? (marcada && <IconeCheck />)}
      {rotulo}
    </label>
  )
}

export default Opcao
