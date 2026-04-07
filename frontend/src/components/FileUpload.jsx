import React, { useState, useRef } from 'react';
import Loader from './Loader';

const FileUpload = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setLoading(true);
        await onUpload(file);
        setLoading(false);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };
    const onDragLeave = () => setDragActive(false);
    const onDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handleFile(file);
        else alert('Please drop an image file');
    };

    return (
        <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
            />
            <button className="btn btn-outline" onClick={() => fileInputRef.current.click()}>
                📁 Choose Image
            </button>
            <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#64748b' }}>or drag & drop</p>
            {loading && <Loader />}
            {preview && !loading && (
                <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '1rem', borderRadius: '16px' }} />
            )}
        </div>
    );
};

export default FileUpload;