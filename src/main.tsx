import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {ParticlesProvider} from "./contexts/ParticlesContext.tsx";
import {AudioManagerProvider} from "./contexts/AudioManagerProvider.tsx";
import GamePreloader from "./components/GamePreloader.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ParticlesProvider>
            <AudioManagerProvider>
                        <GamePreloader/>
            </AudioManagerProvider>
      </ParticlesProvider>
  </StrictMode>,
)
