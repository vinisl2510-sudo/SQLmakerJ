import type { BancoDestino } from '../../types/sqlmaker'
import { IconeMais, IconeTabela } from '../Icones'
import ColunaEditor, { DICA_NOME, PADRAO_NOME } from './ColunaEditor'
import {
  limparNome,
  opcoesReferencia,
  type ColunaForm,
  type TabelaForm,
} from './modelo'

interface TabelaEditorProps {
  tabela: TabelaForm
  numero: number
  banco: BancoDestino
  tabelas: TabelaForm[]
  foco: number | null
  podeRemover: boolean
  onMudarNome: (nome: string) => void
  onRemover: () => void
  onAdicionarColuna: () => void
  onMudarColuna: (colunaChave: number, mudancas: Partial<ColunaForm>) => void
  onEscolherReferencia: (colunaChave: number, valor: string) => void
  onRemoverColuna: (colunaChave: number) => void
}

function TabelaEditor({
  tabela,
  numero,
  banco,
  tabelas,
  foco,
  podeRemover,
  onMudarNome,
  onRemover,
  onAdicionarColuna,
  onMudarColuna,
  onEscolherReferencia,
  onRemoverColuna,
}: TabelaEditorProps) {
  const titulo = `tabela-${tabela.chave}-titulo`
  const nome = tabela.nome.trim()

  return (
    <section className="tabela-editor" aria-labelledby={titulo}>
      <h2 id={titulo} className="visualmente-oculto">
        {nome ? `Tabela ${nome}` : `Tabela ${numero}`}
      </h2>

      <div className="tabela-topo">
        <label className="tabela-nome">
          <IconeTabela tamanho={18} />
          Tabela
          <input
            value={tabela.nome}
            placeholder="ex.: aluno"
            required
            maxLength={63}
            pattern={PADRAO_NOME}
            title={DICA_NOME}
            autoComplete="off"
            spellCheck={false}
            autoFocus={foco === tabela.chave}
            onChange={(evento) => {
              onMudarNome(limparNome(evento.target.value))
            }}
          />
        </label>

        <button
          type="button"
          className="botao-pequeno"
          disabled={!podeRemover}
          title={podeRemover ? undefined : 'O arquivo precisa de pelo menos uma tabela'}
          onClick={onRemover}
        >
          Remover tabela
        </button>
      </div>

      <div className="colunas-cabecalho" aria-hidden="true">
        <span>coluna</span>
        <span>tipo</span>
        <span>tamanho</span>
        <span>opções</span>
      </div>

      <ol className="colunas">
        {tabela.colunas.map((coluna, indice) => (
          <ColunaEditor
            key={coluna.chave}
            coluna={coluna}
            numero={indice + 1}
            banco={banco}
            opcoes={
              coluna.chaveEstrangeira
                ? opcoesReferencia(tabelas, coluna.chave)
                : []
            }
            focar={foco === coluna.chave}
            onMudar={(mudancas) => {
              onMudarColuna(coluna.chave, mudancas)
            }}
            onEscolherReferencia={(valor) => {
              onEscolherReferencia(coluna.chave, valor)
            }}
            onRemover={() => {
              onRemoverColuna(coluna.chave)
            }}
          />
        ))}
      </ol>

      <div className="tabela-rodape">
        <button
          type="button"
          className="botao-tracejado"
          onClick={onAdicionarColuna}
        >
          <IconeMais />
          Adicionar coluna
        </button>
      </div>
    </section>
  )
}

export default TabelaEditor
