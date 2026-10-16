import type { ArquivoSql } from '../types/sqlmaker'
import { lerErro } from './erroApi'

async function baixarArquivo(
  endpoint: string,
  dados: unknown,
  nome: string,
): Promise<void> {
  const resposta = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dados),
  })

  if (!resposta.ok) {
    throw await lerErro(resposta, 'Não foi possível baixar o arquivo.')
  }

  const arquivo = await resposta.blob()
  const url = URL.createObjectURL(arquivo)
  const link = document.createElement('a')

  link.href = url
  link.download = nome

  document.body.appendChild(link)

  try {
    link.click()
  } finally {
    link.remove()

    window.setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 30_000)
  }
}

export async function baixarSql(arquivo: ArquivoSql): Promise<void> {
  await baixarArquivo(
    '/api/arquivos/sql',
    arquivo,
    arquivo.nome,
  )
}

export async function baixarZip(
  arquivos: ArquivoSql[],
  nome = 'SQLmakerJ.zip',
): Promise<void> {
  await baixarArquivo(
    '/api/arquivos/zip',
    { arquivos },
    nome,
  )
}