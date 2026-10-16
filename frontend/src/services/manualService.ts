import type {
  GeracaoManualRequest,
  GeracaoManualResponse,
} from '../types/sqlmaker'
import { lerErro } from './erroApi'

export async function gerarSqlManual(
  requisicao: GeracaoManualRequest,
): Promise<GeracaoManualResponse> {
  const resposta = await fetch('/api/manual/gerar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(requisicao),
  })

  if (!resposta.ok) {
    throw await lerErro(resposta, 'Não foi possível gerar o SQL.')
  }

  const dados: GeracaoManualResponse = await resposta.json()
  return dados
}
