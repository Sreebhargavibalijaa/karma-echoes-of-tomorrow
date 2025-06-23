import OpenAI from 'openai'

// Initialize OpenAI (in production, this would use environment variables)
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
})

class OracleService {
  constructor() {
    this.predictionHistory = []
    this.patternDatabase = new Map()
    this.oraclePersonality = {
      name: 'The Ancient Oracle',
      style: 'mystical and cryptic',
      themes: ['fate', 'karma', 'destiny', 'balance', 'echoes', 'threads of time']
    }
  }

  // Generate AI-powered predictions based on karmic patterns
  async generatePrediction(karmicHistory, currentKarma, recentActions) {
    try {
      // Analyze recent patterns
      const patterns = this.analyzeKarmicPatterns(karmicHistory, recentActions)
      
      // Create context for AI
      const context = this.buildPredictionContext(patterns, currentKarma)
      
      // Generate prediction using AI
      const prediction = await this.callOracleAI(context)
      
      // Store prediction
      const predictionEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        prediction,
        patterns,
        karmaContext: currentKarma,
        confidence: this.calculateConfidence(patterns)
      }
      
      this.predictionHistory.push(predictionEntry)
      return predictionEntry
      
    } catch (error) {
      console.error('Oracle prediction failed:', error)
      return this.generateFallbackPrediction(karmicHistory, currentKarma)
    }
  }

  // Analyze karmic patterns for prediction generation
  analyzeKarmicPatterns(karmicHistory, recentActions) {
    const patterns = {
      karmaBalance: 0,
      actionFrequency: {},
      categoryDominance: {},
      temporalPatterns: [],
      volatility: 0,
      trends: []
    }

    // Calculate karma balance
    patterns.karmaBalance = karmicHistory.reduce((sum, action) => sum + action.karmaValue, 0)

    // Analyze action frequency
    recentActions.forEach(action => {
      patterns.actionFrequency[action.category] = (patterns.actionFrequency[action.category] || 0) + 1
    })

    // Find dominant categories
    const categoryCounts = Object.entries(patterns.actionFrequency)
    if (categoryCounts.length > 0) {
      categoryCounts.sort((a, b) => b[1] - a[1])
      patterns.categoryDominance = {
        primary: categoryCounts[0][0],
        secondary: categoryCounts[1] ? categoryCounts[1][0] : null
      }
    }

    // Calculate volatility (standard deviation of karma values)
    const karmaValues = recentActions.map(a => a.karmaValue)
    if (karmaValues.length > 1) {
      const mean = karmaValues.reduce((sum, val) => sum + val, 0) / karmaValues.length
      const variance = karmaValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / karmaValues.length
      patterns.volatility = Math.sqrt(variance)
    }

    // Analyze temporal patterns (time between actions)
    for (let i = 1; i < recentActions.length; i++) {
      const timeDiff = new Date(recentActions[i].timestamp) - new Date(recentActions[i-1].timestamp)
      patterns.temporalPatterns.push(timeDiff)
    }

    return patterns
  }

  // Build context for AI prediction
  buildPredictionContext(patterns, currentKarma) {
    const karmaLevel = this.getKarmaLevel(currentKarma)
    const dominantCategory = patterns.categoryDominance.primary
    
    return {
      karmaLevel,
      dominantCategory,
      karmaBalance: patterns.karmaBalance,
      volatility: patterns.volatility,
      recentActions: patterns.actionFrequency,
      temporalPatterns: patterns.temporalPatterns.length > 0 ? 
        patterns.temporalPatterns.slice(-5) : []
    }
  }

  // Call OpenAI for mystical prediction
  async callOracleAI(context) {
    const prompt = this.buildOraclePrompt(context)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are ${this.oraclePersonality.name}, an ancient mystical entity that sees through the veil of time. You speak in cryptic, poetic language about karma, fate, and destiny. Your predictions are mysterious and open to interpretation, but contain hidden wisdom about the future.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      })

      return {
        message: completion.choices[0].message.content,
        type: 'ai_generated',
        confidence: 0.8
      }
    } catch (error) {
      // Fallback to rule-based prediction
      return this.generateRuleBasedPrediction(context)
    }
  }

  // Build mystical prompt for AI
  buildOraclePrompt(context) {
    const { karmaLevel, dominantCategory, karmaBalance, volatility } = context
    
    return `The seeker's karmic essence reveals:
- Their soul resonates at the ${karmaLevel} level
- Their path is guided by the ${dominantCategory} force
- Their cosmic balance stands at ${karmaBalance}
- Their journey's volatility measures ${volatility.toFixed(2)}

Speak to them of what the threads of fate weave for their future. Be mysterious and poetic, but offer genuine insight about potential consequences of their current path.`
  }

  // Fallback rule-based prediction system
  generateRuleBasedPrediction(context) {
    const { karmaLevel, dominantCategory, karmaBalance } = context
    
    const predictions = {
      enlightened: [
        "The light within you shines so brightly that even the stars pause to witness your journey. A great blessing approaches...",
        "Your compassion has awakened ancient forces of benevolence. They prepare to aid you in ways unseen...",
        "The cosmic scales tip in your favor. A guardian of light watches over your path..."
      ],
      benevolent: [
        "Your kindness echoes through the realms. Good fortune flows toward you like a gentle stream...",
        "The spirits of the land recognize your gentle heart. They will reveal hidden paths to you...",
        "Your positive karma attracts benevolent energies. Expect unexpected help from strangers..."
      ],
      neutral: [
        "The threads of fate remain balanced. Your choices now will determine which path opens before you...",
        "The cosmic winds are still. This is a moment of potential - choose wisely...",
        "Destiny's hand hovers, waiting for your next action to reveal its direction..."
      ],
      shadowed: [
        "Dark clouds gather on your horizon. The consequences of past actions begin to manifest...",
        "The shadows you've cast return to you. Be prepared for challenges ahead...",
        "Karmic debts come due. The universe seeks balance through trials..."
      ],
      corrupted: [
        "The darkness within you calls to forces of chaos. They hunt you now...",
        "Your negative karma has awakened ancient evils. They answer with malevolent intent...",
        "The cosmic balance demands retribution. Prepare for the storm that approaches..."
      ]
    }

    const categoryInsights = {
      compassion: "Your acts of mercy will be remembered by the universe...",
      violence: "The echoes of violence return to haunt the perpetrator...",
      greed: "What you take from others, others will take from you...",
      wisdom: "Knowledge gained through suffering becomes wisdom...",
      healing: "The healer's touch leaves traces of light that never fade..."
    }

    const basePrediction = predictions[karmaLevel][Math.floor(Math.random() * predictions[karmaLevel].length)]
    const categoryPrediction = categoryInsights[dominantCategory] || ""

    return {
      message: `${basePrediction} ${categoryPrediction}`,
      type: 'rule_based',
      confidence: 0.6
    }
  }

  // Generate fallback prediction when AI fails
  generateFallbackPrediction(karmicHistory, currentKarma) {
    const karmaLevel = this.getKarmaLevel(currentKarma)
    const recentActions = karmicHistory.slice(-5)
    
    const context = {
      karmaLevel,
      dominantCategory: recentActions.length > 0 ? recentActions[0].category : 'neutral',
      karmaBalance: currentKarma,
      volatility: 0
    }
    
    return {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      prediction: this.generateRuleBasedPrediction(context),
      patterns: {},
      karmaContext: currentKarma,
      confidence: 0.5
    }
  }

  // Calculate prediction confidence
  calculateConfidence(patterns) {
    let confidence = 0.5 // Base confidence
    
    // Higher confidence for more data
    if (patterns.actionFrequency && Object.keys(patterns.actionFrequency).length > 3) {
      confidence += 0.2
    }
    
    // Higher confidence for clear patterns
    if (patterns.categoryDominance.primary && patterns.categoryDominance.secondary) {
      confidence += 0.1
    }
    
    // Lower confidence for high volatility
    if (patterns.volatility > 50) {
      confidence -= 0.2
    }
    
    return Math.max(0.1, Math.min(0.9, confidence))
  }

  // Get karma level description
  getKarmaLevel(karma) {
    if (karma >= 200) return 'enlightened'
    if (karma >= 100) return 'benevolent'
    if (karma <= -200) return 'corrupted'
    if (karma <= -100) return 'shadowed'
    return 'neutral'
  }

  // Get oracle insights about past predictions
  getPredictionInsights() {
    const insights = {
      accuracy: 0,
      patterns: [],
      recommendations: []
    }

    if (this.predictionHistory.length === 0) {
      return insights
    }

    // Calculate accuracy (simplified - in real implementation would track actual outcomes)
    const recentPredictions = this.predictionHistory.slice(-10)
    insights.accuracy = recentPredictions.reduce((sum, pred) => sum + pred.confidence, 0) / recentPredictions.length

    // Find common patterns
    const categories = recentPredictions.map(p => p.patterns.categoryDominance?.primary).filter(Boolean)
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})

    insights.patterns = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, count]) => ({ category, frequency: count }))

    return insights
  }

  // Generate cryptic advice
  generateAdvice(karmicHistory, currentKarma) {
    const karmaLevel = this.getKarmaLevel(currentKarma)
    const recentActions = karmicHistory.slice(-10)
    
    const advice = {
      general: "",
      specific: "",
      warning: ""
    }

    // General advice based on karma level
    const generalAdvice = {
      enlightened: "Continue walking the path of light. Your example inspires others.",
      benevolent: "Your kindness is your strength. Trust in the goodness you spread.",
      neutral: "The balance is delicate. Each choice matters more than you know.",
      shadowed: "The path to redemption lies in acts of genuine contrition.",
      corrupted: "Even the darkest soul can find light. Begin with a single act of kindness."
    }

    advice.general = generalAdvice[karmaLevel]

    // Specific advice based on recent actions
    if (recentActions.length > 0) {
      const mostRecent = recentActions[recentActions.length - 1]
      if (mostRecent.karmaValue < 0) {
        advice.specific = "Consider how you might balance your recent actions with acts of kindness."
      } else if (mostRecent.karmaValue > 0) {
        advice.specific = "Your recent good deeds create ripples of positive change."
      }
    }

    // Warnings for extreme karma
    if (currentKarma <= -150) {
      advice.warning = "The shadows grow darker. Choose your next actions with great care."
    } else if (currentKarma >= 150) {
      advice.warning = "Great power brings great responsibility. Use your influence wisely."
    }

    return advice
  }
}

export default new OracleService() 