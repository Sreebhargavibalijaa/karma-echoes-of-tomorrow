import { renderHook, act } from '@testing-library/react'
import useKarmaStore from '../../stores/karmaStore'

describe('Karma Store', () => {
  beforeEach(() => {
    // Clear karma history before each test
    const { result } = renderHook(() => useKarmaStore())
    act(() => {
      result.current.clearKarmaHistory()
    })
  })

  test('should initialize with neutral karma', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    expect(result.current.currentKarma).toBe(0)
    expect(result.current.karmaLevel).toBe('neutral')
    expect(result.current.karmicHistory).toHaveLength(0)
  })

  test('should record positive karmic actions', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    act(() => {
      result.current.recordKarmicAction('HELP_STRANGER')
    })
    
    expect(result.current.currentKarma).toBeGreaterThan(0)
    expect(result.current.karmicHistory).toHaveLength(1)
    expect(result.current.karmicHistory[0].actionType).toBe('HELP_STRANGER')
  })

  test('should record negative karmic actions', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    act(() => {
      result.current.recordKarmicAction('STEAL')
    })
    
    expect(result.current.currentKarma).toBeLessThan(0)
    expect(result.current.karmicHistory).toHaveLength(1)
    expect(result.current.karmicHistory[0].actionType).toBe('STEAL')
  })

  test('should update karma level based on total karma', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    // Add enough positive karma to reach benevolent level
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.recordKarmicAction('HELP_STRANGER')
      }
    })
    
    expect(result.current.karmaLevel).toBe('benevolent')
  })

  test('should provide karma statistics', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    act(() => {
      result.current.recordKarmicAction('HELP_STRANGER') // positive
      result.current.recordKarmicAction('STEAL') // negative
      result.current.recordKarmicAction('EXPLORE') // neutral
    })
    
    const stats = result.current.getKarmaStats()
    
    expect(stats.totalActions).toBe(3)
    expect(stats.positiveActions).toBe(1)
    expect(stats.negativeActions).toBe(1)
    expect(stats.neutralActions).toBe(1)
  })

  test('should handle reincarnation', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    act(() => {
      result.current.recordKarmicAction('HELP_STRANGER')
      result.current.reincarnate()
    })
    
    expect(result.current.currentKarma).toBe(0)
    expect(result.current.karmaLevel).toBe('neutral')
    expect(result.current.karmicHistory).toHaveLength(0)
    expect(result.current.reincarnationCount).toBe(1)
    expect(result.current.pastLives).toHaveLength(1)
  })

  test('should filter karma by time period', () => {
    const { result } = renderHook(() => useKarmaStore())
    
    act(() => {
      result.current.recordKarmicAction('HELP_STRANGER')
    })
    
    const recentKarma = result.current.getKarmaByPeriod(7) // last 7 days
    expect(recentKarma.length).toBeGreaterThan(0)
  })
}) 