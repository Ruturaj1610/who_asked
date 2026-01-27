const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const Filter = require('bad-words');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const filter = new Filter();

// Game constants
const PHASES = {
  LOBBY: 'LOBBY',
  QUESTION_ENTRY: 'QUESTION_ENTRY',
  QUESTION_REVEAL: 'QUESTION_REVEAL',
  ANSWER: 'ANSWER',
  DISCUSSION: 'DISCUSSION',
  VOTING: 'VOTING',
  RESULT: 'RESULT',
  END: 'END'
};

const PHASE_TIMERS = {
  QUESTION_REVEAL: 5,
  ANSWER: 30,
  DISCUSSION: 45,
  VOTING: 30,
  RESULT: 8
};

const MAX_QUESTION_LENGTH = 200;

// In-memory storage
const rooms = new Map();
const playerSocketMap = new Map(); // socket.id -> { roomCode, playerId }

// Generate unique 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms.has(code));
  return code;
}

// Generate unique player ID
function generatePlayerId() {
  return Math.random().toString(36).substring(2, 15);
}

// Shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create a new room
function createRoom(hostSocketId, hostNickname, playerLimit, mode) {
  const roomCode = generateRoomCode();
  const hostId = generatePlayerId();
  
  const room = {
    roomCode,
    hostId,
    playerLimit,
    mode,
    players: [{
      id: hostId,
      socketId: hostSocketId,
      nickname: hostNickname,
      hasSubmitted: false,
      hasVoted: false
    }],
    questions: [],
    currentQuestionIndex: -1,
    phase: PHASES.LOBBY,
    timer: null,
    timerInterval: null,
    votes: new Map(), // questionId -> Map(voterId -> votedPlayerId)
    currentQuestionId: null
  };
  
  rooms.set(roomCode, room);
  playerSocketMap.set(hostSocketId, { roomCode, playerId: hostId });
  
  return { roomCode, playerId: hostId, room };
}

// Join a room
function joinRoom(socketId, roomCode, nickname) {
  const room = rooms.get(roomCode);
  
  if (!room) {
    return { error: 'Room not found' };
  }
  
  if (room.phase !== PHASES.LOBBY) {
    return { error: 'Game already started' };
  }
  
  if (room.players.length >= room.playerLimit) {
    return { error: 'Room is full' };
  }
  
  const playerId = generatePlayerId();
  const player = {
    id: playerId,
    socketId,
    nickname,
    hasSubmitted: false,
    hasVoted: false
  };
  
  room.players.push(player);
  playerSocketMap.set(socketId, { roomCode, playerId });
  
  return { playerId, room };
}

// Get sanitized room state (without sensitive data)
function getSanitizedRoomState(room) {
  return {
    roomCode: room.roomCode,
    hostId: room.hostId,
    playerLimit: room.playerLimit,
    mode: room.mode,
    players: room.players.map(p => ({
      id: p.id,
      nickname: p.nickname,
      hasSubmitted: p.hasSubmitted,
      hasVoted: p.hasVoted
    })),
    phase: room.phase,
    timer: room.timer,
    currentQuestionIndex: room.currentQuestionIndex,
    totalQuestions: room.questions.length,
    currentQuestion: room.currentQuestionId ? {
      id: room.currentQuestionId,
      text: room.questions.find(q => q.id === room.currentQuestionId)?.text,
      category: room.questions.find(q => q.id === room.currentQuestionId)?.category
    } : null
  };
}

// Start the game
function startGame(room) {
  if (room.players.length < 2) {
    return { error: 'Need at least 2 players' };
  }
  
  room.phase = PHASES.QUESTION_ENTRY;
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room)
  });
  
  return { success: true };
}

// Submit a question
function submitQuestion(room, playerId, questionText, category) {
  const player = room.players.find(p => p.id === playerId);
  
  if (!player) {
    return { error: 'Player not found' };
  }
  
  if (player.hasSubmitted) {
    return { error: 'Question already submitted' };
  }
  
  if (questionText.length > MAX_QUESTION_LENGTH) {
    return { error: 'Question too long' };
  }
  
  // Profanity filter
  if (filter.isProfane(questionText)) {
    return { error: 'Question contains inappropriate content' };
  }
  
  const questionId = generatePlayerId();
  room.questions.push({
    id: questionId,
    text: questionText,
    category,
    ownerId: playerId // NEVER sent to clients
  });
  
  player.hasSubmitted = true;
  
  // Check if all players submitted
  const allSubmitted = room.players.every(p => p.hasSubmitted);
  
  if (allSubmitted) {
    // Shuffle questions
    room.questions = shuffleArray(room.questions);
    room.currentQuestionIndex = 0;
    
    // Move to first question reveal
    setTimeout(() => {
      startQuestionReveal(room);
    }, 1000);
  }
  
  return { success: true };
}

// Start question reveal phase
function startQuestionReveal(room) {
  const question = room.questions[room.currentQuestionIndex];
  room.currentQuestionId = question.id;
  room.phase = PHASES.QUESTION_REVEAL;
  room.timer = PHASE_TIMERS.QUESTION_REVEAL;
  
  // Reset vote status
  room.players.forEach(p => p.hasVoted = false);
  room.votes.set(question.id, new Map());
  
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room),
    timer: room.timer
  });
  
  startTimer(room, () => {
    startAnswerPhase(room);
  });
}

// Start answer phase
function startAnswerPhase(room) {
  room.phase = PHASES.ANSWER;
  room.timer = PHASE_TIMERS.ANSWER;
  
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room),
    timer: room.timer
  });
  
  startTimer(room, () => {
    startDiscussionPhase(room);
  });
}

// Start discussion phase
function startDiscussionPhase(room) {
  room.phase = PHASES.DISCUSSION;
  room.timer = PHASE_TIMERS.DISCUSSION;
  
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room),
    timer: room.timer
  });
  
  startTimer(room, () => {
    startVotingPhase(room);
  });
}

// Start voting phase
function startVotingPhase(room) {
  room.phase = PHASES.VOTING;
  room.timer = PHASE_TIMERS.VOTING;
  
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room),
    timer: room.timer
  });
  
  startTimer(room, () => {
    calculateResults(room);
  });
}

// Submit a vote
function submitVote(room, voterId, votedPlayerId) {
  const voter = room.players.find(p => p.id === voterId);
  
  if (!voter) {
    return { error: 'Voter not found' };
  }
  
  if (voter.hasVoted) {
    return { error: 'Already voted' };
  }
  
  const question = room.questions.find(q => q.id === room.currentQuestionId);
  const questionVotes = room.votes.get(question.id);
  
  questionVotes.set(voterId, votedPlayerId);
  voter.hasVoted = true;
  
  // Check if all players voted
  const allVoted = room.players.every(p => p.hasVoted);
  
  if (allVoted) {
    clearInterval(room.timerInterval);
    calculateResults(room);
  }
  
  return { success: true };
}

// Calculate voting results
function calculateResults(room) {
  const question = room.questions.find(q => q.id === room.currentQuestionId);
  const questionVotes = room.votes.get(question.id);
  
  // Count votes
  const voteCounts = new Map();
  questionVotes.forEach((votedPlayerId) => {
    voteCounts.set(votedPlayerId, (voteCounts.get(votedPlayerId) || 0) + 1);
  });
  
  // Find player(s) with most votes
  let maxVotes = 0;
  let topPlayers = [];
  
  voteCounts.forEach((count, playerId) => {
    if (count > maxVotes) {
      maxVotes = count;
      topPlayers = [playerId];
    } else if (count === maxVotes) {
      topPlayers.push(playerId);
    }
  });
  
  // Check if majority voted correctly
  const totalVotes = questionVotes.size;
  const majorityNeeded = Math.ceil(totalVotes / 2);
  
  let success = false;
  let correctPlayer = null;
  
  if (topPlayers.length === 1 && maxVotes >= majorityNeeded) {
    if (topPlayers[0] === question.ownerId) {
      success = true;
      correctPlayer = room.players.find(p => p.id === question.ownerId);
    }
  }
  
  room.phase = PHASES.RESULT;
  room.timer = PHASE_TIMERS.RESULT;
  
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room),
    timer: room.timer,
    result: {
      success,
      correctPlayer: success ? {
        id: correctPlayer.id,
        nickname: correctPlayer.nickname
      } : null
    }
  });
  
  startTimer(room, () => {
    moveToNextQuestion(room);
  });
}

// Move to next question or end game
function moveToNextQuestion(room) {
  room.currentQuestionIndex++;
  
  if (room.currentQuestionIndex >= room.questions.length) {
    endGame(room);
  } else {
    startQuestionReveal(room);
  }
}

// End the game
function endGame(room) {
  room.phase = PHASES.END;
  
  io.to(room.roomCode).emit('phase_change', {
    phase: room.phase,
    roomState: getSanitizedRoomState(room)
  });
}

// Timer management
function startTimer(room, onComplete) {
  clearInterval(room.timerInterval);
  
  room.timerInterval = setInterval(() => {
    room.timer--;
    
    io.to(room.roomCode).emit('timer_tick', { timer: room.timer });
    
    if (room.timer <= 0) {
      clearInterval(room.timerInterval);
      onComplete();
    }
  }, 1000);
}

// Handle player disconnect
function handleDisconnect(socketId) {
  const playerInfo = playerSocketMap.get(socketId);
  
  if (!playerInfo) return;
  
  const { roomCode, playerId } = playerInfo;
  const room = rooms.get(roomCode);
  
  if (!room) {
    playerSocketMap.delete(socketId);
    return;
  }
  
  // Remove player
  room.players = room.players.filter(p => p.id !== playerId);
  playerSocketMap.delete(socketId);
  
  // If host left or no players left, delete room
  if (playerId === room.hostId || room.players.length === 0) {
    clearInterval(room.timerInterval);
    rooms.delete(roomCode);
    io.to(roomCode).emit('room_closed');
    return;
  }
  
  // Notify remaining players
  io.to(roomCode).emit('player_left', {
    playerId,
    roomState: getSanitizedRoomState(room)
  });
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('create_room', ({ nickname, playerLimit, mode }) => {
    const { roomCode, playerId, room } = createRoom(socket.id, nickname, playerLimit, mode);
    
    socket.join(roomCode);
    
    socket.emit('room_created', {
      roomCode,
      playerId,
      roomState: getSanitizedRoomState(room)
    });
  });
  
  socket.on('join_room', ({ roomCode, nickname }) => {
    const result = joinRoom(socket.id, roomCode, nickname);
    
    if (result.error) {
      socket.emit('join_error', { error: result.error });
      return;
    }
    
    socket.join(roomCode);
    
    socket.emit('room_joined', {
      playerId: result.playerId,
      roomState: getSanitizedRoomState(result.room)
    });
    
    // Notify other players
    socket.to(roomCode).emit('player_joined', {
      roomState: getSanitizedRoomState(result.room)
    });
  });
  
  socket.on('start_game', () => {
    const playerInfo = playerSocketMap.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomCode);
    if (!room || playerInfo.playerId !== room.hostId) {
      socket.emit('error', { error: 'Only host can start game' });
      return;
    }
    
    const result = startGame(room);
    
    if (result.error) {
      socket.emit('error', { error: result.error });
    }
  });
  
  socket.on('submit_question', ({ questionText, category }) => {
    const playerInfo = playerSocketMap.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomCode);
    if (!room) return;
    
    const result = submitQuestion(room, playerInfo.playerId, questionText, category);
    
    if (result.error) {
      socket.emit('error', { error: result.error });
      return;
    }
    
    io.to(room.roomCode).emit('player_submitted', {
      roomState: getSanitizedRoomState(room)
    });
  });
  
  socket.on('submit_vote', ({ votedPlayerId }) => {
    const playerInfo = playerSocketMap.get(socket.id);
    if (!playerInfo) return;
    
    const room = rooms.get(playerInfo.roomCode);
    if (!room) return;
    
    const result = submitVote(room, playerInfo.playerId, votedPlayerId);
    
    if (result.error) {
      socket.emit('error', { error: result.error });
      return;
    }
    
    io.to(room.roomCode).emit('player_voted', {
      roomState: getSanitizedRoomState(room)
    });
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    handleDisconnect(socket.id);
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
