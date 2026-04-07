const API_BASE = 'http://localhost:5000/api';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(`${API_BASE}/detect`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
    }
    return response.json();
};

export const fetchHistory = async () => {
    const response = await fetch(`${API_BASE}/history`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
};

export const deleteHistoryItem = async (id) => {
    const response = await fetch(`${API_BASE}/history/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
    }
    return response.json();
};