import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styled from 'styled-components'
import useKarmaStore from '../stores/karmaStore'

const CreationContainer = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`

const Title = styled.h1`
  font-size: 3rem;
  background: linear-gradient(135deg, #64ffda, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
`

const BackButton = styled(motion.button)`
  background: transparent;
  border: 2px solid #64ffda;
  color: #64ffda;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #64ffda;
    color: #0f0f23;
  }
`

const CreationForm = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 2rem;
  padding: 3rem;
`

const FormSection = styled.div`
  margin-bottom: 3rem;
`

const SectionTitle = styled.h2`
  color: #64ffda;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
`

const InputGroup = styled.div`
  margin-bottom: 2rem;
`

const Label = styled.label`
  display: block;
  color: #ffffff;
  margin-bottom: 0.5rem;
  font-weight: 500;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #64ffda;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  }

  &::placeholder {
    color: #a0a0a0;
  }
`

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #64ffda;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  }

  option {
    background: #1a1a2e;
    color: #ffffff;
  }
`

const AttributeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`

const AttributeCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    border-color: #64ffda;
    transform: translateY(-2px);
  }
`

const AttributeName = styled.div`
  color: #64ffda;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const AttributeValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
`

const AttributeDescription = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
  line-height: 1.4;
`

const KarmaInfluence = styled.div`
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const KarmaTitle = styled.h3`
  color: #a78bfa;
  margin-bottom: 1rem;
`

const KarmaText = styled.p`
  color: #ffffff;
  line-height: 1.6;
`

const CreateButton = styled(motion.button)`
  background: linear-gradient(135deg, #64ffda, #4ade80);
  color: #0f0f23;
  border: none;
  padding: 1.5rem 3rem;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(100, 255, 218, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const CharacterCreation = () => {
  const navigate = useNavigate()
  const { reincarnationCount, pastLives } = useKarmaStore()
  
  const [character, setCharacter] = useState({
    name: '',
    origin: 'wanderer',
    background: 'mystic',
    startingKarma: 0
  })

  const origins = [
    { value: 'wanderer', label: 'Wanderer', description: 'A free spirit seeking purpose' },
    { value: 'scholar', label: 'Scholar', description: 'A seeker of ancient knowledge' },
    { value: 'warrior', label: 'Warrior', description: 'A protector of the innocent' },
    { value: 'merchant', label: 'Merchant', description: 'A trader of goods and stories' },
    { value: 'hermit', label: 'Hermit', description: 'A solitary soul with hidden wisdom' }
  ]

  const backgrounds = [
    { value: 'mystic', label: 'Mystic', description: 'Connected to the spiritual realm' },
    { value: 'noble', label: 'Noble', description: 'Born to privilege and responsibility' },
    { value: 'commoner', label: 'Commoner', description: 'Raised among the people' },
    { value: 'outcast', label: 'Outcast', description: 'Shunned by society' },
    { value: 'chosen', label: 'Chosen', description: 'Destined for greatness' }
  ]

  const calculateAttributes = () => {
    const baseAttributes = {
      wisdom: 10,
      compassion: 10,
      courage: 10,
      insight: 10
    }

    // Origin bonuses
    const originBonuses = {
      wanderer: { wisdom: 2, insight: 2 },
      scholar: { wisdom: 3, insight: 3 },
      warrior: { courage: 3, compassion: 1 },
      merchant: { insight: 2, wisdom: 1 },
      hermit: { wisdom: 3, insight: 1 }
    }

    // Background bonuses
    const backgroundBonuses = {
      mystic: { wisdom: 2, insight: 2 },
      noble: { compassion: 2, courage: 1 },
      commoner: { compassion: 2, wisdom: 1 },
      outcast: { courage: 2, insight: 1 },
      chosen: { wisdom: 1, compassion: 1, courage: 1, insight: 1 }
    }

    // Apply bonuses
    const originBonus = originBonuses[character.origin] || {}
    const backgroundBonus = backgroundBonuses[character.background] || {}

    Object.keys(baseAttributes).forEach(attr => {
      baseAttributes[attr] += (originBonus[attr] || 0) + (backgroundBonus[attr] || 0)
    })

    // Reincarnation bonus (if applicable)
    if (reincarnationCount > 0) {
      const reincarnationBonus = Math.min(reincarnationCount * 2, 10)
      baseAttributes.wisdom += reincarnationBonus
    }

    return baseAttributes
  }

  const getKarmaInfluence = () => {
    if (reincarnationCount === 0) {
      return {
        title: "Fresh Soul",
        description: "You begin your journey with a clean slate. Your choices will shape your destiny from this moment forward."
      }
    }

    const lastLife = pastLives[pastLives.length - 1]
    const karmaLevel = lastLife.karmaLevel
    const karmaValue = lastLife.finalKarma

    if (karmaValue > 100) {
      return {
        title: "Blessed Reincarnation",
        description: "Your previous life's good deeds have earned you divine favor. You begin with enhanced wisdom and a gentle aura that attracts benevolent forces."
      }
    } else if (karmaValue < -100) {
      return {
        title: "Karmic Redemption",
        description: "Your past transgressions have left their mark, but redemption is always possible. You carry the weight of past mistakes, but also the wisdom to avoid them."
      }
    } else {
      return {
        title: "Balanced Return",
        description: "Your previous life was one of balance. You return with the wisdom of experience and the opportunity to forge a new path."
      }
    }
  }

  const handleInputChange = (field, value) => {
    setCharacter(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateCharacter = () => {
    if (!character.name.trim()) {
      alert('Please enter a character name')
      return
    }

    // Record initial karmic action
    const { recordKarmicAction } = useKarmaStore.getState()
    recordKarmicAction('LEARN', { 
      context: 'character_creation',
      characterName: character.name,
      origin: character.origin,
      background: character.background
    })

    navigate('/game')
  }

  const attributes = calculateAttributes()
  const karmaInfluence = getKarmaInfluence()

  return (
    <CreationContainer>
      <Header>
        <Title>Forge Your Destiny</Title>
        <BackButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Return to Menu
        </BackButton>
      </Header>

      <CreationForm
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <FormSection>
          <SectionTitle>Character Identity</SectionTitle>
          
          <InputGroup>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Enter your character's name..."
              value={character.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              maxLength={20}
            />
          </InputGroup>

          <InputGroup>
            <Label>Origin</Label>
            <Select
              value={character.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
            >
              {origins.map(origin => (
                <option key={origin.value} value={origin.value}>
                  {origin.label} - {origin.description}
                </option>
              ))}
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Background</Label>
            <Select
              value={character.background}
              onChange={(e) => handleInputChange('background', e.target.value)}
            >
              {backgrounds.map(background => (
                <option key={background.value} value={background.value}>
                  {background.label} - {background.description}
                </option>
              ))}
            </Select>
          </InputGroup>
        </FormSection>

        <FormSection>
          <SectionTitle>Karmic Influence</SectionTitle>
          <KarmaInfluence>
            <KarmaTitle>{karmaInfluence.title}</KarmaTitle>
            <KarmaText>{karmaInfluence.description}</KarmaText>
            {reincarnationCount > 0 && (
              <KarmaText>
                This is your {reincarnationCount + 1} life. Your previous experiences have shaped your current incarnation.
              </KarmaText>
            )}
          </KarmaInfluence>
        </FormSection>

        <FormSection>
          <SectionTitle>Character Attributes</SectionTitle>
          <AttributeGrid>
            <AttributeCard>
              <AttributeName>Wisdom</AttributeName>
              <AttributeValue>{attributes.wisdom}</AttributeValue>
              <AttributeDescription>
                Your understanding of the world and ability to make wise decisions
              </AttributeDescription>
            </AttributeCard>

            <AttributeCard>
              <AttributeName>Compassion</AttributeName>
              <AttributeValue>{attributes.compassion}</AttributeValue>
              <AttributeDescription>
                Your capacity for empathy and willingness to help others
              </AttributeDescription>
            </AttributeCard>

            <AttributeCard>
              <AttributeName>Courage</AttributeName>
              <AttributeValue>{attributes.courage}</AttributeValue>
              <AttributeDescription>
                Your bravery in facing challenges and standing for what's right
              </AttributeDescription>
            </AttributeCard>

            <AttributeCard>
              <AttributeName>Insight</AttributeName>
              <AttributeValue>{attributes.insight}</AttributeValue>
              <AttributeDescription>
                Your ability to perceive hidden truths and understand complex situations
              </AttributeDescription>
            </AttributeCard>
          </AttributeGrid>
        </FormSection>

        <CreateButton
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateCharacter}
          disabled={!character.name.trim()}
        >
          Begin Your Journey
        </CreateButton>
      </CreationForm>
    </CreationContainer>
  )
}

export default CharacterCreation 