import React, { useState } from 'react';
import { FaSearch, FaUpload } from 'react-icons/fa';
import '../../../css/Admin/uploads.css';

const UploadsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]); // This will be populated from your backend

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Here you'll add the logic to upload the file to your backend
      console.log('File to upload:', file);
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
          <label htmlFor="file-upload" className="upload-button">
            <FaUpload /> Upload Excel
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

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
