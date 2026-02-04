import { useState } from 'react';

function QuestionEntry({ socket, playerId, roomState }) {
    const [questionText, setQuestionText] = useState('');
    const [category, setCategory] = useState('fun');
    const [submitted, setSubmitted] = useState(false);

    const currentPlayer = roomState.players.find(p => p.id === playerId);
    const hasSubmitted = currentPlayer?.hasSubmitted || submitted;
    const submittedCount = roomState.players.filter(p => p.hasSubmitted).length;

    const categories = [
        { id: 'fun', emoji: '😄', label: 'Fun', available: true },
        { id: 'personal', emoji: '😬', label: 'Personal', available: true },
        { id: 'savage', emoji: '🔥', label: 'Savage', available: roomState.mode === 'spicy' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (socket && questionText.trim() && !hasSubmitted) {
            socket.emit('submit_question', {
                questionText: questionText.trim(),
                category
            });
            setSubmitted(true);
        }
    };

    return (
        <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1>Submit Your Question</h1>
                <p style={{ fontSize: '1.125rem', marginTop: '8px', color: 'var(--text-secondary)' }}>
                    Make it anonymous, make it interesting!
                </p>
            </div>

            {!hasSubmitted ? (
                <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Select Category</label>
                            <div className="category-selector">
                                {categories.filter(cat => cat.available).map((cat) => (
                                    <div
                                        key={cat.id}
                                        className={`category-btn ${category === cat.id ? 'selected' : ''}`}
                                        onClick={() => setCategory(cat.id)}
                                    >
                                        <div style={{ fontSize: '2rem' }}>{cat.emoji}</div>
                                        <span className="category-label">{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>
                                Your Question ({questionText.length}/200)
                            </label>
                            <textarea
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                                placeholder="Type your anonymous question here..."
                                maxLength={200}
                                required
                                style={{ minHeight: '150px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '20px', fontSize: '1.125rem' }}
                            disabled={!questionText.trim()}
                        >
                            Submit Question
                        </button>
                    </form>
                </div>
            ) : (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div className="success-icon">✅</div>
                    <h2>Question Submitted!</h2>
                    <p style={{ fontSize: '1.125rem', marginTop: '16px' }}>
                        Waiting for other players to submit their questions...
                    </p>
                    <div style={{ marginTop: '32px' }}>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${(submittedCount / roomState.players.length) * 100}%` }}
                            />
                        </div>
                        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                            {submittedCount} / {roomState.players.length} players submitted
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default QuestionEntry;
