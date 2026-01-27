import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Home from './components/Home';
import Lobby from './components/Lobby';
import QuestionEntry from './components/QuestionEntry';
import QuestionReveal from './components/QuestionReveal';
import Answer from './components/Answer';
import Discussion from './components/Discussion';
import Voting from './components/Voting';
import Result from './components/Result';
import End from './components/End';
import './App.css';

const SOCKET_URL = 'http://localhost:3001';

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

function App() {
  const [socket, setSocket] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [roomState, setRoomState] = useState(null);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(null);
  const [voteResult, setVoteResult] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('room_created', ({ roomCode, playerId, roomState }) => {
      setPlayerId(playerId);
      setRoomState(roomState);
      setError('');
    });

    socket.on('room_joined', ({ playerId, roomState }) => {
      setPlayerId(playerId);
      setRoomState(roomState);
      setError('');
    });

    socket.on('join_error', ({ error }) => {
      setError(error);
    });

    socket.on('player_joined', ({ roomState }) => {
      setRoomState(roomState);
    });

    socket.on('player_left', ({ roomState }) => {
      setRoomState(roomState);
    });

    socket.on('phase_change', ({ phase, roomState, timer, result }) => {
      setRoomState(roomState);
      setTimer(timer || null);
      if (result) {
        setVoteResult(result);
      } else {
        setVoteResult(null);
      }
    });

    socket.on('player_submitted', ({ roomState }) => {
      setRoomState(roomState);
    });

    socket.on('player_voted', ({ roomState }) => {
      setRoomState(roomState);
    });

    socket.on('timer_tick', ({ timer }) => {
      setTimer(timer);
    });

    socket.on('room_closed', () => {
      setError('Room has been closed');
      setRoomState(null);
      setPlayerId(null);
    });

    socket.on('error', ({ error }) => {
      setError(error);
    });

    return () => {
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('join_error');
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('phase_change');
      socket.off('player_submitted');
      socket.off('player_voted');
      socket.off('timer_tick');
      socket.off('room_closed');
      socket.off('error');
    };
  }, [socket]);

  // Render appropriate component based on game phase
  const renderPhase = () => {
    if (!roomState) {
      return <Home socket={socket} error={error} />;
    }

    const commonProps = {
      socket,
      playerId,
      roomState,
      timer
    };

    switch (roomState.phase) {
      case PHASES.LOBBY:
        return <Lobby {...commonProps} />;
      case PHASES.QUESTION_ENTRY:
        return <QuestionEntry {...commonProps} />;
      case PHASES.QUESTION_REVEAL:
        return <QuestionReveal {...commonProps} />;
      case PHASES.ANSWER:
        return <Answer {...commonProps} />;
      case PHASES.DISCUSSION:
        return <Discussion {...commonProps} />;
      case PHASES.VOTING:
        return <Voting {...commonProps} />;
      case PHASES.RESULT:
        return <Result {...commonProps} voteResult={voteResult} />;
      case PHASES.END:
        return <End {...commonProps} />;
      default:
        return <Home socket={socket} error={error} />;
    }
  };

  return (
    <div className="app">
      {renderPhase()}
    </div>
  );
}

export default App;
