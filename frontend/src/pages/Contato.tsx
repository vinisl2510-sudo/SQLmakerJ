import { useState, type ComponentType, type FormEvent } from 'react'
import FundoEstrelas from '../components/FundoEstrelas'
import {
  IconeCheck,
  IconeCopiar,
  IconeEmail,
  IconeEnviar,
  IconeExterno,
  IconeGithub,
  IconeLinkedin,
} from '../components/Icones'
import './contato.css'

const EMAIL = 'vinisl.2510@gmail.com'

interface Rede {
  id: 'github' | 'linkedin'
  nome: string
  usuario: string
  endereco: string
  icone: ComponentType<{ tamanho?: number }>
}

const redes: Rede[] = [
  {
    id: 'github',
    nome: 'GitHub',
    usuario: 'vinisl2510-sudo',
    endereco: 'https://github.com/vinisl2510-sudo',
    icone: IconeGithub,
  },
  {
    id: 'linkedin',
    nome: 'LinkedIn',
    usuario: 'vinícius-soares-loureiro',
    endereco:
      'https://www.linkedin.com/in/vin%C3%ADcius-soares-loureiro-9bb96b34b/',
    icone: IconeLinkedin,
  },
]

type EstadoCopia = 'pronto' | 'copiado' | 'falhou'

const rotulosCopia: Record<EstadoCopia, string> = {
  pronto: 'Copiar',
  copiado: 'Copiado',
  falhou: 'Erro ao copiar',
}

function Contato() {
  const [copia, setCopia] = useState<EstadoCopia>('pronto')
  const [tentouEnviar, setTentouEnviar] = useState(false)

  // Nem todo computador tem um programa de e-mail para abrir o mailto.
  async function copiarEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopia('copiado')
    } catch {
      setCopia('falhou')
    }

    window.setTimeout(() => {
      setCopia('pronto')
    }, 2000)
  }

  // O envio ainda não existe: os dados ficam no formulário e nada sai daqui.
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    setTentouEnviar(true)
  }

  return (
    <div className="pagina">
      <title>Contato – SQLmakerJ</title>
      <FundoEstrelas />

      <div className="contato-grade">
        <section className="canais" aria-labelledby="contato-titulo">
          <h1 id="contato-titulo" className="contato-titulo">
            Contato
          </h1>

          <ul className="canais-lista">
            <li className="canal-com-acao">
              <a className="canal" href={`mailto:${EMAIL}`}>
                <span className="canal-icone" data-rede="email">
                  <IconeEmail />
                </span>
                <span className="canal-texto">
                  <span className="canal-nome">E-mail</span>
                  {/* Se precisar quebrar a linha, quebra depois do @. */}
                  <span className="canal-detalhe">
                    {EMAIL.split('@')[0]}@<wbr />
                    {EMAIL.split('@')[1]}
                  </span>
                </span>
              </a>
              <button
                type="button"
                className="canal-copiar"
                aria-label="Copiar e-mail"
                title={copia === 'pronto' ? 'Copiar e-mail' : rotulosCopia[copia]}
                data-estado={copia}
                onClick={() => {
                  void copiarEmail()
                }}
              >
                {copia === 'copiado' ? <IconeCheck tamanho={18} /> : <IconeCopiar />}
              </button>
            </li>

            {redes.map(({ id, nome, usuario, endereco, icone: Icone }) => (
              <li key={id}>
                <a
                  className="canal"
                  href={endereco}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="canal-icone" data-rede={id}>
                    <Icone />
                  </span>
                  <span className="canal-texto">
                    <span className="canal-nome">{nome}</span>
                    <span className="canal-detalhe">{usuario}</span>
                  </span>
                  <span className="canal-seta">
                    <IconeExterno />
                  </span>
                  <span className="visualmente-oculto">(abre em nova aba)</span>
                </a>
              </li>
            ))}
          </ul>

          <span className="visualmente-oculto" aria-live="polite">
            {copia === 'pronto' ? '' : rotulosCopia[copia]}
          </span>
        </section>

        <section className="mensagem" aria-labelledby="mensagem-titulo">
          <h2 id="mensagem-titulo" className="mensagem-titulo">
            Envie uma mensagem
          </h2>

          <p id="mensagem-aviso" className="mensagem-aviso">
            <strong>Em construção:</strong> o envio por aqui ainda não funciona.
            Por enquanto, me escreva direto pelo e-mail.
          </p>

          <form
            className="mensagem-form"
            aria-describedby="mensagem-aviso"
            onSubmit={enviar}
          >
            <div className="mensagem-linha">
              <label className="mensagem-campo">
                <span className="mensagem-rotulo">Nome</span>
                <input
                  className="mensagem-entrada"
                  name="nome"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="mensagem-campo">
                <span className="mensagem-rotulo">Seu e-mail</span>
                <input
                  className="mensagem-entrada"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                />
              </label>
            </div>

            <label className="mensagem-campo">
              <span className="mensagem-rotulo">Assunto</span>
              <input className="mensagem-entrada" name="assunto" required />
            </label>

            <label className="mensagem-campo">
              <span className="mensagem-rotulo">Mensagem</span>
              <textarea
                className="mensagem-entrada mensagem-texto"
                name="mensagem"
                rows={6}
                required
              />
            </label>

            <div className="mensagem-rodape">
              <button type="submit" className="botao">
                Enviar mensagem
                <IconeEnviar />
              </button>

              <p className="mensagem-status" role="status">
                {tentouEnviar &&
                  'Mensagem não enviada: o envio ainda não está pronto.'}
              </p>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}

export default Contato
