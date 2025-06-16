import React, { useState, useEffect } from 'react';
import { FaSearch, FaUpload, FaTimes, FaFilter } from 'react-icons/fa';
import Select from 'react-select';
import '../../../css/Admin/uploads.css';

const UploadsAdmin = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTableFilter, setSelectedTableFilter] = useState(null);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/TO-DO-LIST/server/uploads/fetch_uploads.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data');
      }

      console.log('Fetched data:', result.data); // Log the fetched data
      setFiles(result.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('table', selectedDirectory.value);

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

        alert(result.message);
        
        setSelectedFile(null);
        setSelectedDirectory(null);
        setShowUploadPopup(false);
        
        // Refresh the data after successful upload
        fetchData();
      } catch (error) {
        console.error('Upload error:', error);
        alert(error.message || 'An error occurred during upload');
      }
    }
  };

  // Filter files based on search term and table type
  const filteredFiles = files.filter(file => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      (file.type && file.type.toLowerCase().includes(searchLower)) ||
      (file.department && file.department.toLowerCase().includes(searchLower)) ||
      (file.description && file.description.toLowerCase().includes(searchLower)) ||
      (file.personAccountable && file.personAccountable.toLowerCase().includes(searchLower))
    );

    const matchesTable = !selectedTableFilter || file.table_name === selectedTableFilter.value;

    return matchesSearch && matchesTable;
  });

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
        <div className="button-container">
          <button 
            className="filter-button"
            onClick={() => setShowFilterPopup(true)}
          >
            <FaFilter /> Filter by Table
          </button>
          <button 
            className="upload-button"
            onClick={() => setShowUploadPopup(true)}
          >
            <FaUpload /> Upload Excel
          </button>
        </div>
      </div>

      {/* Filter Popup */}
      {showFilterPopup && (
        <div className="upload-popup-overlay">
          <div className="upload-popup">
            <div className="popup-header">
              <h3>Filter by Table Type</h3>
              <button 
                className="close-button"
                onClick={() => setShowFilterPopup(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="popup-content">
              <div className="form-group">
                <Select
                  value={selectedTableFilter}
                  onChange={setSelectedTableFilter}
                  options={options}
                  styles={customStyles}
                  placeholder="Select table type..."
                  isClearable
                  isSearchable
                  className="directory-select"
                  classNamePrefix="select"
                />
              </div>
              <button
                className="upload-submit-button"
                onClick={() => setShowFilterPopup(false)}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}

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
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
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
                <th>Table</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-files">No files found</td>
                </tr>
              ) : (
                filteredFiles.map((file, index) => (
                  <tr key={index}>
                    <td>{file.type}</td>
                    <td>{file.department}</td>
                    <td>{file.description}</td>
                    <td>{file.personAccountable}</td>
                    <td>{file.renewal_frequency}</td>
                    <td>{file.validity_date}</td>
                    <td>{file.due_date}</td>
                    <td>{file.table_name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UploadsAdmin;
