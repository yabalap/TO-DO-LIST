import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../../css/Employee/monitor.css';

const EditMonitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    expirationDate: '',
    linkProof: '',
    remarks: ''
  });
  const [displayDate, setDisplayDate] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expirationDate') {
      // Store the original date for display
      setDisplayDate(value);
      // Convert the date to mm-dd-yyyy format for submission
      const formattedDate = formatDate(value);
      setFormData(prevState => ({
        ...prevState,
        [name]: formattedDate
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add your API endpoint here
      await axios.put(`/api/monitoring/${id}`, formData);
      navigate('/employee/monitoring');
    } catch (error) {
      console.error('Error updating monitoring:', error);
    }
  };

  return (
    <div className="monitoring-container">
      <div className="edit-form-container">
        <h2 className="edit-form-title">Edit Monitoring Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="expirationDate" className="form-label">
              Expiration Date
            </label>
            <input
              type="date"
              id="expirationDate"
              name="expirationDate"
              value={displayDate}
              onChange={handleChange}
              className="form-input"
              required
            />
            {formData.expirationDate && (
              <div className="formatted-date">
                Formatted Date: {formData.expirationDate}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="linkProof" className="form-label">
              Link Proof
            </label>
            <input
              type="text"
              id="linkProof"
              name="linkProof"
              value={formData.linkProof}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter link proof"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="remarks" className="form-label">
              Remarks
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Enter remarks"
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="button"
              onClick={() => navigate('/employee/monitoring')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMonitor;
