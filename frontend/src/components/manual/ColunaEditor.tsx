import { useId } from 'react'
import { listaTipos, tipos } from '../../config/tipos'
import type { BancoDestino, TipoColuna } from '../../types/sqlmaker'
import {
  IconeChave,
  IconeFechar,
  IconeRetorno,
  IconeSeta,
} from '../Icones'
import {
  limparNome,
  trocarTipo,
  type ColunaForm,
  type OpcaoReferencia,
} from './modelo'
import Opcao from './Opcao'

// Mesmo padrão validado no backend: letra no começo, depois letras, números e _.
export const PADRAO_NOME = '[A-Za-z][A-Za-z0-9_]*'
export const DICA_NOME =
  'Use só letras sem acento, números e _, começando por uma letra.'

interface ColunaEditorProps {
  coluna: ColunaForm
  numero: number
  banco: BancoDestino
  opcoes: OpcaoReferencia[]
  focar: boolean
  onMudar: (mudancas: Partial<ColunaForm>) => void
  onEscolherReferencia: (valor: string) => void
  onRemover: () => void
}

function ColunaEditor({
  coluna,
  numero,
  banco,
  opcoes,
  focar,
  onMudar,
  onEscolherReferencia,
  onRemover,
}: ColunaEditorProps) {
  const id = useId()
  const tipo = tipos[coluna.tipo]
  const nome = coluna.nome.trim() || `coluna ${numero}`

  // Se a coluna referenciada sumiu ou deixou de ser PK/Única, a escolha volta a ficar vazia.
  const referencia = opcoes.some((opcao) => opcao.valor === coluna.referencia)
    ? coluna.referencia
    : ''

  return (
    <li className="coluna">
      <div className="coluna-linha" role="group" aria-label={`Coluna ${nome}`}>
        <input
          className="campo-texto coluna-nome"
          value={coluna.nome}
          placeholder="ex.: email"
          aria-label="Nome da coluna"
          required
          maxLength={63}
          pattern={PADRAO_NOME}
          title={DICA_NOME}
          autoComplete="off"
          spellCheck={false}
          autoFocus={focar}
          onChange={(evento) => {
            onMudar({ nome: limparNome(evento.target.value) })
          }}
        />

        <span className="campo-select coluna-tipo">
          <select
            value={coluna.tipo}
            aria-label="Tipo"
            onChange={(evento) => {
              onMudar(trocarTipo(coluna, evento.target.value as TipoColuna))
            }}
          >
            {listaTipos.map((id) => (
              <option key={id} value={id}>
                {tipos[id].rotulos[banco]}
              </option>
            ))}
          </select>
          <IconeSeta />
        </span>

        <span className="coluna-tamanho">
          {tipo.medida === 'nenhuma' && (
            <span className="coluna-sem-tamanho" title="Este tipo não usa tamanho">
              —
            </span>
          )}

          {tipo.medida !== 'nenhuma' && (
            <input
              type="number"
              className="campo-texto campo-numero"
              value={coluna.tamanho}
              aria-label={
                tipo.medida === 'precisao' ? 'Total de dígitos' : 'Tamanho'
              }
              title={
                tipo.medida === 'precisao'
                  ? 'Total de dígitos, contando as casas decimais'
                  : 'Quantidade máxima de caracteres'
              }
              required
              min={1}
              step={1}
              inputMode="numeric"
              onChange={(evento) => {
                onMudar({ tamanho: evento.target.value })
              }}
            />
          )}

          {tipo.medida === 'precisao' && (
            <>
              <span className="campo-separador" aria-hidden="true">
                ,
              </span>
              <input
                type="number"
                className="campo-texto campo-numero"
                value={coluna.escala}
                aria-label="Casas decimais"
                title="Casas decimais"
                min={0}
                step={1}
                inputMode="numeric"
                onChange={(evento) => {
                  onMudar({ escala: evento.target.value })
                }}
              />
            </>
          )}
        </span>

        <div className="coluna-opcoes">
          <Opcao
            rotulo="PK"
            descricao="chave primária, identifica cada linha"
            icone={<IconeChave />}
            marcada={coluna.chavePrimaria}
            onMudar={(marcada) => {
              onMudar({ chavePrimaria: marcada })
            }}
          />
          <Opcao
            rotulo="FK"
            descricao="chave estrangeira, aponta para outra tabela"
            marcada={coluna.chaveEstrangeira}
            onMudar={(marcada) => {
              onMudar({ chaveEstrangeira: marcada })
            }}
          />
          <Opcao
            rotulo="Obrigatório"
            descricao={
              coluna.chavePrimaria
                ? 'a PK já não aceita NULL'
                : 'não aceita NULL (NOT NULL)'
            }
            marcada={coluna.chavePrimaria || coluna.obrigatorio}
            desabilitada={coluna.chavePrimaria}
            onMudar={(marcada) => {
              onMudar({ obrigatorio: marcada })
            }}
          />
          <Opcao
            rotulo="Único"
            descricao={
              coluna.chavePrimaria
                ? 'a PK já não aceita valores repetidos'
                : 'não aceita valores repetidos (UNIQUE)'
            }
            marcada={!coluna.chavePrimaria && coluna.unico}
            desabilitada={coluna.chavePrimaria}
            onMudar={(marcada) => {
              onMudar({ unico: marcada })
            }}
          />
          {tipo.automatico && (
            <Opcao
              rotulo="Automático"
              descricao="o banco gera o número sozinho"
              marcada={coluna.autoIncremento}
              onMudar={(marcada) => {
                onMudar({ autoIncremento: marcada })
              }}
            />
          )}
        </div>

        {!coluna.fixa && (
          <button
            type="button"
            className="botao-icone coluna-remover"
            aria-label={`Remover coluna ${nome}`}
            title="Remover coluna"
            onClick={onRemover}
          >
            <IconeFechar />
          </button>
        )}

        {coluna.chaveEstrangeira && (
          <div className="coluna-referencia">
            <IconeRetorno />
            <label htmlFor={`${id}-referencia`}>Aponta para</label>
            <span className="campo-select">
              <select
                id={`${id}-referencia`}
                value={referencia}
                required
                aria-describedby={
                  opcoes.length === 0 ? `${id}-referencia-dica` : undefined
                }
                onChange={(evento) => {
                  onEscolherReferencia(evento.target.value)
                }}
              >
                <option value="" disabled>
                  Escolha a coluna
                </option>
                {opcoes.map((opcao) => (
                  <option key={opcao.valor} value={opcao.valor}>
                    {opcao.rotulo}
                  </option>
                ))}
              </select>
              <IconeSeta />
            </span>
            {opcoes.length === 0 && (
              <span
                id={`${id}-referencia-dica`}
                className="coluna-referencia-dica"
              >
                Dê nome à tabela de destino e marque PK ou Único na coluna que
                vai ser referenciada.
              </span>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

export default ColunaEditor
