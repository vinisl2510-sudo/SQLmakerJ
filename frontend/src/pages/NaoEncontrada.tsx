import { Link } from 'react-router'
import Mascote from '../components/Mascote'

function NaoEncontrada() {
  return (
    <div className="pagina pagina-centro">
      <title>Página não encontrada – SQLmakerJ</title>

      <Mascote tamanho={120} />
      <h1 className="pagina-titulo">Página não encontrada</h1>
      <p className="pagina-resumo">Esse endereço não existe no SQLmakerJ.</p>

      <Link to="/" className="botao pagina-acao">
        Voltar para o início
      </Link>
    </div>
  )
}

export default NaoEncontrada
