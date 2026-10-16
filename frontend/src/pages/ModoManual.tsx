import { useEffect, useRef, useState, type FormEvent } from 'react'
import ArquivoGerado from '../components/ArquivoGerado'
import { IconeMais } from '../components/Icones'
import Mascote from '../components/Mascote'
import SeletorBanco from '../components/SeletorBanco'
import TabelaEditor from '../components/manual/TabelaEditor'
import {
  acharReferencia,
  limparNome,
  montarPedido,
  novaColuna,
  novaTabela,
  type ColunaForm,
  type TabelaForm,
} from '../components/manual/modelo'
import { bancos } from '../config/bancos'
import { baixarSql, baixarZip } from '../services/arquivoService'
import { ErroApi } from '../services/erroApi'
import { gerarSqlManual } from '../services/manualService'
import type { BancoDestino, GeracaoManualResponse } from '../types/sqlmaker'
import './manual.css'

interface Resultado {
  resposta: GeracaoManualResponse
  // Pedido que gerou o script, para avisar quando a tela mudar depois.
  pedido: string
}

function descreverFalha(falha: unknown, padrao: string): string[] {
  if (falha instanceof TypeError) {
    return [
      'Não foi possível conectar ao servidor. Confira se o backend está rodando.',
    ]
  }

  if (falha instanceof ErroApi) {
    return falha.problemas
  }

  return [falha instanceof Error ? falha.message : padrao]
}

function plural(quantidade: number, singular: string, varios: string) {
  return `${quantidade} ${quantidade === 1 ? singular : varios}`
}

function ModoManual() {
  const [nomeArquivo, setNomeArquivo] = useState('')
  const [banco, setBanco] = useState<BancoDestino>('ORACLE')
  const [tabelas, setTabelas] = useState<TabelaForm[]>(() => [novaTabela()])
  const [foco, setFoco] = useState<number | null>(null)
  const [gerando, setGerando] = useState(false)
  const [baixando, setBaixando] = useState(false)
  const [erros, setErros] = useState<string[]>([])
  const [erroDownload, setErroDownload] = useState<string | null>(null)
  const [resultado, setResultado] = useState<Resultado | null>(null)

  const resultadoRef = useRef<HTMLHeadingElement>(null)

  const pedido = montarPedido(nomeArquivo, banco, tabelas)
  const desatualizado =
    resultado !== null && resultado.pedido !== JSON.stringify(pedido)

  const totalColunas = tabelas.reduce(
    (total, tabela) => total + tabela.colunas.length,
    0,
  )

  // Script novo: leva a tela até ele.
  useEffect(() => {
    const titulo = resultadoRef.current
    if (!resultado || !titulo) return

    const reduzido = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    titulo.scrollIntoView({
      behavior: reduzido ? 'auto' : 'smooth',
      block: 'start',
    })
    titulo.focus({ preventScroll: true })
  }, [resultado])

  function atualizarTabela(
    chave: number,
    atualizar: (tabela: TabelaForm) => TabelaForm,
  ) {
    setTabelas((atuais) =>
      atuais.map((tabela) => (tabela.chave === chave ? atualizar(tabela) : tabela)),
    )
  }

  function mudarColuna(
    tabelaChave: number,
    colunaChave: number,
    mudancas: Partial<ColunaForm>,
  ) {
    atualizarTabela(tabelaChave, (tabela) => ({
      ...tabela,
      colunas: tabela.colunas.map((coluna) =>
        coluna.chave === colunaChave ? { ...coluna, ...mudancas } : coluna,
      ),
    }))
  }

  // A FK precisa ter o mesmo tipo da coluna de destino, então o tipo vem junto.
  function escolherReferencia(
    tabelaChave: number,
    colunaChave: number,
    valor: string,
  ) {
    const alvo = acharReferencia(tabelas, valor)

    mudarColuna(
      tabelaChave,
      colunaChave,
      alvo
        ? {
            referencia: valor,
            tipo: alvo.coluna.tipo,
            tamanho: alvo.coluna.tamanho,
            escala: alvo.coluna.escala,
            autoIncremento: false,
          }
        : { referencia: valor },
    )
  }

  function adicionarColuna(tabelaChave: number) {
    const coluna = novaColuna()

    atualizarTabela(tabelaChave, (tabela) => ({
      ...tabela,
      colunas: [...tabela.colunas, coluna],
    }))
    setFoco(coluna.chave)
  }

  function removerColuna(tabelaChave: number, colunaChave: number) {
    atualizarTabela(tabelaChave, (tabela) => ({
      ...tabela,
      colunas: tabela.colunas.filter((coluna) => coluna.chave !== colunaChave),
    }))
  }

  function adicionarTabela() {
    const tabela = novaTabela()

    setTabelas((atuais) => [...atuais, tabela])
    setFoco(tabela.chave)
  }

  function removerTabela(chave: number) {
    setTabelas((atuais) => atuais.filter((tabela) => tabela.chave !== chave))
  }

  async function gerar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (gerando) return

    setGerando(true)
    setErros([])

    try {
      const resposta = await gerarSqlManual(pedido)

      setResultado({ resposta, pedido: JSON.stringify(pedido) })
      setErroDownload(null)
    } catch (falha) {
      setErros(descreverFalha(falha, 'Não foi possível gerar o SQL.'))
    } finally {
      setGerando(false)
    }
  }

  async function baixar(acao: () => Promise<void>) {
    if (baixando) return

    setBaixando(true)
    setErroDownload(null)

    try {
      await acao()
    } catch (falha) {
      setErroDownload(
        descreverFalha(falha, 'Não foi possível baixar o arquivo.').join(' '),
      )
    } finally {
      setBaixando(false)
    }
  }

  return (
    <div className="pagina manual">
      <title>Modo manual – SQLmakerJ</title>
      <h1 className="visualmente-oculto">Modo manual</h1>

      <form
        className="manual-form"
        onSubmit={(evento) => {
          void gerar(evento)
        }}
      >
        <div className="manual-arquivo">
          <label className="campo campo-nome-arquivo">
            <span className="campo-rotulo">Nome do arquivo</span>
            <span className="campo-arquivo">
              <input
                value={nomeArquivo}
                placeholder="ex.: escola"
                required
                maxLength={100}
                pattern="[A-Za-z0-9][A-Za-z0-9_\-]*(\.[sS][qQ][lL])?"
                title="Use só letras sem acento, números, hífen e _."
                autoComplete="off"
                spellCheck={false}
                onChange={(evento) => {
                  setNomeArquivo(limparNome(evento.target.value))
                }}
              />
              <span className="campo-arquivo-extensao" aria-hidden="true">
                .sql
              </span>
            </span>
          </label>

          <div className="campo">
            <span className="campo-rotulo" aria-hidden="true">
              Banco
            </span>
            <SeletorBanco banco={banco} onTrocar={setBanco} />
          </div>
        </div>

        <ol className="manual-tabelas">
          {tabelas.map((tabela, indice) => (
            <li key={tabela.chave}>
              <TabelaEditor
                tabela={tabela}
                numero={indice + 1}
                banco={banco}
                tabelas={tabelas}
                foco={foco}
                podeRemover={tabelas.length > 1}
                onMudarNome={(nome) => {
                  atualizarTabela(tabela.chave, (atual) => ({ ...atual, nome }))
                }}
                onRemover={() => {
                  removerTabela(tabela.chave)
                }}
                onAdicionarColuna={() => {
                  adicionarColuna(tabela.chave)
                }}
                onMudarColuna={(colunaChave, mudancas) => {
                  mudarColuna(tabela.chave, colunaChave, mudancas)
                }}
                onEscolherReferencia={(colunaChave, valor) => {
                  escolherReferencia(tabela.chave, colunaChave, valor)
                }}
                onRemoverColuna={(colunaChave) => {
                  removerColuna(tabela.chave, colunaChave)
                }}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="botao-tracejado adicionar-tabela"
          onClick={adicionarTabela}
        >
          <IconeMais />
          Adicionar tabela
        </button>

        {erros.length > 0 && (
          <div className="manual-erros" role="alert">
            <p>O script não foi gerado. Corrija e tente de novo:</p>
            <ul>
              {erros.map((erro) => (
                <li key={erro}>{erro}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="manual-acoes">
          <button type="submit" className="botao" disabled={gerando}>
            {gerando ? 'Gerando…' : 'Gerar SQL'}
          </button>
          <p className="manual-resumo">
            {plural(tabelas.length, 'tabela', 'tabelas')} e{' '}
            {plural(totalColunas, 'coluna', 'colunas')}
          </p>
        </div>
      </form>

      {resultado && (
        <section
          className="manual-resultado"
          aria-labelledby="manual-resultado-titulo"
        >
          <h2 id="manual-resultado-titulo" ref={resultadoRef} tabIndex={-1}>
            Script gerado
          </h2>

          {desatualizado && (
            <p className="manual-aviso">
              Você mudou a estrutura depois de gerar. Clique em Gerar SQL de
              novo para atualizar o script.
            </p>
          )}

          <div className="manual-resposta">
            <Mascote tamanho={40} className="avatar" />

            <div className="manual-resposta-conteudo">
              <div className="balao">
                <span
                  className="etiqueta-banco"
                  data-banco={resultado.resposta.banco}
                >
                  <span className="ponto-banco" aria-hidden="true" />
                  {bancos[resultado.resposta.banco].nome}{' '}
                  {resultado.resposta.versao}
                </span>
                <p className="manual-explicacao">
                  {resultado.resposta.explicacao}
                </p>
              </div>

              {resultado.resposta.arquivos.map((arquivo) => (
                <ArquivoGerado
                  key={arquivo.nome}
                  arquivo={arquivo}
                  baixando={baixando}
                  onBaixar={() => {
                    void baixar(() => baixarSql(arquivo))
                  }}
                  onBaixarZip={() => {
                    void baixar(() =>
                      baixarZip(
                        [arquivo],
                        arquivo.nome.replace(/\.sql$/i, '.zip'),
                      ),
                    )
                  }}
                />
              ))}

              {erroDownload && (
                <p className="balao balao-erro" role="alert">
                  {erroDownload}
                </p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ModoManual
