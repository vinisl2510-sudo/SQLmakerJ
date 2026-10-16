import { bancos, listaBancos } from '../config/bancos'
import type { BancoDestino } from '../types/sqlmaker'
import { IconeSeta } from './Icones'
import './seletor-banco.css'

interface SeletorBancoProps {
  banco: BancoDestino
  onTrocar: (banco: BancoDestino) => void
}

function SeletorBanco({ banco, onTrocar }: SeletorBancoProps) {
  return (
    <label className="seletor-banco" data-banco={banco}>
      <span className="visualmente-oculto">Banco de destino</span>
      <span className="ponto-banco" aria-hidden="true" />
      <select
        value={banco}
        onChange={(evento) => {
          onTrocar(evento.target.value as BancoDestino)
        }}
      >
        {listaBancos.map((id) => (
          <option key={id} value={id}>
            {bancos[id].nome}
          </option>
        ))}
      </select>
      <IconeSeta />
    </label>
  )
}

export default SeletorBanco
