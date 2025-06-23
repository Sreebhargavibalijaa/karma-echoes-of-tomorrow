import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

const LoadingText = styled(motion.h1)`
  font-size: 2.5rem;
  color: #64ffda;
  margin-bottom: 2rem;
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
  font-family: 'Cinzel', serif;
`

const LoadingSubtext = styled(motion.p)`
  font-size: 1.2rem;
  color: #a0a0a0;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 400px;
`

const LoadingSpinner = styled(motion.div)`
  width: 60px;
  height: 60px;
  border: 3px solid rgba(100, 255, 218, 0.3);
  border-top: 3px solid #64ffda;
  border-radius: 50%;
  margin-bottom: 2rem;
`

const ProgressBar = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
`

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #64ffda, #a78bfa);
  border-radius: 2px;
`

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
  text-align: center;
`

const FloatingParticles = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background: #64ffda;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.8);
`

const LoadingScreen = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2
  }))

  return (
    <LoadingContainer>
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

      <LoadingText
        animate={{ 
          textShadow: [
            "0 0 20px rgba(100, 255, 218, 0.5)",
            "0 0 30px rgba(100, 255, 218, 0.8)",
            "0 0 20px rgba(100, 255, 218, 0.5)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Karma: Echoes of Tomorrow
      </LoadingText>

      <LoadingSubtext
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Loading the mystical realms...
      </LoadingSubtext>

      <LoadingSpinner
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />

      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </ProgressBar>

      <ProgressText>
        Preparing your karmic journey...
      </ProgressText>
    </LoadingContainer>
  )
}

export default LoadingScreen 