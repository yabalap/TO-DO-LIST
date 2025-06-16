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
    { value: 'pcab_documents', label: 'PCAB' },
    { value: 'iso_certifying_body_documents', label: 'ISO-Certifying Body' },
    { value: 'dti_sec_cda_documents', label: 'DTI / SEC / CDA' },
    { value: 'bir_documents', label: 'BIR Documents' },
    { value: 'lgu_documents', label: 'LGU' },
    { value: 'sec_documents', label: 'SEC' },
    { value: 'sss_documents', label: 'SSS' },
    { value: 'philhealth_documents', label: 'PhilHealth' },
    { value: 'pag_ibig_fund_documents', label: 'Pag-IBIG Fund' },
    { value: 'dole_accredited_training_centers_documents', label: 'DOLE-Accredited Training Centers' },
    { value: 'nbi_documents', label: 'NBI' },
    { value: 'bir_accredited_cpa_documents', label: 'BIR Accredited CPA' },
    { value: 'company_appraiser_banks_documents', label: 'Company / Appraiser / Banks' },
    { value: 'bank_documents', label: 'Bank' },
    { value: 'prc_documents', label: 'PRC' },
    { value: 'dole_accredited_trainers_documents', label: 'DOLE / Accredited Trainers' },
    { value: 'company_lto_suppliers_documents', label: 'Company / LTO / Suppliers' }
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

  const handleUpload = async () => {
    if (selectedFile && selectedDirectory) {
      try {
        // Create form data to send to the server
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('table', selectedDirectory.value);

        // Send the file to the server
        const response = await fetch('http://localhost/TO-DO-LIST/server/uploads/upload_handler.php', {
          method: 'POST',
          body: formData,
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });

        let result;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          const text = await response.text();
          console.error('Non-JSON response:', text);
          throw new Error('Server returned invalid response format');
        }

        if (!response.ok) {
          throw new Error(result.error || 'Upload failed');
        }

        // Show success message
        alert(result.message);
        
        // Reset form and close popup
        setSelectedFile(null);
        setSelectedDirectory(null);
        setShowUploadPopup(false);
        
        // Refresh the files list (you'll need to implement this)
        // fetchFiles();
      } catch (error) {
        console.error('Upload error:', error);
        alert(error.message || 'An error occurred during upload');
      }
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
              <th>Type</th>
              <th>Department</th>
              <th>Description</th>
              <th>Person Accountable</th>
              <th>Renewal Frequency</th>
              <th>Validity Date</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-files">No files uploaded yet</td>
              </tr>
            ) : (
              files.map((file, index) => (
                <tr key={index}>
                  <td>{file.type}</td>
                  <td>{file.department}</td>
                  <td>{file.description}</td>
                  <td>{file.personAccountable}</td>
                  <td>{file.renewalFrequency}</td>
                  <td>{file.validityDate}</td>
                  <td>{file.dueDate}</td>
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
