import { useEffect, useState } from 'react'

type Tema = 'claro' | 'escuro'

// Mesma chave lida pelo script do index.html, que aplica o tema antes da pintura.
const CHAVE_TEMA = 'sqlmaker-tema'
const CONSULTA_ESCURO = '(prefers-color-scheme: dark)'

function lerTemaSalvo(): Tema | null {
  try {
    const valor = localStorage.getItem(CHAVE_TEMA)
    return valor === 'claro' || valor === 'escuro' ? valor : null
  } catch {
    return null
  }
}

function temaDoSistema(): Tema {
  return window.matchMedia(CONSULTA_ESCURO).matches ? 'escuro' : 'claro'
}

// Sem escolha salva, o tema acompanha o sistema operacional.
export function useTema() {
  const [salvo, setSalvo] = useState<Tema | null>(lerTemaSalvo)
  const [sistema, setSistema] = useState<Tema>(temaDoSistema)

  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_ESCURO)

    function atualizar() {
      setSistema(consulta.matches ? 'escuro' : 'claro')
    }

    consulta.addEventListener('change', atualizar)
    return () => {
      consulta.removeEventListener('change', atualizar)
    }
  }, [])

  const tema = salvo ?? sistema

  function alternarTema() {
    const novo: Tema = tema === 'escuro' ? 'claro' : 'escuro'

    setSalvo(novo)
    document.documentElement.dataset.tema = novo

    try {
      localStorage.setItem(CHAVE_TEMA, novo)
    } catch {
      // Sem armazenamento disponível, a escolha vale só nesta visita.
    }
  }

  return { tema, alternarTema }
}
