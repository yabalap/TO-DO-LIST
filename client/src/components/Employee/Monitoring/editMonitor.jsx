import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../css/Employee/monitor.css';

const EditMonitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    expiration_date: '',
    process_days: '',
    link_proof: '',
    special_description: '',
    progress: 'Completed'
  });
  const [displayDate, setDisplayDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMonitoringDetails = async () => {
      try {
        const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/fetch_monitoring_by_id.php?id=${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch monitoring details');
        }

        const data = await response.json();
        if (data.success && data.data) {
          // Convert the expiration_date to YYYY-MM-DD format for the input field
          const expirationDate = data.data.expirationDate;
          console.log('Raw expiration date from server:', expirationDate);
          
          if (expirationDate) {
            // Split the date and ensure proper formatting
            const [month, day, year] = expirationDate.split('-');
            // Ensure month and day are padded with zeros if needed
            const paddedMonth = month.padStart(2, '0');
            const paddedDay = day.padStart(2, '0');
            // Format for display in input (YYYY-MM-DD)
            const formattedDate = `${year}-${paddedMonth}-${paddedDay}`;
            console.log('Formatted date for input:', formattedDate);
            setDisplayDate(formattedDate);
          }
          
          console.log('Full monitoring data:', data.data);
          
          setFormData(prevState => ({
            ...prevState,
            expiration_date: data.data.expirationDate || '',
            process_days: data.data.process_days || '',
            link_proof: data.data.link_proof || '',
            special_description: data.data.special_description || '',
            progress: data.data.progress || 'Completed',
            status: data.data.status || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching monitoring details:', error);
        setError('Failed to load monitoring details');
      }
    };

    fetchMonitoringDetails();
  }, [id]);

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
    if (name === 'expiration_date') {
      // Store the original date for display
      setDisplayDate(value);
      // Convert the date to mm-dd-yyyy format for submission
      const date = new Date(value);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${month}-${day}-${year}`;
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
    setError('');
    
    try {
      // Get current user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      if (!userData || !userData.department || !userData.name) {
        throw new Error('User data is incomplete. Please log out and log in again.');
      }
      
      // Prepare the data with department and person_accountable
      const submitData = {
        ...formData,
        department: userData.department,
        person_accountable: userData.name,
        status: 'Pending',  // Always set status to Pending when submitting
        progress: 'Completed' // Always set progress to Completed when submitting
      };

      console.log('Submitting data:', submitData);

      const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/update_monitoring.php?id=${id}`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(submitData)
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
        throw new Error(result.error || 'Failed to update monitoring');
      }

      if (!result.success) {
        throw new Error(result.error || 'Failed to update monitoring');
      }

      console.log('Update successful:', result);
      navigate('/employee/monitoring');
    } catch (error) {
      console.error('Error updating monitoring:', error);
      setError(error.message || 'An error occurred while updating the monitoring details');
    }
  };

  return (
    <div className="monitoring-container">
      <div className="edit-form-container">
        <h2 className="edit-form-title">Edit Monitoring Details</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="expiration_date" className="form-label">
              Expiration Date
            </label>
            <input
              type="date"
              id="expiration_date"
              name="expiration_date"
              value={displayDate}
              onChange={handleChange}
              className="form-input"
              required
            />
            {formData.expiration_date && (
              <div className="formatted-date">
                Formatted Date: {formData.expiration_date}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="process_days" className="form-label">
              Process Days
            </label>
            <input
              type="number"
              id="process_days"
              name="process_days"
              value={formData.process_days}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter number of process days"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="link_proof" className="form-label">
              Link Proof
            </label>
            <input
              type="text"
              id="link_proof"
              name="link_proof"
              value={formData.link_proof}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter link proof"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="special_description" className="form-label">
              Remarks
            </label>
            <textarea
              id="special_description"
              name="special_description"
              value={formData.special_description}
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
