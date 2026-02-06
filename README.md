# Kon Re? - Anonymous Question Party Game 🎮

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

## Quick Start ⚡

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### One-Command Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ruturaj1610/who_asked.git
   cd who_asked
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Start both servers**
   ```bash
   npm run dev
   ```

4. **Open the game**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

### Manual Installation (Alternative)

If you prefer to install dependencies separately:

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Game

**Using root package.json (Recommended)**:
```bash
npm run dev
```
This starts both backend and frontend servers concurrently.

**Manual start**:

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

## Project Structure

```
who_asked/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions for deployment
├── backend/
│   ├── server.js               # Main server with Socket.io logic
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx        # Landing page, create/join room
│   │   │   ├── Lobby.jsx       # Pre-game lobby
│   │   │   ├── QuestionEntry.jsx
│   │   │   ├── QuestionReveal.jsx
│   │   │   ├── Answer.jsx
│   │   │   ├── Discussion.jsx
│   │   │   ├── Voting.jsx
│   │   │   ├── Result.jsx
│   │   │   └── End.jsx
│   │   ├── logo.png            # Game logo
│   │   ├── backgroud.jpeg      # Background image
│   │   ├── App.jsx             # Main app with phase management
│   │   ├── App.css             # Styles
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example            # Environment variables template
├── .gitignore                  # Git ignore rules
├── .nojekyll                   # Disable Jekyll (GitHub Pages)
├── CONTRIBUTING.md             # Contribution guidelines
├── LICENSE                     # MIT License
├── package.json                # Root package.json with scripts
└── README.md                   # This file
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

## Deployment 🚀

### GitHub Pages (Automated)

This project includes GitHub Actions for automatic deployment to GitHub Pages.

**Setup Steps:**

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Under "Source", select "GitHub Actions"

3. **Automatic Deployment**
   - Every push to `main` branch triggers automatic build and deployment
   - Your site will be available at: `https://yourusername.github.io/who_asked/`

**Note**: The frontend will be deployed as a static site. You'll need to deploy the backend separately (see Backend Deployment below).

### Backend Deployment

The backend needs to be deployed to a Node.js hosting service:

**Options:**
- **Render**: Free tier available, easy deployment
- **Railway**: Simple Node.js deployment
- **Heroku**: Classic option (paid)
- **DigitalOcean**: VPS option

**Steps for Render:**
1. Create account at render.com
2. Create new "Web Service"
3. Connect your GitHub repository
4. Set root directory to `backend`
5. Build command: `npm install`
6. Start command: `npm start`
7. Deploy!

**Update Frontend Config:**
After deploying backend, update the socket URL in your frontend:
```javascript
// In frontend/src/App.jsx
const SOCKET_URL = 'https://your-backend-url.onrender.com';
```

### Other Deployment Options

**Vercel (Frontend)**
```bash
npm install -g vercel
cd frontend
vercel
```

**Netlify (Frontend)**
```bash
npm install -g netlify-cli
cd frontend
netlify deploy
```

## Development

To run in development mode with hot reload:

**Backend** (auto-restart on changes):
```bash
npm install -g nodemon
cd backend
nodemon server.js
```

**Frontend** (already has hot reload with Vite):
```bash
cd frontend
npm run dev
```

## Contributing 🤝

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with React and Socket.io
- Inspired by social deduction party games
- Beautiful gradient theme design

## Enjoy the Game! 🎉

Have fun creating chaotic questions and guessing who asked what!

---

**Made with ❤️ for party game enthusiasts**
