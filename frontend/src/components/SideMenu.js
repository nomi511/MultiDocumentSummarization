import React from 'react';
import { useDropzone } from 'react-dropzone';

function SideMenu({ handleFileUpload, fileName, handleRun }) {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => handleFileUpload(acceptedFiles[0]),
  });

  return (
    <div className="side-menu">
        <div>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <button className='up-btn'>Upload Data</button>
            </div>
            {fileName && <p className='files'>{fileName}</p>}
        </div>
        <button onClick={() => handleRun(2)} className='run-btn'>Run</button>
    </div>
  );
}

export default SideMenu;
