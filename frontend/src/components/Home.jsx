import { useState } from 'react';
import logo from '../logo.png';

function Home({ socket, error }) {
  const [view, setView] = useState('menu'); // 'menu', 'create', 'join'
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerLimit, setPlayerLimit] = useState(6);
  const [mode, setMode] = useState('safe');
  const [customAnswerTime, setCustomAnswerTime] = useState('');
  const [customDiscussionTime, setCustomDiscussionTime] = useState('');
  const [customVotingTime, setCustomVotingTime] = useState('');
  const [discussionMode, setDiscussionMode] = useState('online');
  const [anonymousAnswers, setAnonymousAnswers] = useState(false);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (socket && nickname.trim()) {
      const customTimers = {};

      // Add custom timers if provided
      if (customAnswerTime && !isNaN(customAnswerTime)) {
        customTimers.ANSWER = parseInt(customAnswerTime);
      }
      if (customDiscussionTime && !isNaN(customDiscussionTime)) {
        customTimers.DISCUSSION = parseInt(customDiscussionTime);
      }
      if (customVotingTime && !isNaN(customVotingTime)) {
        customTimers.VOTING = parseInt(customVotingTime);
      }

      socket.emit('create_room', {
        nickname: nickname.trim(),
        playerLimit,
        mode,
        discussionMode,
        anonymousAnswers,
        customTimers
      });
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (socket && nickname.trim() && roomCode.trim()) {
      socket.emit('join_room', {
        roomCode: roomCode.trim().toUpperCase(),
        nickname: nickname.trim()
      });
    }
  };

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <img
          src={logo}
          alt="Kon Re? Logo"
          style={{
            width: '350px',
            height: 'auto',
            marginBottom: '24px',
            filter: 'drop-shadow(0 8px 24px rgba(184, 58, 155, 0.4))'
          }}
        />
        <p style={{ fontSize: '1.25rem', marginTop: '2px' }}>
          Anonymous questions. Social deduction. Chaotic fun.
        </p>
      </div>

      {error && <div className="error">{error}</div>}

      {view === 'menu' && (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setView('create')}
              style={{ padding: '24px', fontSize: '1.125rem' }}
            >
              🎮 Create Room
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setView('join')}
              style={{ padding: '24px', fontSize: '1.125rem' }}
            >
              🚪 Join Room
            </button>
          </div>

          <div className="card" style={{ marginTop: '48px', textAlign: 'left' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)' }}>
              📖 A letter from the developer
            </h3>
            <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
              <div>
                <strong style={{ color: 'var(--accent-primary)' }}>1. Submit Questions</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Everyone writes a question. They'll be shuffled and revealed one by one.</p>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-primary)' }}>2. Answer</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Everyone answers the current question, host can choose Anonymous or Disclose the identity of the respondent .</p>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-primary)' }}>3. Discuss & Vote</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Chat with others and try to find out who actually asked the question.</p>
              </div>
              <div>
                <strong style={{ color: 'var(--accent-primary)' }}>4. Score</strong>
                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>Earn 100 points for a correct vote! Points are revealed only at the end.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'create' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Create Room</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="input-group">
              <label>Your Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                maxLength={20}
                required
              />
            </div>

            <div className="input-group">
              <label>Player Limit</label>
              <select
                value={playerLimit}
                onChange={(e) => setPlayerLimit(Number(e.target.value))}
              >
                <option value={4}>4 Players</option>
                <option value={6}>6 Players</option>
                <option value={8}>8 Players</option>
                <option value={10}>10 Players</option>
              </select>
            </div>

            <div className="input-group">
              <label>Anonymous Answers</label>
              <div
                className={`mode-option ${anonymousAnswers ? 'selected' : ''}`}
                onClick={() => setAnonymousAnswers(!anonymousAnswers)}
                style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <input
                  type="checkbox"
                  checked={anonymousAnswers}
                  onChange={() => { }} // Controlled by div click
                  style={{ width: '20px', height: '20px', margin: 0 }}
                />
                <div>
                  <div style={{ fontWeight: '700' }}>Don't say my name 🤫</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Answers will be shown without author names.</div>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>Discussion Mode</label>
              <div className="mode-selector">
                <div
                  className={`mode-option ${discussionMode === 'online' ? 'selected' : ''}`}
                  onClick={() => setDiscussionMode('online')}
                >
                  <div className="mode-title">🌐 Online</div>
                  <div className="mode-description">
                    Auto-timer. Best for remote groups.
                  </div>
                </div>
                <div
                  className={`mode-option ${discussionMode === 'offline' ? 'selected' : ''}`}
                  onClick={() => setDiscussionMode('offline')}
                >
                  <div className="mode-title">🏠 Offline</div>
                  <div className="mode-description">
                    Host starts voting manually. Best for local groups.
                  </div>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label>⏱️ Timer Settings</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'none' }}>
                    Answer Time (sec)
                  </label>
                  <input
                    type="number"
                    value={customAnswerTime}
                    onChange={(e) => setCustomAnswerTime(e.target.value)}
                    placeholder="30"
                    min="10"
                    max="300"
                    style={{ padding: '12px', width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'none' }}>
                    Discussion Time (sec)
                  </label>
                  <input
                    type="number"
                    value={customDiscussionTime}
                    onChange={(e) => setCustomDiscussionTime(e.target.value)}
                    placeholder="45"
                    min="10"
                    max="300"
                    style={{ padding: '12px', width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'none' }}>
                    Voting Time (sec)
                  </label>
                  <input
                    type="number"
                    value={customVotingTime}
                    onChange={(e) => setCustomVotingTime(e.target.value)}
                    placeholder="30"
                    min="10"
                    max="300"
                    style={{ padding: '12px', width: '100%' }}
                  />
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: 0 }}>
                💡 Default values: Answer: 30s, Discussion: 45s, Voting: 30s
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setView('menu')}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      )}

      {view === 'join' && (
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>Join Room</h2>
          <form onSubmit={handleJoinRoom}>
            <div className="input-group">
              <label>Your Nickname</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Enter your nickname"
                maxLength={20}
                required
              />
            </div>

            <div className="input-group">
              <label>Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '1.5rem', textAlign: 'center' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setView('menu')}
                style={{ flex: 1 }}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                Join Room
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Home;
