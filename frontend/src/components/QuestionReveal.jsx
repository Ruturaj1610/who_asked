function QuestionReveal({ roomState, timer }) {
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
                <div className="timer">{timer}</div>
                <p style={{ marginTop: '16px', fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
                    Get ready to think about your answer...
                </p>
            </div>
        </div>
    );
}

export default QuestionReveal;
