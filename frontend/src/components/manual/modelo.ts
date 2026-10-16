import { tipos } from '../../config/tipos'
import type {
  BancoDestino,
  GeracaoManualRequest,
  TipoColuna,
} from '../../types/sqlmaker'

// Estado da tela. Os números ficam como texto enquanto o usuário digita.
export interface ColunaForm {
  chave: number
  nome: string
  tipo: TipoColuna
  tamanho: string
  escala: string
  chavePrimaria: boolean
  autoIncremento: boolean
  obrigatorio: boolean
  unico: boolean
  chaveEstrangeira: boolean
  // "chaveDaTabela:chaveDaColuna" da coluna referenciada, para sobreviver a renomeações.
  referencia: string
  // A coluna id que toda tabela começa tendo não pode ser removida.
  fixa: boolean
}

export interface TabelaForm {
  chave: number
  nome: string
  colunas: ColunaForm[]
}

export interface OpcaoReferencia {
  valor: string
  rotulo: string
}

let ultimaChave = 0

function novaChave() {
  ultimaChave += 1
  return ultimaChave
}

export function novaColuna(): ColunaForm {
  return {
    chave: novaChave(),
    nome: '',
    tipo: 'VARCHAR',
    tamanho: tipos.VARCHAR.tamanhoPadrao,
    escala: '',
    chavePrimaria: false,
    autoIncremento: false,
    obrigatorio: false,
    unico: false,
    chaveEstrangeira: false,
    referencia: '',
    fixa: false,
  }
}

export function novaTabela(): TabelaForm {
  return {
    chave: novaChave(),
    nome: '',
    colunas: [
      {
        ...novaColuna(),
        nome: 'id',
        tipo: 'INT',
        tamanho: '',
        chavePrimaria: true,
        autoIncremento: true,
        obrigatorio: true,
        fixa: true,
      },
    ],
  }
}

// Os bancos não aceitam acento nem espaço em nomes; corrige enquanto o usuário digita.
export function limparNome(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s/g, '_')
}

export function trocarTipo(
  coluna: ColunaForm,
  tipo: TipoColuna,
): Partial<ColunaForm> {
  const novo = tipos[tipo]
  const mudancas: Partial<ColunaForm> = { tipo }

  // Mantém o tamanho digitado entre VARCHAR e CHAR; nos outros casos usa o padrão.
  if (novo.medida !== tipos[coluna.tipo].medida) {
    mudancas.tamanho = novo.tamanhoPadrao
    mudancas.escala = novo.escalaPadrao
  }

  if (!novo.automatico) {
    mudancas.autoIncremento = false
  }

  return mudancas
}

// Só dá para referenciar uma coluna que não aceita valores repetidos.
function referenciavel(tabela: TabelaForm, coluna: ColunaForm): boolean {
  if (coluna.chavePrimaria) {
    return tabela.colunas.filter((outra) => outra.chavePrimaria).length === 1
  }

  return coluna.unico
}

export function opcoesReferencia(
  tabelas: TabelaForm[],
  colunaChave: number,
): OpcaoReferencia[] {
  return tabelas.flatMap((tabela) =>
    tabela.colunas
      .filter(
        (coluna) =>
          coluna.chave !== colunaChave &&
          tabela.nome.trim() !== '' &&
          coluna.nome.trim() !== '' &&
          referenciavel(tabela, coluna),
      )
      .map((coluna) => ({
        valor: `${tabela.chave}:${coluna.chave}`,
        rotulo: `${tabela.nome.trim()}.${coluna.nome.trim()}`,
      })),
  )
}

export function acharReferencia(tabelas: TabelaForm[], valor: string) {
  const [tabelaChave, colunaChave] = valor.split(':').map(Number)
  const tabela = tabelas.find((candidata) => candidata.chave === tabelaChave)
  const coluna = tabela?.colunas.find(
    (candidata) => candidata.chave === colunaChave,
  )

  return tabela && coluna ? { tabela, coluna } : null
}

export function montarPedido(
  nomeArquivo: string,
  banco: BancoDestino,
  tabelas: TabelaForm[],
): GeracaoManualRequest {
  return {
    banco,
    nomeArquivo: nomeArquivo.trim(),
    tabelas: tabelas.map((tabela) => ({
      nome: tabela.nome.trim(),
      colunas: tabela.colunas.map((coluna) => {
        const tipo = tipos[coluna.tipo]
        const alvo = coluna.chaveEstrangeira
          ? acharReferencia(tabelas, coluna.referencia)
          : null

        return {
          nome: coluna.nome.trim(),
          tipo: coluna.tipo,
          tamanho: tipo.medida === 'nenhuma' ? null : Number(coluna.tamanho),
          escala: tipo.medida === 'precisao' ? Number(coluna.escala || 0) : null,
          chavePrimaria: coluna.chavePrimaria,
          autoIncremento: tipo.automatico && coluna.autoIncremento,
          // A PK já é obrigatória e única; a tela mostra essas opções travadas.
          obrigatorio: coluna.chavePrimaria || coluna.obrigatorio,
          unico: !coluna.chavePrimaria && coluna.unico,
          referencia: alvo
            ? {
                tabela: alvo.tabela.nome.trim(),
                coluna: alvo.coluna.nome.trim(),
              }
            : null,
        }
      }),
    })),
  }
}
