import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Box, Sphere } from '@react-three/drei'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import useKarmaStore, { KARMIC_ACTIONS } from '../stores/karmaStore'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`

const UIOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`

const TopBar = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: auto;
`

const KarmaDisplay = styled.div`
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  color: #ffffff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const KarmaValue = styled.div`
  color: ${props => props.value > 0 ? '#64ffda' : props.value < 0 ? '#ef4444' : '#a0a0a0'};
  font-size: 1.2rem;
`

const KarmaLevel = styled.div`
  color: #a0a0a0;
  font-size: 0.9rem;
  text-transform: capitalize;
`

const MenuButton = styled(motion.button)`
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.3);
  color: #64ffda;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  pointer-events: auto;

  &:hover {
    background: rgba(100, 255, 218, 0.1);
    border-color: #64ffda;
  }
`

const ActionPanel = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
  pointer-events: auto;
`

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, rgba(100, 255, 218, 0.1), rgba(167, 139, 250, 0.1));
  border: 2px solid #64ffda;
  color: #64ffda;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 120px;

  &:hover {
    background: linear-gradient(135deg, rgba(100, 255, 218, 0.2), rgba(167, 139, 250, 0.2));
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.3);
  }

  &.positive {
    border-color: #64ffda;
    color: #64ffda;
  }

  &.negative {
    border-color: #ef4444;
    color: #ef4444;
  }

  &.neutral {
    border-color: #a0a0a0;
    color: #a0a0a0;
  }
`

const NotificationPanel = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(100, 255, 218, 0.5);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  pointer-events: auto;
`

const NotificationTitle = styled.h3`
  color: #64ffda;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`

const NotificationText = styled.p`
  color: #ffffff;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

const NotificationButton = styled.button`
  background: linear-gradient(135deg, #64ffda, #4ade80);
  color: #0f0f23;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 255, 218, 0.4);
  }
`

// 3D Scene Components
const Ground = () => (
  <Box args={[50, 1, 50]} position={[0, -0.5, 0]}>
    <meshStandardMaterial color="#1a1a2e" />
  </Box>
)

const KarmicCrystal = ({ position, color, onClick, karmaValue }) => (
  <group position={position}>
    <Sphere args={[0.5, 16, 16]} onClick={onClick}>
      <meshStandardMaterial color={color} transparent opacity={0.8} />
    </Sphere>
    <Text
      position={[0, 1, 0]}
      fontSize={0.3}
      color={color}
      anchorX="center"
      anchorY="middle"
    >
      {karmaValue > 0 ? '+' : ''}{karmaValue}
    </Text>
  </group>
)

const SacredTree = ({ position, onClick }) => (
  <group position={position}>
    <Box args={[0.3, 3, 0.3]} position={[0, 1.5, 0]}>
      <meshStandardMaterial color="#8B4513" />
    </Box>
    <Sphere args={[1.5, 16, 16]} position={[0, 3, 0]}>
      <meshStandardMaterial color="#228B22" />
    </Sphere>
    <Text
      position={[0, 5, 0]}
      fontSize={0.4}
      color="#64ffda"
      anchorX="center"
      anchorY="middle"
      onClick={onClick}
    >
      Sacred Tree
    </Text>
  </group>
)

const GameWorld = () => {
  const navigate = useNavigate()
  const { 
    currentKarma, 
    karmaLevel, 
    recordKarmicAction, 
    reincarnate,
    reincarnationCount 
  } = useKarmaStore()
  
  const [showNotification, setShowNotification] = useState(false)
  const [notificationData, setNotificationData] = useState({})
  const [selectedAction, setSelectedAction] = useState(null)

  const handleKarmicAction = (actionType, context = {}) => {
    recordKarmicAction(actionType, context)
    
    const action = KARMIC_ACTIONS[actionType]
    const karmaChange = action.value * (action.value > 0 ? 1 : -1)
    
    toast.success(
      `${action.description} (${karmaChange > 0 ? '+' : ''}${karmaChange} karma)`,
      {
        icon: karmaChange > 0 ? '✨' : karmaChange < 0 ? '💀' : '⚖️',
        style: {
          background: karmaChange > 0 ? '#10b981' : karmaChange < 0 ? '#ef4444' : '#6b7280',
          color: '#ffffff'
        }
      }
    )
  }

  const handleReincarnation = () => {
    setNotificationData({
      title: 'Reincarnation',
      text: 'You have chosen to reincarnate. Your karmic journey continues in a new form...',
      action: () => {
        reincarnate()
        setShowNotification(false)
        toast.success('You have been reincarnated!', {
          icon: '🔄',
          style: { background: '#a78bfa', color: '#ffffff' }
        })
      }
    })
    setShowNotification(true)
  }

  const handleCrystalClick = (karmaValue, actionType) => {
    handleKarmicAction(actionType, { source: 'crystal', karmaValue })
  }

  const handleTreeClick = () => {
    handleKarmicAction('HEAL', { source: 'sacred_tree' })
  }

  const getKarmaColor = (level) => {
    switch (level) {
      case 'enlightened': return '#10b981'
      case 'benevolent': return '#64ffda'
      case 'neutral': return '#a0a0a0'
      case 'shadowed': return '#ef4444'
      case 'corrupted': return '#dc2626'
      default: return '#a0a0a0'
    }
  }

  const positiveActions = [
    { type: 'HELP_STRANGER', label: 'Help Stranger', karma: 15 },
    { type: 'DONATE', label: 'Donate', karma: 10 },
    { type: 'PROTECT_INNOCENT', label: 'Protect Innocent', karma: 25 },
    { type: 'FORGIVE', label: 'Show Forgiveness', karma: 20 },
    { type: 'HEAL', label: 'Heal Someone', karma: 30 }
  ]

  const negativeActions = [
    { type: 'STEAL', label: 'Steal', karma: -20 },
    { type: 'LIE', label: 'Tell a Lie', karma: -5 },
    { type: 'ABANDON', label: 'Abandon', karma: -15 },
    { type: 'BETRAY', label: 'Betray Trust', karma: -40 }
  ]

  const neutralActions = [
    { type: 'EXPLORE', label: 'Explore', karma: 2 },
    { type: 'LEARN', label: 'Gain Knowledge', karma: 5 },
    { type: 'TRADE', label: 'Make Trade', karma: 0 }
  ]

  return (
    <GameContainer>
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        <Ground />
        
        {/* Karmic Crystals */}
        <KarmicCrystal 
          position={[-3, 0, -3]} 
          color="#64ffda" 
          karmaValue={15}
          onClick={() => handleCrystalClick(15, 'HELP_STRANGER')}
        />
        <KarmicCrystal 
          position={[3, 0, -3]} 
          color="#ef4444" 
          karmaValue={-20}
          onClick={() => handleCrystalClick(-20, 'STEAL')}
        />
        <KarmicCrystal 
          position={[0, 0, 3]} 
          color="#a78bfa" 
          karmaValue={5}
          onClick={() => handleCrystalClick(5, 'LEARN')}
        />
        
        {/* Sacred Tree */}
        <SacredTree position={[0, 0, 0]} onClick={handleTreeClick} />
        
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>

      <UIOverlay>
        <TopBar>
          <KarmaDisplay>
            <KarmaValue value={currentKarma}>
              Karma: {currentKarma}
            </KarmaValue>
            <KarmaLevel style={{ color: getKarmaColor(karmaLevel) }}>
              {karmaLevel}
            </KarmaLevel>
          </KarmaDisplay>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <MenuButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/karmic-ledger')}
            >
              Karmic Ledger
            </MenuButton>
            <MenuButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/oracle')}
            >
              Oracle
            </MenuButton>
            <MenuButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
            >
              Menu
            </MenuButton>
          </div>
        </TopBar>

        <ActionPanel
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '1rem', color: '#64ffda', fontWeight: '600' }}>
            Choose Your Actions
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {positiveActions.map((action) => (
              <ActionButton
                key={action.type}
                className="positive"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKarmicAction(action.type)}
              >
                {action.label}
              </ActionButton>
            ))}
            
            {negativeActions.map((action) => (
              <ActionButton
                key={action.type}
                className="negative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKarmicAction(action.type)}
              >
                {action.label}
              </ActionButton>
            ))}
            
            {neutralActions.map((action) => (
              <ActionButton
                key={action.type}
                className="neutral"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKarmicAction(action.type)}
              >
                {action.label}
              </ActionButton>
            ))}
          </div>

          {reincarnationCount > 0 && (
            <ActionButton
              style={{ 
                background: 'linear-gradient(135deg, #a78bfa, #60a5fa)',
                color: '#ffffff',
                border: 'none',
                marginTop: '1rem'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReincarnation}
            >
              Reincarnate
            </ActionButton>
          )}
        </ActionPanel>

        {showNotification && (
          <NotificationPanel
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <NotificationTitle>{notificationData.title}</NotificationTitle>
            <NotificationText>{notificationData.text}</NotificationText>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <NotificationButton onClick={notificationData.action}>
                Continue
              </NotificationButton>
              <NotificationButton 
                onClick={() => setShowNotification(false)}
                style={{ 
                  background: 'transparent',
                  color: '#64ffda',
                  border: '1px solid #64ffda'
                }}
              >
                Cancel
              </NotificationButton>
            </div>
          </NotificationPanel>
        )}
      </UIOverlay>
    </GameContainer>
  )
}

export default GameWorld 