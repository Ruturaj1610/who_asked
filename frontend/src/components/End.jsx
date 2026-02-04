function End({ roomState }) {
  const handlePlayAgain = () => {
    window.location.reload();
  };

  // Sort players by score (highest first)
  const sortedPlayers = [...roomState.players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '';
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🎊</div>

        <h1 style={{ marginBottom: '16px' }}>Game Over!</h1>

        {winner && (
          <div style={{
            padding: '40px',
            background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 107, 157, 0.15))',
            borderRadius: '24px',
            border: '3px solid #FFD700',
            marginBottom: '48px',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '8px' }}>👑</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', color: '#FFD700' }}>
              {winner.nickname}
            </div>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Supreme Legend
            </div>
            <div style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--text-primary)' }}>
              {winner.score} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>pts</span>
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{ marginBottom: '24px' }}>🏆 Leaderboard</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {sortedPlayers.map((player, index) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  backgroundColor: index === 0 ? 'rgba(255, 215, 0, 0.1)' :
                    index === 1 ? 'rgba(192, 192, 192, 0.1)' :
                      index === 2 ? 'rgba(205, 127, 50, 0.1)' :
                        'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: index < 3 ? '2px solid rgba(255, 215, 0, 0.3)' : '2px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    minWidth: '40px',
                    textAlign: 'center'
                  }}>
                    {getMedalEmoji(index) || `#${index + 1}`}
                  </div>
                  <div style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}>
                    {player.nickname}
                  </div>
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: index === 0 ? '#FFD700' :
                    index === 1 ? '#C0C0C0' :
                      index === 2 ? '#CD7F32' :
                        'var(--text-primary)'
                }}>
                  {player.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>📊 Game Stats</h3>
          <div style={{ display: 'grid', gap: '16px', fontSize: '1.125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Questions:</span>
              <span style={{ fontWeight: '700' }}>{roomState.totalQuestions}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Players:</span>
              <span style={{ fontWeight: '700' }}>{roomState.players.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Timer Mode:</span>
              <span style={{ fontWeight: '700', textTransform: 'capitalize' }}>
                {roomState.timerPreset || 'Normal'}
              </span>
            </div>
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
