function End({ roomState }) {
  const handlePlayAgain = () => {
    window.location.reload();
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🎊</div>
        
        <h1 style={{ marginBottom: '16px' }}>Game Over!</h1>
        
        <p style={{ fontSize: '1.25rem', marginBottom: '48px' }}>
          Thanks for playing Question Party!
        </p>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Final Stats</h3>
          <div style={{ display: 'grid', gap: '16px', fontSize: '1.125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Questions:</span>
              <span style={{ fontWeight: '700' }}>{roomState.totalQuestions}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Players:</span>
              <span style={{ fontWeight: '700' }}>{roomState.players.length}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>Players</h3>
          <div className="player-list">
            {roomState.players.map((player) => (
              <div key={player.id} className="player-item">
                <div className="player-name">{player.nickname}</div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handlePlayAgain}
          style={{ width: '100%' }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default End;
