import type { ComponentType } from 'react'
import {
  IconeEmail,
  IconeTabela,
} from '../components/Icones'

interface Pagina {
  caminho: string
  nome: string
  descricao: string
  icone: ComponentType<{ tamanho?: number }>
  // Cor do ícone no atalho da página inicial.
  tom: 'sol' | 'rosa'
}

export const paginas: Pagina[] = [
  {
    caminho: '/manual',
    nome: 'Modo manual',
    descricao: 'Monte as tabelas coluna por coluna e gere o script.',
    icone: IconeTabela,
    tom: 'sol',
  },
  {
    caminho: '/contato',
    nome: 'Contato',
    descricao: 'Fale comigo por e-mail, GitHub ou LinkedIn.',
    icone: IconeEmail,
    tom: 'rosa',
  },
]
