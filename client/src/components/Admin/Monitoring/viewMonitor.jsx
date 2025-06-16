import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../../../css/Admin/monitor.css';

// Custom hook for fetching monitoring data
const useMonitoringData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/fetch_monitoring_by_id.php?id=${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to fetch monitoring data');
        }

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch monitoring data');
        }

        setData(result.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching monitoring data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, setData, loading, error };
};

// Component for displaying a field with label and value
const FieldDisplay = ({ label, value }) => (
  <Box className="field-container">
    <Typography variant="subtitle2" className="field-label">
      {label}
    </Typography>
    <Typography variant="body1" className="field-value">
      {value || 'N/A'}
    </Typography>
  </Box>
);

// Component for displaying a section of fields
const SectionDisplay = ({ title, fields }) => (
  <Card className="monitor-card">
    <CardContent className="monitor-card-content">
      <Typography variant="h6" className="section-title">
        {title}
      </Typography>
      {fields.map(({ label, value }) => (
        <FieldDisplay key={label} label={label} value={value} />
      ))}
    </CardContent>
  </Card>
);

const ViewMonitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: monitoringData, setData, loading, error: fetchError } = useMonitoringData(id);
  const [success, setSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    try {
      setIsUpdating(true);
      setActionError(null);
      setSuccess(null);

      // Log the request details for debugging
      console.log('Sending request to:', `http://localhost/TO-DO-LIST/server/monitoring/update_monitoring_status.php`);
      console.log('Request data:', { id, status });

      const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/update_monitoring_status.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: status
        })
      });

      // Log the response status for debugging
      console.log('Response status:', response.status);

      let result;
      const contentType = response.headers.get('content-type');
      
      // Check if response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('Server returned an invalid response. Please try again.');
      }

      try {
        result = await response.json();
        // Log the response data for debugging
        console.log('Response data:', result);
      } catch (jsonError) {
        console.error('Error parsing JSON response:', jsonError);
        throw new Error('Failed to process server response. Please try again.');
      }
      
      if (!response.ok) {
        throw new Error(result.message || `Failed to ${status} monitoring. Please try again.`);
      }

      if (!result.success) {
        throw new Error(result.message || `Failed to ${status} monitoring. Please try again.`);
      }

      setSuccess(result.message || `Monitoring item ${status} successfully`);
      
      // Refresh the data after successful update
      try {
        const refreshResponse = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/fetch_monitoring_by_id.php?id=${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            // Update the local data using the setData function from the hook
            setData(refreshData.data);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing data:', refreshError);
      }

      // Navigate back after a delay
      setTimeout(() => {
        navigate('/admin/monitoring');
      }, 2000);
    } catch (error) {
      console.error('Error updating status:', error);
      setActionError(error.message || 'An error occurred while updating the status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box className="error-container">
        <Alert severity="error">{fetchError}</Alert>
      </Box>
    );
  }

  if (!monitoringData) {
    return (
      <Box className="error-container">
        <Alert severity="error">No data found</Alert>
      </Box>
    );
  }

  const basicInfoFields = [
    { label: 'Type', value: monitoringData.type },
    { label: 'Department', value: monitoringData.department },
    { label: 'Description', value: monitoringData.description }
  ];

  const additionalDetailsFields = [
    { label: 'Person Accountable', value: monitoringData.personAccountable },
    { label: 'Renewal Frequency', value: monitoringData.renewalFrequency },
    { label: 'Validity Date', value: monitoringData.validityDate },
    { label: 'Due Date', value: monitoringData.dueDate }
  ];

  const additionalInfoFields = [
    { label: 'Link Proof', value: monitoringData.linkProof },
    { label: 'Remarks', value: monitoringData.special_description }
  ];

  return (
    <Box className="view-monitor-container">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/admin/monitoring')}
        className="back-button"
      >
        Back to Monitoring List
      </Button>

      <Paper className="monitor-paper">
        <Typography variant="h4" className="monitor-title">
          Monitoring Details
        </Typography>

        {success && (
          <Alert severity="success" className="success-alert">
            {success}
          </Alert>
        )}

        {actionError && (
          <Alert severity="error" className="error-alert">
            {actionError}
          </Alert>
        )}

        <SectionDisplay title="Basic Information" fields={basicInfoFields} />
        <SectionDisplay title="Additional Details" fields={additionalDetailsFields} />
        <SectionDisplay title="Additional Information" fields={additionalInfoFields} />

        <Divider className="monitor-divider" />

        <Box className="action-buttons">
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => handleStatusUpdate('rejected')}
            size="large"
            className="action-button"
            disabled={isUpdating}
          >
            {isUpdating ? 'Rejecting...' : 'Reject'}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleStatusUpdate('approved')}
            size="large"
            className="action-button"
            disabled={isUpdating}
          >
            {isUpdating ? 'Approving...' : 'Approve'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewMonitor;
