import React, { useRef, useState, useEffect } from 'react';
import Loader from './Loader';

const CameraCapture = ({ onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [captured, setCaptured] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const [error, setError] = useState('');

    const startCamera = async () => {
        setError('');
        setCameraReady(false);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(mediaStream);
        } catch (err) {
            console.error("Camera error:", err);
            setError('Camera access denied or not available');
        }
    };

    // Whenever we get a new stream, attach it to the video and play
    useEffect(() => {
        if (!stream || !videoRef.current) return;

        const video = videoRef.current;
        video.srcObject = stream;
        video.muted = true; // Helps with autoplay policies

        const playVideo = () => {
            video.play()
                .then(() => {
                    console.log("Video playing");
                    // Sometimes video dimensions are still 0, wait a bit
                    const checkReady = setInterval(() => {
                        if (video.videoWidth > 0 && video.videoHeight > 0) {
                            clearInterval(checkReady);
                            setCameraReady(true);
                            console.log(`Camera ready: ${video.videoWidth}x${video.videoHeight}`);
                        }
                    }, 100);
                    setTimeout(() => clearInterval(checkReady), 3000);
                })
                .catch(err => {
                    console.error("Play failed:", err);
                    setError("Could not play video. Please check console.");
                });
        };

        // Wait for metadata to load before playing
        video.onloadedmetadata = () => {
            console.log("Metadata loaded, playing...");
            playVideo();
        };

        // If already loaded, play directly
        if (video.readyState >= 1) {
            playVideo();
        }

        return () => {
            video.onloadedmetadata = null;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCaptured(null);
        setCameraReady(false);
        setError('');
    };

    const capturePhoto = () => {
        if (!videoRef.current || !cameraReady) {
            alert('Camera not ready yet. Please wait.');
            return;
        }
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
            if (!blob) {
                alert('Failed to capture image');
                return;
            }
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setCaptured(URL.createObjectURL(blob));
            setLoading(true);
            await onCapture(file);
            setLoading(false);
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    return (
        <div className="camera-section">
            {!stream ? (
                <button className="btn btn-primary" onClick={startCamera}>📸 Open Camera</button>
            ) : (
                <div>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="camera-preview"
                        style={{ width: '100%', maxHeight: '300px', background: '#000', display: 'block' }}
                    />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'center' }}>
                        <button className="btn btn-primary" onClick={capturePhoto} disabled={!cameraReady}>
                            Capture
                        </button>
                        <button className="btn btn-outline" onClick={stopCamera}>Close</button>
                    </div>
                    {!cameraReady && !error && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Initializing camera...</p>}
                    {error && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'red' }}>{error}</p>}
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {loading && <Loader />}
            {captured && !loading && (
                <div style={{ marginTop: '1rem' }}>
                    <img src={captured} alt="Captured preview" style={{ width: '100%', borderRadius: '16px' }} />
                </div>
            )}
        </div>
    );
};

export default CameraCapture;