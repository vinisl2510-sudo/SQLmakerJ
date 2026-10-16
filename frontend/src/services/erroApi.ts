import type { ProblemaApi } from '../types/sqlmaker'

// Erro devolvido pelo backend, com cada problema numa linha quando ele manda uma lista.
export class ErroApi extends Error {
  readonly problemas: string[]

  constructor(problemas: string[]) {
    super(problemas.join(' '))
    this.name = 'ErroApi'
    this.problemas = problemas
  }
}

export async function lerErro(
  resposta: Response,
  padrao: string,
): Promise<ErroApi> {
  const problema: ProblemaApi | null = await resposta.json().catch(() => null)

  if (problema?.erros?.length) {
    return new ErroApi(problema.erros)
  }

  const errosCampos = problema?.campos ? Object.values(problema.campos) : []

  if (errosCampos.length > 0) {
    return new ErroApi(errosCampos)
  }

  return new ErroApi([
    problema?.detail || `${padrao} HTTP ${resposta.status}.`,
  ])
}
