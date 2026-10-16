import type { BancoDestino } from '../types/sqlmaker'

interface Banco {
  nome: string
  versao: string
}

// A versão não aparece na tela, mas o backend exige uma em cada pedido.
export const bancos: Record<BancoDestino, Banco> = {
  MYSQL: { nome: 'MySQL', versao: '8.0' },
  POSTGRESQL: { nome: 'PostgreSQL', versao: '16' },
  ORACLE: { nome: 'Oracle', versao: '19c' },
}

export const listaBancos = Object.keys(bancos) as BancoDestino[]
