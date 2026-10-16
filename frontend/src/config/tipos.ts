import type { BancoDestino, TipoColuna } from '../types/sqlmaker'

// O que a coluna pede além do tipo: nada, um tamanho ou dígitos e casas decimais.
export type Medida = 'nenhuma' | 'tamanho' | 'precisao'

interface Tipo {
  rotulos: Record<BancoDestino, string>
  medida: Medida
  automatico: boolean
  tamanhoPadrao: string
  escalaPadrao: string
}

function tipo(
  rotulos: Record<BancoDestino, string>,
  extras: Partial<Omit<Tipo, 'rotulos'>> = {},
): Tipo {
  return {
    rotulos,
    medida: 'nenhuma',
    automatico: false,
    tamanhoPadrao: '',
    escalaPadrao: '',
    ...extras,
  }
}

// Os nomes seguem o banco escolhido; o backend faz a mesma tradução ao gerar o SQL.
export const tipos: Record<TipoColuna, Tipo> = {
  INT: tipo(
    { MYSQL: 'INT', POSTGRESQL: 'INTEGER', ORACLE: 'NUMBER(10)' },
    { automatico: true },
  ),
  BIGINT: tipo(
    { MYSQL: 'BIGINT', POSTGRESQL: 'BIGINT', ORACLE: 'NUMBER(19)' },
    { automatico: true },
  ),
  VARCHAR: tipo(
    { MYSQL: 'VARCHAR', POSTGRESQL: 'VARCHAR', ORACLE: 'VARCHAR2' },
    { medida: 'tamanho', tamanhoPadrao: '100' },
  ),
  CHAR: tipo(
    { MYSQL: 'CHAR', POSTGRESQL: 'CHAR', ORACLE: 'CHAR' },
    { medida: 'tamanho', tamanhoPadrao: '1' },
  ),
  TEXT: tipo({ MYSQL: 'TEXT', POSTGRESQL: 'TEXT', ORACLE: 'CLOB' }),
  DECIMAL: tipo(
    { MYSQL: 'DECIMAL', POSTGRESQL: 'NUMERIC', ORACLE: 'NUMBER(p,s)' },
    { medida: 'precisao', tamanhoPadrao: '10', escalaPadrao: '2' },
  ),
  BOOLEAN: tipo({
    MYSQL: 'BOOLEAN',
    POSTGRESQL: 'BOOLEAN',
    ORACLE: 'NUMBER(1) 0/1',
  }),
  DATE: tipo({ MYSQL: 'DATE', POSTGRESQL: 'DATE', ORACLE: 'DATE' }),
  DATETIME: tipo({
    MYSQL: 'DATETIME',
    POSTGRESQL: 'TIMESTAMP',
    ORACLE: 'TIMESTAMP',
  }),
}

export const listaTipos = Object.keys(tipos) as TipoColuna[]
