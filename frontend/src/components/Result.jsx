function Result({ playerId, roomState, voteResult }) {
    const currentQuestion = roomState.currentQuestion;

    const categoryEmojis = {
        fun: '😄',
        personal: '😬',
        savage: '🔥'
    };

    // Scores hidden until end
    const topPlayers = [];

    // Check if current player earned points
    const currentPlayerPoints = voteResult?.pointsAwarded?.find(p => p.playerId === playerId);

    if (!currentQuestion) {
        return (
            <div className="container">
                <div style={{ textAlign: 'center' }}>
                    <p>Loading results...</p>
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

            {voteResult && voteResult.success ? (
                <div className="success-message result-success" style={{ marginTop: '32px' }}>
                    <div className="success-icon">🎉</div>
                    <h2 style={{ color: 'var(--success)', marginBottom: '16px' }}>
                        Majority Got It Right!
                    </h2>
                    <p style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>
                        {voteResult.correctPlayer?.nickname || 'Unknown'} asked this question!
                    </p>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        The majority voted correctly!
                    </p>
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '48px',
                    background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.1), rgba(255, 107, 157, 0.1))',
                    border: '3px solid var(--error)',
                    borderRadius: '16px',
                    margin: '32px auto',
                    maxWidth: '600px'
                }}>
                    <div style={{ fontSize: '5rem', marginBottom: '24px' }}>🤷</div>
                    <h2 style={{ color: 'var(--error)', marginBottom: '16px' }}>
                        No Majority Vote!
                    </h2>
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                        The question owner remains anonymous...
                    </p>
                </div>
            )}



            <div style={{ marginTop: '48px', textAlign: 'center' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    Scores are hidden until the very end! 🤫
                </p>
            </div>
        </div>
    );
}

export default Result;
