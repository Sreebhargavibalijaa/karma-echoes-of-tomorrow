import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'

// Karmic Action Types and their impact values
export const KARMIC_ACTIONS = {
  // Positive Actions
  SAVE_LIFE: { value: 50, category: 'compassion', description: 'Saved a life' },
  HELP_STRANGER: { value: 15, category: 'kindness', description: 'Helped a stranger' },
  DONATE: { value: 10, category: 'generosity', description: 'Donated to charity' },
  PROTECT_INNOCENT: { value: 25, category: 'justice', description: 'Protected the innocent' },
  FORGIVE: { value: 20, category: 'mercy', description: 'Showed forgiveness' },
  HEAL: { value: 30, category: 'healing', description: 'Healed someone' },
  
  // Negative Actions
  KILL_INNOCENT: { value: -100, category: 'violence', description: 'Killed an innocent' },
  STEAL: { value: -20, category: 'greed', description: 'Stole something' },
  LIE: { value: -5, category: 'deception', description: 'Told a lie' },
  BETRAY: { value: -40, category: 'treachery', description: 'Betrayed trust' },
  DESTROY_SACRED: { value: -60, category: 'sacrilege', description: 'Destroyed sacred site' },
  ABANDON: { value: -15, category: 'neglect', description: 'Abandoned someone in need' },
  
  // Neutral/Complex Actions
  SELF_DEFENSE: { value: 0, category: 'survival', description: 'Acted in self-defense' },
  TRADE: { value: 0, category: 'commerce', description: 'Made a trade' },
  EXPLORE: { value: 2, category: 'discovery', description: 'Explored new areas' },
  LEARN: { value: 5, category: 'wisdom', description: 'Gained knowledge' }
}

// Karma Categories and their weights
export const KARMA_CATEGORIES = {
  compassion: { weight: 1.2, color: '#4ade80' },
  kindness: { weight: 1.0, color: '#60a5fa' },
  generosity: { weight: 1.1, color: '#fbbf24' },
  justice: { weight: 1.3, color: '#a78bfa' },
  mercy: { weight: 1.1, color: '#f472b6' },
  healing: { weight: 1.4, color: '#34d399' },
  violence: { weight: 1.5, color: '#ef4444' },
  greed: { weight: 1.2, color: '#f59e0b' },
  deception: { weight: 1.0, color: '#8b5cf6' },
  treachery: { weight: 1.6, color: '#dc2626' },
  sacrilege: { weight: 1.8, color: '#7c2d12' },
  neglect: { weight: 1.1, color: '#6b7280' },
  survival: { weight: 0.8, color: '#059669' },
  commerce: { weight: 0.9, color: '#0891b2' },
  discovery: { weight: 0.7, color: '#7c3aed' },
  wisdom: { weight: 1.0, color: '#10b981' }
}

class KarmicPredictor {
  constructor() {
    this.patterns = new Map()
    this.predictions = []
  }

  // Analyze karmic patterns and generate predictions
  analyzePatterns(karmicHistory) {
    const recentActions = karmicHistory.slice(-20) // Last 20 actions
    const categoryCounts = {}
    const totalKarma = recentActions.reduce((sum, action) => sum + action.karmaValue, 0)
    
    // Count actions by category
    recentActions.forEach(action => {
      const category = action.category
      categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    // Generate predictions based on patterns
    const predictions = []
    
    // Prediction 1: Karma balance prediction
    if (totalKarma > 100) {
      predictions.push({
        id: uuidv4(),
        type: 'positive_consequence',
        probability: 0.8,
        timeframe: '2-5 hours',
        description: 'A benevolent force will aid you in your journey',
        trigger: 'high_positive_karma'
      })
    } else if (totalKarma < -100) {
      predictions.push({
        id: uuidv4(),
        type: 'negative_consequence',
        probability: 0.7,
        timeframe: '1-3 hours',
        description: 'Dark forces gather against you',
        trigger: 'high_negative_karma'
      })
    }

    // Prediction 2: Category-based predictions
    if (categoryCounts.violence > 3) {
      predictions.push({
        id: uuidv4(),
        type: 'negative_consequence',
        probability: 0.6,
        timeframe: '3-6 hours',
        description: 'The spirits of the fallen seek retribution',
        trigger: 'violence_pattern'
      })
    }

    if (categoryCounts.compassion > 5) {
      predictions.push({
        id: uuidv4(),
        type: 'positive_consequence',
        probability: 0.7,
        timeframe: '1-4 hours',
        description: 'A guardian angel watches over you',
        trigger: 'compassion_pattern'
      })
    }

    return predictions
  }

  // Generate cryptic oracle messages
  generateOracleMessage(predictions, currentKarma) {
    const messages = [
      "The threads of fate weave patterns unseen...",
      "Echoes of your choices ripple through time...",
      "The mirror of memory reflects what is to come...",
      "Karmic currents flow toward destiny's shore...",
      "The balance of light and shadow shifts...",
      "Ancient forces respond to your essence...",
      "The cosmic ledger records your journey...",
      "Destiny's hand moves in mysterious ways..."
    ]

    const baseMessage = messages[Math.floor(Math.random() * messages.length)]
    
    if (predictions.length > 0) {
      const strongestPrediction = predictions.reduce((strongest, current) => 
        current.probability > strongest.probability ? current : strongest
      )
      
      return {
        message: baseMessage,
        hint: strongestPrediction.description,
        confidence: strongestPrediction.probability,
        timeframe: strongestPrediction.timeframe
      }
    }

    return {
      message: baseMessage,
      hint: "The future remains shrouded in mystery...",
      confidence: 0.3,
      timeframe: "unknown"
    }
  }
}

const useKarmaStore = create(
  persist(
    (set, get) => ({
      // State
      karmicHistory: [],
      currentKarma: 0,
      karmaLevel: 'neutral', // 'enlightened', 'benevolent', 'neutral', 'shadowed', 'corrupted'
      predictions: [],
      oracleMessages: [],
      reincarnationCount: 0,
      pastLives: [],
      characterId: uuidv4(),
      
      // Actions
      recordKarmicAction: (actionType, context = {}) => {
        const action = KARMIC_ACTIONS[actionType]
        if (!action) return

        const karmaValue = action.value * KARMA_CATEGORIES[action.category].weight
        const timestamp = new Date().toISOString()
        
        const karmicEntry = {
          id: uuidv4(),
          actionType,
          karmaValue,
          category: action.category,
          description: action.description,
          context,
          timestamp,
          characterId: get().characterId
        }

        set(state => {
          const newHistory = [...state.karmicHistory, karmicEntry]
          const newKarma = newHistory.reduce((sum, entry) => sum + entry.karmaValue, 0)
          
          // Update karma level
          let newKarmaLevel = 'neutral'
          if (newKarma >= 200) newKarmaLevel = 'enlightened'
          else if (newKarma >= 100) newKarmaLevel = 'benevolent'
          else if (newKarma <= -200) newKarmaLevel = 'corrupted'
          else if (newKarma <= -100) newKarmaLevel = 'shadowed'

          // Generate new predictions
          const predictor = new KarmicPredictor()
          const newPredictions = predictor.analyzePatterns(newHistory)
          const oracleMessage = predictor.generateOracleMessage(newPredictions, newKarma)

          return {
            karmicHistory: newHistory,
            currentKarma: newKarma,
            karmaLevel: newKarmaLevel,
            predictions: newPredictions,
            oracleMessages: [...state.oracleMessages, oracleMessage]
          }
        })
      },

      // Reincarnation system
      reincarnate: () => {
        const currentState = get()
        
        // Save current life data
        const pastLife = {
          id: uuidv4(),
          characterId: currentState.characterId,
          karmaLevel: currentState.karmaLevel,
          finalKarma: currentState.currentKarma,
          actions: currentState.karmicHistory.length,
          timestamp: new Date().toISOString()
        }

        // Calculate reincarnation benefits/curses
        const reincarnationModifier = currentState.currentKarma / 1000 // Scale karma to reasonable modifier
        
        set(state => ({
          karmicHistory: [],
          currentKarma: 0,
          karmaLevel: 'neutral',
          predictions: [],
          oracleMessages: [],
          reincarnationCount: state.reincarnationCount + 1,
          pastLives: [...state.pastLives, pastLife],
          characterId: uuidv4(),
          reincarnationModifier
        }))
      },

      // Get karma statistics
      getKarmaStats: () => {
        const state = get()
        const history = state.karmicHistory
        
        const stats = {
          totalActions: history.length,
          positiveActions: history.filter(h => h.karmaValue > 0).length,
          negativeActions: history.filter(h => h.karmaValue < 0).length,
          neutralActions: history.filter(h => h.karmaValue === 0).length,
          categoryBreakdown: {},
          recentTrend: 'stable'
        }

        // Category breakdown
        history.forEach(entry => {
          stats.categoryBreakdown[entry.category] = (stats.categoryBreakdown[entry.category] || 0) + 1
        })

        // Recent trend (last 10 actions)
        const recentActions = history.slice(-10)
        if (recentActions.length > 0) {
          const recentKarma = recentActions.reduce((sum, action) => sum + action.karmaValue, 0)
          if (recentKarma > 20) stats.recentTrend = 'improving'
          else if (recentKarma < -20) stats.recentTrend = 'declining'
        }

        return stats
      },

      // Get karma by time period
      getKarmaByPeriod: (days = 7) => {
        const state = get()
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        
        return state.karmicHistory.filter(entry => 
          new Date(entry.timestamp) > cutoffDate
        )
      },

      // Clear karma history (for testing)
      clearKarmaHistory: () => {
        set({
          karmicHistory: [],
          currentKarma: 0,
          karmaLevel: 'neutral',
          predictions: [],
          oracleMessages: []
        })
      }
    }),
    {
      name: 'karma-storage',
      partialize: (state) => ({
        karmicHistory: state.karmicHistory,
        currentKarma: state.currentKarma,
        karmaLevel: state.karmaLevel,
        reincarnationCount: state.reincarnationCount,
        pastLives: state.pastLives,
        characterId: state.characterId
      })
    }
  )
)

export default useKarmaStore 