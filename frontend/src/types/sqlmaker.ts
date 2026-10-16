export type BancoDestino = 'MYSQL' | 'POSTGRESQL' | 'ORACLE'

export interface ArquivoSql {
  nome: string
  conteudo: string
}

export interface ProblemaApi {
  title?: string
  detail?: string
  status?: number
  campos?: Record<string, string>
  erros?: string[]
}

/* Modo manual */

export type TipoColuna =
  | 'INT'
  | 'BIGINT'
  | 'VARCHAR'
  | 'CHAR'
  | 'TEXT'
  | 'DECIMAL'
  | 'BOOLEAN'
  | 'DATE'
  | 'DATETIME'

export interface ReferenciaColuna {
  tabela: string
  coluna: string
}

export interface ColunaManual {
  nome: string
  tipo: TipoColuna
  tamanho: number | null
  escala: number | null
  chavePrimaria: boolean
  autoIncremento: boolean
  obrigatorio: boolean
  unico: boolean
  referencia: ReferenciaColuna | null
}

export interface TabelaManual {
  nome: string
  colunas: ColunaManual[]
}

export interface GeracaoManualRequest {
  banco: BancoDestino
  nomeArquivo: string
  tabelas: TabelaManual[]
}

export interface GeracaoManualResponse {
  banco: BancoDestino
  versao: string
  arquivos: ArquivoSql[]
  explicacao: string
}