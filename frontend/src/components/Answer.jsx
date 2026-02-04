import { useState } from 'react';

function Answer({ socket, playerId, roomState, timer }) {
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const currentQuestion = roomState.currentQuestion;
    const currentPlayer = roomState.players.find(p => p.id === playerId);
    const hasAnswered = currentPlayer?.hasAnswered || submitted;
    const answeredCount = roomState.players.filter(p => p.hasAnswered).length;

    const categoryEmojis = {
        fun: '😄',
        personal: '😬',
        savage: '🔥'
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket && answer.trim() && !hasAnswered) {
            socket.emit('submit_answer', { answerText: answer.trim() });
            setSubmitted(true);
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

            <div style={{ maxWidth: '600px', margin: '32px auto 0' }}>
                {roomState.discussionMode === 'offline' ? (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            padding: '48px',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: '12px',
                            border: '2px solid var(--border)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💭</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '8px' }}>
                                Offline Mode
                            </div>
                            <div style={{ color: 'var(--text-secondary)' }}>
                                Think about your answer. Discussion will start soon!
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {!hasAnswered ? (
                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Your Answer</label>
                                    <textarea
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Type your answer here... (optional)"
                                        maxLength={300}
                                        rows={4}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            fontSize: '1rem',
                                            borderRadius: '8px',
                                            border: '2px solid var(--border)',
                                            backgroundColor: 'var(--bg-secondary)',
                                            color: 'var(--text-primary)',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {answer.length}/300 characters
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '16px' }}
                                    disabled={!answer.trim()}
                                >
                                    Submit Answer (+10 points)
                                </button>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    padding: '24px',
                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(76, 175, 80, 0.3)'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '8px' }}>✓</div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#4CAF50' }}>
                                        Answer Submitted!
                                    </div>
                                    <div style={{ marginTop: '8px', color: 'var(--text-secondary)' }}>
                                        +10 points earned
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <div className="timer">{timer}</div>
                    {roomState.discussionMode === 'online' && (
                        <p style={{ marginTop: '16px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                            {answeredCount} of {roomState.players.length} players answered
                        </p>
                    )}
                    <p style={{ marginTop: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        💭 Think about who might have asked this question...
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Answer;
