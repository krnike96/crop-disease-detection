import React, { useEffect, useState } from 'react';
import { fetchHistory, deleteHistoryItem } from '../services/api';
import Loader from './Loader';

const HistoryCard = ({ refresh }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const data = await fetchHistory();
            setHistory(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this record?')) {
            try {
                await deleteHistoryItem(id);
                await loadHistory();
            } catch (err) {
                alert('Failed to delete: ' + err.message);
            }
        }
    };

    useEffect(() => {
        loadHistory();
    }, [refresh]);

    return (
        <div className="card" style={{ padding: '1.8rem' }}>
            <h2 style={{ marginBottom: '1.2rem', fontSize: '1.7rem', fontWeight: 600 }}>📋 Detection History</h2>
            {loading ? (
                <Loader />
            ) : history.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center' }}>No records yet. Upload an image above.</p>
            ) : (
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {history.map((item) => (
                        <div key={item.id} className="history-item">
                            <div>
                                <div className="history-label">{item.label.replace(/_/g, ' ')}</div>
                                <small style={{ color: '#475569' }}>{new Date(item.createdAt).toLocaleString()}</small>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span className="history-confidence">{item.confidence}%</span>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        color: '#ef4444'
                                    }}
                                    title="Delete record"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryCard;