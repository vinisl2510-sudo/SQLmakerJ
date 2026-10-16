import { Link } from 'react-router'
import FundoEstrelas from '../components/FundoEstrelas'
import { IconeSetaDireita } from '../components/Icones'
import { bancos, listaBancos } from '../config/bancos'
import { paginas } from '../config/paginas'
import './inicio.css'

function Inicio() {
  return (
    <div className="pagina">
      <title>SQLmakerJ</title>
      <FundoEstrelas />

      <section className="inicio-abertura">
        <div className="inicio-texto">
          <h1>Scripts SQL montados tabela por tabela</h1>
          <p>
            O SQLmakerJ gera scripts CREATE TABLE para MySQL, PostgreSQL e
            Oracle. Você monta as tabelas e as colunas na tela e o Java escreve
            o script na sintaxe do banco escolhido, pronto para baixar em .sql,
            com a explicação de cada escolha.
          </p>
          <div className="inicio-acoes">
            <Link to="/manual" className="botao">
              Montar tabelas
            </Link>
          </div>
        </div>

        <nav className="atalhos" aria-label="Páginas do SQLmakerJ">
          <ul>
            {paginas.map(({ caminho, nome, descricao, icone: Icone, tom }) => (
              <li key={caminho}>
                <Link to={caminho} className="atalho" data-tom={tom}>
                  <span className="atalho-icone">
                    <Icone tamanho={22} />
                  </span>
                  <span className="atalho-texto">
                    <span className="atalho-nome">{nome}</span>
                    <span className="atalho-descricao">{descricao}</span>
                  </span>
                  <span className="atalho-seta">
                    <IconeSetaDireita />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section className="inicio-secao" aria-labelledby="como-funciona">
        <h2 id="como-funciona">Como funciona</h2>
        <ol className="passos">
          <li>
            <h3>Escolha o banco</h3>
            <p>
              MySQL, PostgreSQL ou Oracle. O script segue a sintaxe do banco
              escolhido.
            </p>
          </li>
          <li>
            <h3>Monte as tabelas</h3>
            <p>
              Dê nome às tabelas e colunas, escolha os tipos e marque chave
              primária, campos obrigatórios, únicos e chaves estrangeiras.
            </p>
          </li>
          <li>
            <h3>Baixe os arquivos</h3>
            <p>
              O script vem num arquivo .sql, que também pode ser baixado
              compactado em ZIP.
            </p>
          </li>
        </ol>
      </section>

      <section className="inicio-secao inicio-detalhes">
        <div>
          <h2>Bancos suportados</h2>
          <ul className="lista-bancos">
            {listaBancos.map((id) => (
              <li key={id} data-banco={id}>
                <span className="ponto-banco" aria-hidden="true" />
                {bancos[id].nome}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2>Como foi feito</h2>
          <p>
            Backend em Java com Spring Boot e frontend em React. O script é
            montado pelo próprio Java, sem IA: cada banco tem um dialeto que
            traduz os tipos e as regras de sintaxe.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Inicio
