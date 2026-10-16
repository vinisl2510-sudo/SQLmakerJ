import { Link, NavLink, Outlet } from 'react-router'
import { paginas } from '../config/paginas'
import { useTema } from '../hooks/useTema'
import { IconeLua, IconeSol } from './Icones'
import Mascote from './Mascote'

function Layout() {
  const { tema, alternarTema } = useTema()
  const rotuloTema = tema === 'escuro' ? 'Ativar modo claro' : 'Ativar modo escuro'

  return (
    <div className="app">
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="topo">
        <Link to="/" className="marca">
          <Mascote tamanho={34} />
          SQLmakerJ
        </Link>

        <nav aria-label="Principal">
          <ul>
            <li>
              <NavLink to="/" end>
                Início
              </NavLink>
            </li>
            {paginas.map((pagina) => (
              <li key={pagina.caminho}>
                <NavLink to={pagina.caminho}>{pagina.nome}</NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="botao-tema"
          onClick={alternarTema}
          aria-label={rotuloTema}
          title={rotuloTema}
        >
          {tema === 'escuro' ? <IconeSol /> : <IconeLua />}
        </button>
      </header>

      <main id="conteudo" className="conteudo">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
