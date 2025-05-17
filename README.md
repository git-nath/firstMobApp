# Task Management App

A beautifully designed task management application built with React Native and Expo, featuring a modern interface and smooth interactions.

## Features

- 📝 Task creation with title, due date, and priority levels
- 🎨 Beautiful, minimalist interface with light/dark theme support
- 🔄 Swipe gestures for quick task completion and deletion
- 🏷️ Priority-based color coding (high, medium, low)
- 📊 Task filtering system (all, active, completed)
- 💾 Local data persistence
- ✨ Smooth animations and transitions

## Tech Stack

- React Native
- Expo Router
- React Native Reanimated
- React Native Gesture Handler
- AsyncStorage
- Lucide Icons

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/task-management-app.git
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

## Project Structure

```
├── app/                   # Application routes
│   ├── _layout.tsx       # Root layout
│   └── (tabs)/           # Tab-based navigation
├── components/           # Reusable components
├── context/             # React Context providers
├── types/               # TypeScript type definitions
└── utils/              # Utility functions
```

## Features

### Task Management
- Create, complete, and delete tasks
- Set priority levels (high, medium, low)
- Add due dates
- Filter tasks by status

### User Interface
- Clean, minimalist design
- Responsive layout
- Smooth animations
- Gesture-based interactions

### Theme Support
- Light and dark mode
- System theme detection
- Custom color palette

## License

MIT