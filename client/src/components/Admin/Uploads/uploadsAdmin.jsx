import React, { useState } from 'react';
import { FaSearch, FaUpload, FaTimes } from 'react-icons/fa';
import Select from 'react-select';
import '../../../css/Admin/uploads.css';

const UploadsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]); // This will be populated from your backend
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const options = [
    { value: 'pcab', label: 'PCAB' },
    { value: 'iso-certifying-body', label: 'ISO-Certifying Body' },
    { value: 'dti-sec-cda', label: 'DTI / SEC / CDA' },
    { value: 'bir', label: 'BIR' },
    { value: 'lgu', label: 'LGU' },
    { value: 'sec', label: 'SEC' },
    { value: 'sss', label: 'SSS' },
    { value: 'philhealth', label: 'PhilHealth' },
    { value: 'pag-ibig-fund', label: 'Pag-IBIG Fund' },
    { value: 'dole-accredited-training-centers', label: 'DOLE-Accredited Training Centers' },
    { value: 'nbi', label: 'NBI' },
    { value: 'bir-accredited-cpa', label: 'BIR / Accredited CPA' },
    { value: 'company-appraiser-banks', label: 'Company / Appraiser / Banks' },
    { value: 'bank', label: 'Bank' },
    { value: 'prc', label: 'PRC' },
    { value: 'dole-accredited-trainers', label: 'DOLE / Accredited Trainers' },
    { value: 'company-lto-suppliers', label: 'Company / LTO / Suppliers' }
  ];

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      border: '1px solid #ddd',
      boxShadow: 'none',
      '&:hover': {
        border: '1px solid #999'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
      color: '#333',
      '&:active': {
        backgroundColor: '#e0e0e0'
      }
    })
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile && selectedDirectory) {
      // Here you'll add the logic to upload the file to your backend
      console.log('File to upload:', selectedFile);
      console.log('Selected directory:', selectedDirectory);
      // Reset form and close popup
      setSelectedFile(null);
      setSelectedDirectory(null);
      setShowUploadPopup(false);
    }
  };

  return (
    <div className="uploads-container">
      <div className="uploads-header">
        <h2>Excel File Uploads</h2>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="upload-button-container">
          <button 
            className="upload-button"
            onClick={() => setShowUploadPopup(true)}
          >
            <FaUpload /> Upload Excel
          </button>
        </div>
      </div>

      {/* Upload Popup */}
      {showUploadPopup && (
        <div className="upload-popup-overlay">
          <div className="upload-popup">
            <div className="popup-header">
              <h3>Upload Excel File</h3>
              <button 
                className="close-button"
                onClick={() => setShowUploadPopup(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <div className="form-group">
                <label>Select Directory:</label>
                <Select
                  value={selectedDirectory}
                  onChange={setSelectedDirectory}
                  options={options}
                  styles={customStyles}
                  placeholder="Search and select a directory..."
                  isClearable
                  isSearchable
                  className="directory-select"
                  classNamePrefix="select"
                />
              </div>
              <div className="form-group">
                <label>Select File:</label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="file-input"
                />
              </div>
              <button
                className="upload-submit-button"
                onClick={handleUpload}
                disabled={!selectedFile || !selectedDirectory}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="uploads-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Upload Date</th>
              <th>Size</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-files">No files uploaded yet</td>
              </tr>
            ) : (
              files.map((file, index) => (
                <tr key={index}>
                  <td>{file.name}</td>
                  <td>{file.uploadDate}</td>
                  <td>{file.size}</td>
                  <td>{file.status}</td>
                  <td>
                    <button className="action-button">Download</button>
                    <button className="action-button delete">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadsAdmin;
