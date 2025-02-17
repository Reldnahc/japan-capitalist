import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Game from "./components/Game.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <div className="bg-gray-800 min-h-screen flex items-center justify-center">
          <Game />
      </div>
  </StrictMode>,
)
