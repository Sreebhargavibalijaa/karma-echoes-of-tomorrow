import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import { format } from 'date-fns'
import useKarmaStore, { KARMA_CATEGORIES } from '../stores/karmaStore'

const LedgerContainer = styled.div`
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`

const StatCard = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: #64ffda;
    box-shadow: 0 10px 30px rgba(100, 255, 218, 0.2);
  }
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #64ffda;
`

const StatLabel = styled.div`
  font-size: 1rem;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 1px;
`

const KarmaVisualization = styled.div`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 3rem;
`

const KarmaBar = styled.div`
  width: 100%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  margin: 1rem 0;
`

const KarmaFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #fbbf24, #64ffda, #10b981);
  border-radius: 10px;
  position: relative;
`

const KarmaMarker = styled.div`
  position: absolute;
  top: -5px;
  width: 4px;
  height: 30px;
  background: #ffffff;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
`

const HistoryContainer = styled.div`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 1rem;
  padding: 2rem;
  max-height: 600px;
  overflow-y: auto;
`

const HistoryItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border-left: 4px solid ${props => props.karmaValue > 0 ? '#64ffda' : props.karmaValue < 0 ? '#ef4444' : '#a0a0a0'};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`

const ActionInfo = styled.div`
  flex: 1;
`

const ActionDescription = styled.div`
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 0.25rem;
`

const ActionCategory = styled.div`
  font-size: 0.9rem;
  color: ${props => KARMA_CATEGORIES[props.category]?.color || '#a0a0a0'};
  text-transform: capitalize;
`

const ActionTime = styled.div`
  font-size: 0.8rem;
  color: #666;
`

const KarmaValue = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: ${props => props.value > 0 ? '#64ffda' : props.value < 0 ? '#ef4444' : '#a0a0a0'};
  margin-left: 1rem;
`

const CategoryBreakdown = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`

const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  border-left: 3px solid ${props => KARMA_CATEGORIES[props.category]?.color || '#a0a0a0'};
`

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`

const FilterButton = styled.button`
  background: ${props => props.active ? '#64ffda' : 'transparent'};
  color: ${props => props.active ? '#0f0f23' : '#64ffda'};
  border: 2px solid #64ffda;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: #64ffda;
    color: #0f0f23;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #a0a0a0;
`

const KarmicLedger = () => {
  const navigate = useNavigate()
  const { 
    karmicHistory, 
    currentKarma, 
    karmaLevel, 
    getKarmaStats,
    getKarmaByPeriod 
  } = useKarmaStore()
  
  const [filter, setFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [stats, setStats] = useState({})

  useEffect(() => {
    setStats(getKarmaStats())
  }, [karmicHistory, getKarmaStats])

  const getFilteredHistory = () => {
    let filtered = karmicHistory

    // Time filter
    if (timeFilter !== 'all') {
      const days = timeFilter === 'week' ? 7 : timeFilter === 'month' ? 30 : 90
      filtered = getKarmaByPeriod(days)
    }

    // Category filter
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.category === filter)
    }

    return filtered
  }

  const getKarmaBarPosition = () => {
    // Convert karma to percentage (assuming max karma range of -500 to 500)
    const maxKarma = 500
    const minKarma = -500
    const range = maxKarma - minKarma
    const position = ((currentKarma - minKarma) / range) * 100
    return Math.max(0, Math.min(100, position))
  }

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

  const filteredHistory = getFilteredHistory()

  return (
    <LedgerContainer>
      <Header>
        <Title>Mirror of Memory</Title>
        <BackButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          Return to Menu
        </BackButton>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{currentKarma}</StatValue>
          <StatLabel>Current Karma</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue style={{ color: getKarmaLevelColor(karmaLevel) }}>
            {karmaLevel.charAt(0).toUpperCase() + karmaLevel.slice(1)}
          </StatValue>
          <StatLabel>Karma Level</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>{stats.totalActions || 0}</StatValue>
          <StatLabel>Total Actions</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue style={{ color: stats.recentTrend === 'improving' ? '#64ffda' : stats.recentTrend === 'declining' ? '#ef4444' : '#a0a0a0' }}>
            {stats.recentTrend || 'stable'}
          </StatValue>
          <StatLabel>Recent Trend</StatLabel>
        </StatCard>
      </StatsGrid>

      <KarmaVisualization
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3>Karmic Balance</h3>
        <KarmaBar>
          <KarmaFill
            initial={{ width: 0 }}
            animate={{ width: `${getKarmaBarPosition()}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <KarmaMarker style={{ left: `${getKarmaBarPosition()}%` }} />
        </KarmaBar>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#a0a0a0' }}>
          <span>Corrupted (-500)</span>
          <span>Neutral (0)</span>
          <span>Enlightened (500)</span>
        </div>
      </KarmaVisualization>

      <FilterContainer>
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All Actions
        </FilterButton>
        {Object.keys(KARMA_CATEGORIES).map(category => (
          <FilterButton
            key={category}
            active={filter === category}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </FilterButton>
        ))}
      </FilterContainer>

      <FilterContainer>
        <FilterButton
          active={timeFilter === 'all'}
          onClick={() => setTimeFilter('all')}
        >
          All Time
        </FilterButton>
        <FilterButton
          active={timeFilter === 'week'}
          onClick={() => setTimeFilter('week')}
        >
          Last Week
        </FilterButton>
        <FilterButton
          active={timeFilter === 'month'}
          onClick={() => setTimeFilter('month')}
        >
          Last Month
        </FilterButton>
        <FilterButton
          active={timeFilter === 'quarter'}
          onClick={() => setTimeFilter('quarter')}
        >
          Last Quarter
        </FilterButton>
      </FilterContainer>

      <HistoryContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3>Karmic History</h3>
        
        {filteredHistory.length === 0 ? (
          <EmptyState>
            <h4>No karmic actions recorded yet</h4>
            <p>Begin your journey to see your karmic history here</p>
          </EmptyState>
        ) : (
          <AnimatePresence>
            {filteredHistory.map((item, index) => (
              <HistoryItem
                key={item.id}
                karmaValue={item.karmaValue}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActionInfo>
                  <ActionDescription>{item.description}</ActionDescription>
                  <ActionCategory category={item.category}>
                    {item.category}
                  </ActionCategory>
                  <ActionTime>
                    {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
                  </ActionTime>
                </ActionInfo>
                <KarmaValue value={item.karmaValue}>
                  {item.karmaValue > 0 ? '+' : ''}{item.karmaValue}
                </KarmaValue>
              </HistoryItem>
            ))}
          </AnimatePresence>
        )}
      </HistoryContainer>

      {stats.categoryBreakdown && Object.keys(stats.categoryBreakdown).length > 0 && (
        <CategoryBreakdown
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>Category Breakdown</h3>
          {Object.entries(stats.categoryBreakdown).map(([category, count]) => (
            <CategoryItem key={category} category={category}>
              <span style={{ color: KARMA_CATEGORIES[category]?.color }}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </span>
              <span>{count}</span>
            </CategoryItem>
          ))}
        </CategoryBreakdown>
      )}
    </LedgerContainer>
  )
}

export default KarmicLedger 