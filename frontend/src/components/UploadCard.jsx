import React, { useState } from 'react';
import FileUpload from './FileUpload';
import CameraCapture from './CameraCapture';
import PredictionResult from './PredictionResult';
import { uploadImage } from '../services/api';

const UploadCard = ({ onNewDetection }) => {
    const [result, setResult] = useState(null);

    const handleUpload = async (file) => {
        try {
            const data = await uploadImage(file);
            setResult(data);
            onNewDetection();
        } catch (err) {
            alert(err.message);
            setResult(null);
        }
    };

    return (
        <div className="card" style={{ padding: '1.8rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📂 File Upload</h3>
                    <FileUpload onUpload={handleUpload} />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📸 Camera Capture</h3>
                    <CameraCapture onCapture={handleUpload} />
                </div>
            </div>
            <PredictionResult result={result} />
        </div>
    );
};

export default UploadCard;