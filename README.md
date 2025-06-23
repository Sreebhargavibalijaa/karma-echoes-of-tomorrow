# 🔮 Karma: Echoes of Tomorrow

> **An Open-World Narrative RPG where your past writes the future**

*"Your past writes the future"* - Every action you take leaves behind a karmic trace, and an in-game AI Oracle continuously analyzes your karmic history to predict future events before they happen.

## 🌟 Game Overview

**Karma: Echoes of Tomorrow** is a revolutionary open-world narrative RPG that combines philosophy, karma-based mechanics, and AI-powered future prediction. This game stands out by making every player choice meaningful through sophisticated karmic tracking and predictive storytelling.

### 🎮 Core Features

- **🔮 AI-Powered Oracle**: An in-game entity that gives cryptic predictions about your future based on your karmic footprint
- **📊 Karmic Ledger System**: Every choice is logged and visible through the mystical "Mirror of Memory" interface
- **🔄 Dynamic Story Branching**: Quests evolve nonlinearly based on your karma score
- **🔄 Reincarnation Mode**: Start as a new character with hidden benefits/curses from past lives
- **🎨 Stunning 3D Graphics**: Built with Three.js and React Three Fiber
- **⚡ Real-time Karma Tracking**: Sophisticated algorithms analyze your moral choices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd karma-echoes-of-tomorrow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **Three.js** - 3D graphics and immersive environments
- **React Three Fiber** - React renderer for Three.js
- **Framer Motion** - Smooth animations and transitions
- **Styled Components** - CSS-in-JS styling
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching

### Key Technologies
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type safety and better developer experience
- **OpenAI API** - AI-powered oracle predictions
- **UUID** - Unique identifier generation
- **Date-fns** - Date manipulation utilities

## 🧠 Karmic System

### Karma Categories
The game features 16 distinct karma categories, each with unique weights and visual representations:

- **Positive**: Compassion, Kindness, Generosity, Justice, Mercy, Healing
- **Negative**: Violence, Greed, Deception, Treachery, Sacrilege, Neglect
- **Neutral**: Survival, Commerce, Discovery, Wisdom

### Karma Levels
- **Enlightened** (200+ karma) - Divine favor and blessings
- **Benevolent** (100-199 karma) - Good fortune and positive outcomes
- **Neutral** (-99 to 99 karma) - Balanced existence
- **Shadowed** (-100 to -199 karma) - Dark consequences
- **Corrupted** (-200+ karma) - Malevolent forces gather

### AI-Powered Predictions
The Oracle system uses advanced pattern recognition to:
- Analyze recent karmic actions (last 20 actions)
- Calculate karma volatility and trends
- Generate cryptic predictions about future events
- Provide confidence levels and timeframes

## 🎯 Game Mechanics

### Karmic Actions
Every action in the game affects your karma:

```javascript
// Example karmic action
recordKarmicAction('SAVE_LIFE', {
  context: 'rescued_villager',
  location: 'ancient_forest',
  timestamp: new Date()
})
```

### Reincarnation System
Upon death or choice, players can reincarnate:
- Past life karma influences new character attributes
- Hidden benefits/curses carry over
- Wisdom accumulates across lives
- Unique storylines unlock based on reincarnation count

### Dynamic Story Branching
- Quest availability changes based on karma level
- Character interactions evolve with your moral standing
- Environment and music adapt to your karmic state
- Unique endings based on cumulative choices

## 🎨 UI/UX Features

### Mystical Design
- **Dark cosmic theme** with ethereal gradients
- **Animated particles** and floating elements
- **Glowing effects** and mystical color palette
- **Smooth transitions** and micro-interactions

### Responsive Layout
- **Mobile-first design** with touch-friendly controls
- **Adaptive 3D camera** for different screen sizes
- **Accessible color schemes** and typography
- **Performance optimized** for smooth gameplay

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── MainMenu.jsx    # Main menu interface
│   ├── GameWorld.jsx   # 3D game environment
│   ├── KarmicLedger.jsx # Karma tracking interface
│   ├── OracleInterface.jsx # AI oracle system
│   ├── CharacterCreation.jsx # Character creation
│   └── LoadingScreen.jsx # Loading animations
├── stores/             # State management
│   └── karmaStore.js   # Core karmic system
├── services/           # External services
│   └── oracleService.js # AI prediction system
├── styles/             # Global styles
│   └── global.css      # CSS variables and utilities
└── main.jsx           # Application entry point
```

### State Management
The game uses Zustand for state management with persistence:

```javascript
const useKarmaStore = create(
  persist(
    (set, get) => ({
      karmicHistory: [],
      currentKarma: 0,
      karmaLevel: 'neutral',
      predictions: [],
      reincarnationCount: 0,
      // ... more state and actions
    }),
    { name: 'karma-storage' }
  )
)
```

### 3D Graphics
Built with Three.js and React Three Fiber:

```jsx
<Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
  <ambientLight intensity={0.4} />
  <Stars radius={100} depth={50} count={5000} />
  <KarmicCrystal position={[-3, 0, -3]} color="#64ffda" />
  <SacredTree position={[0, 0, 0]} />
  <OrbitControls />
</Canvas>
```

## 🎮 Gameplay Features

### Interactive Elements
- **Karmic Crystals** - Click to perform specific actions
- **Sacred Tree** - Healing and wisdom interactions
- **Action Panel** - Choose from positive, negative, or neutral actions
- **Real-time Feedback** - Toast notifications for karma changes

### Character Progression
- **Attribute System** - Wisdom, Compassion, Courage, Insight
- **Origin & Background** - Affects starting attributes and story
- **Karmic Influence** - Previous lives affect current incarnation
- **Dynamic Stats** - Real-time attribute calculations

## 🔮 AI Integration

### Oracle Predictions
The AI Oracle provides:
- **Cryptic messages** that reveal meaning over time
- **Pattern analysis** of recent actions
- **Confidence levels** for predictions
- **Timeframe estimates** for events

### Fallback System
When AI is unavailable, the system uses:
- **Rule-based predictions** based on karma patterns
- **Category analysis** for action trends
- **Temporal pattern recognition**
- **Volatility calculations**

## 🚀 Performance Optimizations

### Code Splitting
- **Lazy loading** of components
- **Dynamic imports** for better initial load times
- **Route-based code splitting**

### 3D Optimization
- **Level of detail** for 3D objects
- **Frustum culling** for off-screen elements
- **Texture compression** and optimization
- **Efficient lighting** and shadow systems

### State Optimization
- **Selective re-renders** with Zustand
- **Memoization** of expensive calculations
- **Debounced updates** for smooth animations

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run linting
npm run lint
```

## 📦 Deployment

### Build Process
```bash
# Production build
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

### Environment Variables
```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Activision Blizzard** - Inspiration for cutting-edge game development
- **OpenAI** - AI-powered prediction capabilities
- **Three.js Community** - 3D graphics and rendering
- **React Community** - Modern web development tools

## 🎯 Future Enhancements

- **Multiplayer Karma** - Collaborative karmic experiences
- **Advanced AI** - More sophisticated prediction algorithms
- **VR Support** - Immersive virtual reality gameplay
- **Mobile App** - Native mobile experience
- **Cloud Saves** - Cross-platform progress synchronization

---

**"In the realm of Karma, every choice echoes through eternity."** 🌟 