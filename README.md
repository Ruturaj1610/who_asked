# Question Party - Anonymous Question Game

A browser-based multiplayer party game where players submit anonymous questions, then try to guess who asked each one.

## Game Overview

- **Anonymous Questions**: Each player submits one question without revealing their identity
- **Social Deduction**: Players discuss and vote on who asked each question
- **Multiple Categories**: Fun, Personal, and Savage questions
- **Two Game Modes**: Safe Mode (Fun + Personal) or Spicy Mode (all categories)

## Tech Stack

### Backend
- Node.js
- Express
- Socket.io
- bad-words (profanity filter)

### Frontend
- React 18
- Vite
- Socket.io Client

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Game

You need to run both backend and frontend servers:

1. **Start the Backend Server**
```bash
cd backend
npm start
```
The server will start on `http://localhost:3001`

2. **Start the Frontend (in a new terminal)**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:3000`

3. **Open the game in your browser**
Navigate to `http://localhost:3000`

## How to Play

### Setup Phase
1. **Create a Room**: One player creates a room and selects:
   - Player limit (4, 6, 8, or 10 players)
   - Game mode (Safe or Spicy)

2. **Join the Room**: Other players join using the 6-digit room code

3. **Start the Game**: Host starts the game when ready (minimum 2 players)

### Game Phases

1. **Question Entry**
   - Each player submits one anonymous question
   - Select a category: 😄 Fun, 😬 Personal, or 🔥 Savage (in Spicy mode)
   - Questions are limited to 200 characters

2. **For Each Question**:
   - **Question Reveal** (5s): The question is displayed
   - **Answer Phase** (30s): Players think about their answer (optional, online or offline)
   - **Discussion** (45s): Players discuss who might have asked the question
   - **Voting** (30s): Everyone votes on who they think asked the question
   - **Result** (8s): 
     - If majority voted correctly → Success! The question owner is revealed
     - If not → The owner remains anonymous

3. **Game End**: After all questions, final stats are shown

## Game Rules

- Minimum 2 players to start
- Each player submits exactly one question
- Questions go through a profanity filter
- Voting requires majority consensus to reveal the question owner
- If the majority doesn't agree, the question owner stays anonymous

## File Structure

```
question-party-game/
├── backend/
│   ├── server.js          # Main server with Socket.io logic
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx         # Landing page, create/join room
    │   │   ├── Lobby.jsx        # Pre-game lobby
    │   │   ├── QuestionEntry.jsx # Submit question phase
    │   │   ├── QuestionReveal.jsx # Reveal question phase
    │   │   ├── Answer.jsx       # Answer phase
    │   │   ├── Discussion.jsx   # Discussion phase
    │   │   ├── Voting.jsx       # Voting phase
    │   │   ├── Result.jsx       # Show voting result
    │   │   └── End.jsx          # Game over screen
    │   ├── App.jsx         # Main app with phase management
    │   ├── App.css         # Styles
    │   └── main.jsx        # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Configuration

### Server Configuration
Default port: `3001`

To change the port, set the `PORT` environment variable:
```bash
PORT=4000 npm start
```

### Frontend Configuration
If you change the backend port, update the `SOCKET_URL` in `frontend/src/App.jsx`:
```javascript
const SOCKET_URL = 'http://localhost:YOUR_PORT';
```

## Phase Timers

These are configured in `backend/server.js`:
- Question Reveal: 5 seconds
- Answer: 30 seconds
- Discussion: 45 seconds
- Voting: 30 seconds
- Result: 8 seconds

## Features

✅ Real-time multiplayer with Socket.io  
✅ Room-based gameplay with unique codes  
✅ Anonymous question submission  
✅ Profanity filtering  
✅ Category-based questions  
✅ Majority voting system  
✅ Timed phases with automatic progression  
✅ Player disconnect handling  
✅ Responsive design  

## Troubleshooting

**Issue**: Can't connect to the server
- Make sure the backend is running on port 3001
- Check that both servers are running
- Verify no firewall is blocking the connection

**Issue**: Room not found
- Double-check the room code (case-sensitive)
- Make sure the room hasn't been closed (host left)

**Issue**: Game won't start
- Ensure at least 2 players are in the room
- Only the host can start the game

## Development

To run in development mode with hot reload:

**Backend** (auto-restart on changes):
```bash
npm install -g nodemon
nodemon server.js
```

**Frontend** (already has hot reload with Vite):
```bash
npm run dev
```

## License

This project is provided as-is for educational and entertainment purposes.

## Enjoy the Game! 🎉

Have fun creating chaotic questions and guessing who asked what!
