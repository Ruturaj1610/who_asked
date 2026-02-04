function Discussion({ socket, playerId, roomState, timer }) {
    const currentQuestion = roomState.currentQuestion;

    const categoryEmojis = {
        fun: '😄',
        personal: '😬',
        savage: '🔥'
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

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
                {roomState.discussionMode === 'online' && timer && (
                    <div className="timer">{timer}</div>
                )}
                <p style={{ marginTop: '16px', fontSize: '1.25rem', fontWeight: '600' }}>
                    💬 Discussion Time ({roomState.discussionMode === 'offline' ? 'Offline' : 'Online'})
                </p>
                <p style={{ marginTop: '8px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    Talk it out! Who do you think asked this question?
                </p>

                {roomState.discussionMode === 'offline' && roomState.hostId === playerId && (
                    <button
                        className="btn btn-primary"
                        onClick={() => socket.emit('start_voting')}
                        style={{ marginTop: '24px', padding: '16px 40px' }}
                    >
                        🚀 Start Voting
                    </button>
                )}
            </div>

            <div style={{ marginTop: '48px' }}>
                <h3 style={{ marginBottom: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Answers submitted:
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px'
                }}>
                    {roomState.currentAnswers && roomState.currentAnswers.length > 0 ? (
                        roomState.currentAnswers.map((ans) => (
                            <div key={ans.playerId} className="card" style={{ margin: 0, padding: '24px' }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--accent-secondary)',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    marginBottom: '12px',
                                    letterSpacing: '0.05em'
                                }}>
                                    {ans.nickname}
                                </div>
                                <div style={{
                                    fontSize: '1.125rem',
                                    lineHeight: '1.5',
                                    color: 'var(--text-primary)',
                                    wordBreak: 'break-word'
                                }}>
                                    "{ans.answerText}"
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No answers submitted for this question.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Discussion;
