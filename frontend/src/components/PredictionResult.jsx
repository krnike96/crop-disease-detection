import React from 'react';

const PredictionResult = ({ result }) => {
    if (!result) return null;
    return (
        <div className="prediction-result" style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '20px' }}>
            <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>🔍 Detection Result</h4>
            <p><strong>Disease:</strong> {result.label.replace(/_/g, ' ')}</p>
            <p><strong>Confidence:</strong> {result.confidence}%</p>
            <small style={{ color: '#475569' }}>Record saved automatically</small>
        </div>
    );
};

export default PredictionResult;