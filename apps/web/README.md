# MoodWeave Frontend

Modern, AI-powered mood-based music recommendation web application.

## 🎨 Design Features

- **Modern Glassmorphism UI**: Beautiful frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Vibrant purple-to-pink gradients throughout
- **Smooth Animations**: Fade-ins, slide-ups, and hover effects
- **Music-Themed**: Wave animations, floating music notes, and audio-visual elements
- **Dark Theme**: Optimized for comfortable viewing with rich dark colors
- **Responsive**: Fully responsive design for mobile, tablet, and desktop

## 🎯 Key Components

### Layout
- Animated header with logo and wave effect
- Glassmorphic main content area
- Gradient footer with blur effect

### Mood Input
- Large textarea with glassmorphic design
- Real-time validation
- Smooth focus effects

### Mood Results
- Animated mood display with glow effect
- Suggestion cards with hover interactions
- Rotating background gradient

### Track Cards
- Album art with hover scale effect
- Glassmorphic containers
- Staggered entry animations
- Spotify integration links

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Axios** - HTTP Client
- **CSS3** - Styling with modern features
  - Glassmorphism
  - Gradients
  - Animations
  - Backdrop Filter

## 📁 Project Structure

```
src/
├── app/                    # App configuration
│   └── providers.tsx      # Context providers
├── features/              # Feature modules
│   └── mood-analysis/     
│       ├── components/    # Feature components
│       ├── hooks/         # Custom hooks
│       └── types/         # Type definitions
├── shared/                # Shared resources
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── layout/       # Layout components
│   ├── lib/              # Utilities
│   │   ├── api/          # API client
│   │   └── utils/        # Helper functions
│   └── constants/        # App constants
└── index.css             # Global styles
```

## 🎨 Design System

### Colors
- Primary: Purple gradient (#667eea → #764ba2)
- Secondary: Pink accent (#f093fb)
- Background: Deep blue gradient (#0f0f23 → #1a1a2e → #16213e)
- Text: White with varying opacity

### Typography
- Font Family: Inter, system fonts
- Weights: 400 (normal), 600 (semibold), 700 (bold), 800 (extra bold)

### Spacing
- Uses consistent spacing scale (8px base)

### Effects
- Glassmorphism: `backdrop-filter: blur(20px)`
- Shadows: Layered box-shadows with color
- Animations: CSS keyframes with cubic-bezier easing

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=
```

Leave empty to use relative paths.

## 📦 Build

```bash
npm run build
```

Outputs to `dist/` directory.

## 🐳 Docker

```bash
docker build -t moodweave-web .
docker run -p 80:80 moodweave-web
```

## 📝 License

MIT
