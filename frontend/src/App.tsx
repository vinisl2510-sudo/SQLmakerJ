import { Route, Routes } from 'react-router'
import Layout from './components/Layout'
import Contato from './pages/Contato'
import Inicio from './pages/Inicio'
import ModoManual from './pages/ModoManual'
import NaoEncontrada from './pages/NaoEncontrada'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="manual" element={<ModoManual />} />
        <Route path="contato" element={<Contato />} />
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default App
