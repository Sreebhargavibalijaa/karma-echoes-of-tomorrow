import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import useKarmaStore from '../stores/karmaStore'

const MenuContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`

const BackgroundOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(100, 255, 218, 0.1) 0%, transparent 70%);
  pointer-events: none;
`

const TitleContainer = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
`

const GameTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #64ffda, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(100, 255, 218, 0.5);
`

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  color: #a0a0a0;
  font-family: 'Cinzel', serif;
  font-style: italic;
  margin-bottom: 2rem;
`

const Tagline = styled(motion.p)`
  font-size: 1.2rem;
  color: #64ffda;
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
`

const MenuButtons = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  z-index: 2;
`

const MenuButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.1), rgba(167, 139, 250, 0.1));
  border: 2px solid #64ffda;
  color: #64ffda;
  padding: 1rem 3rem;
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 250px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 1px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(100, 255, 218, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(100, 255, 218, 0.2), rgba(167, 139, 250, 0.2));
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(100, 255, 218, 0.3);
  }
`

const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #64ffda;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.8);
`

const KarmaStatus = styled(motion.div)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  z-index: 3;
`

const KarmaLevel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #64ffda;
`

const KarmaValue = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
`

const VersionInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  color: #666;
  font-size: 0.8rem;
  z-index: 3;
`

const MainMenu = () => {
  const navigate = useNavigate()
  const { currentKarma, karmaLevel, reincarnationCount } = useKarmaStore()
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }))
    setParticles(newParticles)
  }, [])

  const getKarmaLevelColor = (level) => {
    switch (level) {
      case 'enlightened': return '#10b981'
      case 'benevolent': return '#64ffda'
      case 'neutral': return '#a0a0a0'
      case 'shadowed': return '#ef4444'
      case 'corrupted': return '#dc2626'
      default: return '#a0a0a0'
    }
  }

  const handleNewGame = () => {
    navigate('/character-creation')
  }

  const handleContinue = () => {
    navigate('/game')
  }

  const handleKarmicLedger = () => {
    navigate('/karmic-ledger')
  }

  const handleOracle = () => {
    navigate('/oracle')
  }

  return (
    <MenuContainer>
      <BackgroundOverlay />
      
      <FloatingParticles>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </FloatingParticles>

      <TitleContainer
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <GameTitle
          animate={{ 
            textShadow: [
              "0 0 30px rgba(100, 255, 218, 0.5)",
              "0 0 50px rgba(100, 255, 218, 0.8)",
              "0 0 30px rgba(100, 255, 218, 0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Karma: Echoes of Tomorrow
        </GameTitle>
        <Subtitle
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          An Open-World Narrative RPG
        </Subtitle>
        <Tagline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Your Past Writes the Future
        </Tagline>
      </TitleContainer>

      <MenuButtons
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <MenuButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewGame}
        >
          Begin New Journey
        </MenuButton>
        
        {currentKarma !== 0 && (
          <MenuButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
          >
            Continue Your Path
          </MenuButton>
        )}
        
        <MenuButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleKarmicLedger}
        >
          Mirror of Memory
        </MenuButton>
        
        <MenuButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOracle}
        >
          Consult the Oracle
        </MenuButton>
      </MenuButtons>

      {currentKarma !== 0 && (
        <KarmaStatus
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <KarmaLevel style={{ color: getKarmaLevelColor(karmaLevel) }}>
            {karmaLevel.charAt(0).toUpperCase() + karmaLevel.slice(1)}
          </KarmaLevel>
          <KarmaValue>
            Karma: {currentKarma}
          </KarmaValue>
          {reincarnationCount > 0 && (
            <KarmaValue>
              Lives: {reincarnationCount + 1}
            </KarmaValue>
          )}
        </KarmaStatus>
      )}

      <VersionInfo>
        v1.0.0 - The Karmic Awakening
      </VersionInfo>
    </MenuContainer>
  )
}

export default MainMenu 