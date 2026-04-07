import { useState } from 'react';
import UploadCard from './components/UploadCard';
import HistoryCard from './components/HistoryCard';

function App() {
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const handleNewDetection = () => {
    setHistoryRefresh(prev => prev + 1);
  };

  return (
    <>
      <header className="app-header">
        <h1>🌾 Crop Disease Detection</h1>
        <p>Upload or capture a leaf image to identify diseases</p>
      </header>
      <div className="container">
        <div className="grid-2">
          <UploadCard onNewDetection={handleNewDetection} />
          <HistoryCard refresh={historyRefresh} />
        </div>
      </div>
    </>
  );
}

export default App;