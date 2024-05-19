import React, { useState } from 'react';
import axios from 'axios';
import SideMenu from './components/SideMenu';
import DataTable from './components/DataTable';
import SummaryResults from './components/SummaryResults';
import Loader from "react-js-loader";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [fileName, setFileName] = useState('');

  const [isLoading, setIsloading] = useState(false);
  const [isLoading2, setIsloading2] = useState(false);

  const handleFileUpload = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setIsloading(true)
    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setCsvData(response.data.csvData);
      setFileName(file.name);
      setIsloading(false)
    })
    .catch(error => {
      console.error('Error uploading file:', error)
      setIsloading(false)
    });
  };

  const handleRun = (numSummaries) => {
    setIsloading2(true)
    axios.post('http://localhost:5000/summarize', { numSummaries })
      .then(response => {
        setSummaries(response.data.summaries);
        setMetrics(response.data.metrics);
        setIsloading2(false)
      })
      .catch(error => {
        console.error('Error generating summaries:', error)
        setIsloading2(false)
      });
  };

  return (
    <div className="App">
      <div className='home'>
        <SideMenu handleFileUpload={handleFileUpload} fileName={fileName} handleRun={handleRun} />
        <div className='home-right'>
          {isLoading? <div className="data-table">
            <h2>Data</h2>
            <Loader type="spinner-cub" bgColor='gray' color='gray' title={"Loading..."} size={60} /></div>:<DataTable csvData={csvData} />}
          {isLoading2? <div className="data-table">
            <h2>Summaries</h2>
            <Loader type="spinner-cub" bgColor='gray' color='gray' title={"Loading..."} size={60} /></div>:<SummaryResults summaries={summaries} metrics={metrics} />}
        </div>
      </div>
      
      
    </div>
  );
}

export default App;
