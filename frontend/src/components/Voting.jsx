import { useState } from 'react';

function Voting({ socket, playerId, roomState, timer }) {
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    const currentQuestion = roomState.currentQuestion;
    const votedCount = roomState.votes ? Object.keys(roomState.votes).length : 0;

    const categoryEmojis = {
        fun: '😄',
        personal: '😬',
        savage: '🔥'
    };

    const handleVote = (votedPlayerId) => {
        if (socket && !hasVoted) {
            setSelectedPlayer(votedPlayerId);
            socket.emit('submit_vote', { votedPlayerId });
            setHasVoted(true);
        }
    };

    if (!currentQuestion) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center' }}>
                    <p>Loading question...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h2 style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>
                    Question {roomState.currentQuestionIndex + 1} of {roomState.totalQuestions}
                </h2>
            </div>

            <div className="question-display">
                <div className="question-category">
                    {categoryEmojis[currentQuestion.category]}
                </div>
                <div className="question-text">
                    {currentQuestion.text}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px', marginBottom: '32px' }}>
                <div className="timer">{timer}</div>
                <p style={{ marginTop: '16px', fontSize: '1.25rem', fontWeight: '600' }}>
                    🗳️ Who asked this question?
                </p>
            </div>

            {roomState.currentAnswers && roomState.currentAnswers.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', textTransform: 'uppercase' }}>
                        Reference: Player Answers
                    </h4>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        justifyContent: 'center'
                    }}>
                        {roomState.currentAnswers.map((ans) => (
                            <div key={ans.playerId} style={{
                                background: 'var(--bg-secondary)',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border)',
                                maxWidth: '250px',
                                fontSize: '0.875rem'
                            }}>
                                <span style={{ color: 'var(--accent-secondary)', fontWeight: '700' }}>{ans.nickname}: </span>
                                <span style={{ color: 'var(--text-secondary)' }}>"{ans.answerText}"</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!hasVoted ? (
                <div>
                    <div className="voting-grid">
                        {roomState.players.map((player) => (
                            <button
                                key={player.id}
                                className={`vote-btn ${selectedPlayer === player.id ? 'selected' : ''}`}
                                onClick={() => handleVote(player.id)}
                            >
                                {player.nickname}
                                {player.id === playerId && <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.7 }}>(You)</div>}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="success-icon">✅</div>
                    <h3>Vote Submitted!</h3>
                    <p style={{ fontSize: '1.125rem', marginTop: '16px' }}>
                        Waiting for other players to vote...
                    </p>
                    <div style={{ marginTop: '32px' }}>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(votedCount / roomState.players.length) * 100}%` }}
                            />
                        </div>
                        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                            {votedCount} / {roomState.players.length} players voted
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Voting;
