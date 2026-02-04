function Lobby({ socket, playerId, roomState }) {
    const isHost = roomState.hostId === playerId;
    const canStart = roomState.players.length >= 2;

    const handleStartGame = () => {
        if (socket && isHost) {
            socket.emit('start_game');
        }
    };

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1>Lobby</h1>
                <div style={{
                    display: 'inline-block',
                    background: 'var(--bg-card)',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: '2px solid var(--accent-primary)',
                    marginTop: '16px'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                        Room Code
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        letterSpacing: '0.2em',
                        fontFamily: 'Syne, sans-serif',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {roomState.roomCode}
                    </div>
                </div>
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ margin: 0 }}>Players ({roomState.players.length}/{roomState.playerLimit})</h2>
                    <div style={{
                        padding: '8px 16px',
                        background: roomState.mode === 'spicy' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(0, 217, 255, 0.2)',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                    }}>
                        {roomState.mode === 'spicy' ? '🔥 Spicy Mode' : '😄 Safe Mode'}
                    </div>
                    <div style={{
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginLeft: '8px'
                    }}>
                        {roomState.discussionMode === 'offline' ? '🏠 Offline' : '🌐 Online'}
                    </div>
                    {roomState.anonymousAnswers && (
                        <div style={{
                            padding: '8px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            fontSize: '0.875rem',
                            fontWeight: '700',
                            marginLeft: '8px',
                            border: '1px solid var(--accent-primary)'
                        }}>
                            🕵️ Anonymous
                        </div>
                    )}
                </div>

                <div className="player-list">
                    {roomState.players.map((player) => (
                        <div key={player.id} className="player-item">
                            <div className="player-name">
                                {player.nickname}
                                {player.id === playerId && ' (You)'}
                            </div>
                            {player.id === roomState.hostId && (
                                <span className="player-badge">Host</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="card">
                <h3 style={{ marginBottom: '16px' }}>⏱️ Timer Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', fontSize: '0.875rem' }}>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Answer</div>
                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                            {roomState.timerSettings?.ANSWER || 30}s
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Discussion</div>
                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                            {roomState.timerSettings?.DISCUSSION || 45}s
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Voting</div>
                        <div style={{ fontWeight: '700', fontSize: '1rem' }}>
                            {roomState.timerSettings?.VOTING || 30}s
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>Discussion Mode</div>
                        <div style={{ fontWeight: '700', fontSize: '1rem', textTransform: 'capitalize' }}>
                            {roomState.discussionMode || 'Online'}
                        </div>
                    </div>
                </div>
            </div>

            {
                isHost && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleStartGame}
                            disabled={!canStart}
                            style={{ padding: '20px 48px', fontSize: '1.25rem' }}
                        >
                            {canStart ? '🚀 Start Game' : `Waiting for players (${roomState.players.length}/2)`}
                        </button>
                        {!canStart && (
                            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                                Need at least 2 players to start
                            </p>
                        )}
                    </div>
                )
            }

            {
                !isHost && (
                    <div style={{ textAlign: 'center', marginTop: '32px' }}>
                        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
                            ⏳ Waiting for host to start the game...
                        </p>
                    </div>
                )
            }
        </div >
    );
}

export default Lobby;
