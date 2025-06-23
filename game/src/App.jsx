import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import styled from 'styled-components'

// Lazy load components for better performance
const MainMenu = React.lazy(() => import('./components/MainMenu'))
const GameWorld = React.lazy(() => import('./components/GameWorld'))
const KarmicLedger = React.lazy(() => import('./components/KarmicLedger'))
const OracleInterface = React.lazy(() => import('./components/OracleInterface'))
const CharacterCreation = React.lazy(() => import('./components/CharacterCreation'))
const LoadingScreen = React.lazy(() => import('./components/LoadingScreen'))

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

const BackgroundCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`

function App() {
  return (
    <AppContainer>
      <BackgroundCanvas>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </BackgroundCanvas>
      
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/character-creation" element={<CharacterCreation />} />
          <Route path="/game" element={<GameWorld />} />
          <Route path="/karmic-ledger" element={<KarmicLedger />} />
          <Route path="/oracle" element={<OracleInterface />} />
        </Routes>
      </Suspense>
    </AppContainer>
  )
}

export default App 