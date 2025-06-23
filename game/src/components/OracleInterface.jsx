import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import useKarmaStore from '../stores/karmaStore'
import oracleService from '../services/oracleService'

const OracleContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
`

const MysticalBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(167, 139, 250, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(100, 255, 218, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(96, 165, 250, 0.05) 0%, transparent 50%);
  pointer-events: none;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 2;
`

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-shadow: 0 0 30px rgba(167, 139, 250, 0.5);
`

const BackButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #a78bfa;
  color: #a78bfa;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #a78bfa;
    color: #0f0f23;
  }
`

const OracleChamber = styled(motion.div)`
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(167, 139, 250, 0.3);
  border-radius: 2rem;
  padding: 3rem;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(167, 139, 250, 0.1), transparent);
    border-radius: 2rem;
    pointer-events: none;
  }
`

const OracleTitle = styled.h2`
  font-size: 2.5rem;
  color: #a78bfa;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Cinzel', serif;
`

const OracleMessage = styled(motion.div)`
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
`

const MessageText = styled.div`
  font-size: 1.3rem;
  color: #ffffff;
  font-family: 'Cinzel', serif;
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 1rem;
`

const MessageHint = styled.div`
  font-size: 1rem;
  color: #a78bfa;
  font-weight: 500;
  margin-bottom: 1rem;
`

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`

const ConfidenceFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #fbbf24, #64ffda);
  border-radius: 4px;
`

const ConfidenceText = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
  text-align: center;
`

const Timeframe = styled.div`
  font-size: 0.9rem;
  color: #a78bfa;
  text-align: center;
  font-weight: 500;
`

const ConsultButton = styled(motion.button)`
  background: linear-gradient(135deg, #a78bfa, #60a5fa);
  color: #ffffff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  display: block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(167, 139, 250, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const PredictionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`

const PredictionCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #64ffda;
    box-shadow: 0 10px 30px rgba(100, 255, 218, 0.2);
  }
`

const PredictionType = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.type === 'positive_consequence' ? '#64ffda' : props.type === 'negative_consequence' ? '#ef4444' : '#a0a0a0'};
`

const PredictionDescription = styled.div`
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.5;
`

const PredictionMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #a0a0a0;
`

const AdviceContainer = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 1rem;
  padding: 2rem;
`

const AdviceTitle = styled.h3`
  color: #fbbf24;
  margin-bottom: 1.5rem;
  text-align: center;
`

const AdviceSection = styled.div`
  margin-bottom: 1.5rem;
`

const AdviceLabel = styled.div`
  font-weight: 600;
  color: #fbbf24;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.9rem;
`

const AdviceText = styled.div`
  color: #ffffff;
  line-height: 1.6;
  font-style: italic;
`

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(167, 139, 250, 0.3);
  border-radius: 50%;
  border-top-color: #a78bfa;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto;
`

const FloatingCrystals = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`

const Crystal = styled(motion.div)`
  position: absolute;
  width: 8px;
  height: 8px;
  background: #a78bfa;
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(167, 139, 250, 0.8);
`

const OracleInterface = () => {
  const navigate = useNavigate()
  const { 
    karmicHistory, 
    currentKarma, 
    predictions, 
    oracleMessages 
  } = useKarmaStore()
  
  const [isConsulting, setIsConsulting] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState(null)
  const [advice, setAdvice] = useState(null)
  const [crystals, setCrystals] = useState([])

  useEffect(() => {
    // Generate floating crystals
    const newCrystals = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3
    }))
    setCrystals(newCrystals)

    // Get advice if we have karma history
    if (karmicHistory.length > 0) {
      const oracleAdvice = oracleService.generateAdvice(karmicHistory, currentKarma)
      setAdvice(oracleAdvice)
    }
  }, [karmicHistory, currentKarma])

  const consultOracle = async () => {
    setIsConsulting(true)
    
    try {
      const recentActions = karmicHistory.slice(-10)
      const prediction = await oracleService.generatePrediction(
        karmicHistory, 
        currentKarma, 
        recentActions
      )
      
      setCurrentPrediction(prediction)
    } catch (error) {
      console.error('Failed to consult oracle:', error)
      // Fallback to existing predictions
      if (predictions.length > 0) {
        setCurrentPrediction({
          prediction: {
            message: oracleMessages[oracleMessages.length - 1]?.message || "The future remains shrouded in mystery...",
            hint: oracleMessages[oracleMessages.length - 1]?.hint || "Choose your path wisely...",
            confidence: 0.5,
            timeframe: "unknown"
          }
        })
      }
    } finally {
      setIsConsulting(false)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return '#64ffda'
    if (confidence >= 0.4) return '#fbbf24'
    return '#ef4444'
  }

  return (
    <OracleContainer>
      <MysticalBackground />
      
      <FloatingCrystals>
        {crystals.map((crystal) => (
          <Crystal
            key={crystal.id}
            style={{
              left: `${crystal.x}%`,
              top: `${crystal.y}%`
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: crystal.duration,
              repeat: Infinity,
              delay: crystal.delay,
              ease: "easeInOut"
            }}
          />
        ))}
      </FloatingCrystals>

      <Header>
        <Title>The Ancient Oracle</Title>
        <BackButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Return to Menu
        </BackButton>
      </Header>

      <OracleChamber
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <OracleTitle>Seeker of Truth</OracleTitle>
        
        {currentPrediction ? (
          <OracleMessage
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <MessageText>"{currentPrediction.prediction.message}"</MessageText>
            <MessageHint>{currentPrediction.prediction.hint}</MessageHint>
            
            <ConfidenceBar>
              <ConfidenceFill
                initial={{ width: 0 }}
                animate={{ width: `${currentPrediction.prediction.confidence * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ backgroundColor: getConfidenceColor(currentPrediction.prediction.confidence) }}
              />
            </ConfidenceBar>
            <ConfidenceText>
              Confidence: {Math.round(currentPrediction.prediction.confidence * 100)}%
            </ConfidenceText>
            
            <Timeframe>
              Timeframe: {currentPrediction.prediction.timeframe}
            </Timeframe>
          </OracleMessage>
        ) : (
          <OracleMessage>
            <MessageText>
              "The threads of fate await your inquiry. What knowledge do you seek?"
            </MessageText>
          </OracleMessage>
        )}

        <ConsultButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={consultOracle}
          disabled={isConsulting}
        >
          {isConsulting ? (
            <>
              <LoadingSpinner />
              Consulting the Oracle...
            </>
          ) : (
            'Seek the Oracle\'s Wisdom'
          )}
        </ConsultButton>
      </OracleChamber>

      {predictions.length > 0 && (
        <PredictionsContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h3 style={{ gridColumn: '1 / -1', color: '#64ffda', textAlign: 'center', marginBottom: '1rem' }}>
            Active Predictions
          </h3>
          {predictions.map((prediction, index) => (
            <PredictionCard
              key={prediction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PredictionType type={prediction.type}>
                {prediction.type === 'positive_consequence' ? 'Blessing' : 
                 prediction.type === 'negative_consequence' ? 'Warning' : 'Foretelling'}
              </PredictionType>
              <PredictionDescription>{prediction.description}</PredictionDescription>
              <PredictionMeta>
                <span>Probability: {Math.round(prediction.probability * 100)}%</span>
                <span>{prediction.timeframe}</span>
              </PredictionMeta>
            </PredictionCard>
          ))}
        </PredictionsContainer>
      )}

      {advice && (
        <AdviceContainer
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <AdviceTitle>Oracle's Counsel</AdviceTitle>
          
          {advice.general && (
            <AdviceSection>
              <AdviceLabel>General Guidance</AdviceLabel>
              <AdviceText>"{advice.general}"</AdviceText>
            </AdviceSection>
          )}
          
          {advice.specific && (
            <AdviceSection>
              <AdviceLabel>Specific Insight</AdviceLabel>
              <AdviceText>"{advice.specific}"</AdviceText>
            </AdviceSection>
          )}
          
          {advice.warning && (
            <AdviceSection>
              <AdviceLabel>Warning</AdviceLabel>
              <AdviceText style={{ color: '#ef4444' }}>"{advice.warning}"</AdviceText>
            </AdviceSection>
          )}
        </AdviceContainer>
      )}
    </OracleContainer>
  )
}

export default OracleInterface 