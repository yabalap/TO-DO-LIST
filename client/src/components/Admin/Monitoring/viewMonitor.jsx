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

const ViewMonitor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchMonitoringData();
  }, [id]);

  const fetchMonitoringData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/fetch_monitoring.php?id=${id}`, {
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

      setMonitoringData(result.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/update_monitoring_status.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: 'approved'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve monitoring');
      }

      setSuccess('Monitoring item approved successfully');
      setTimeout(() => {
        navigate('/admin/monitoring');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(`http://localhost/TO-DO-LIST/server/monitoring/update_monitoring_status.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          status: 'rejected'
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject monitoring');
      }

      setSuccess('Monitoring item rejected successfully');
      setTimeout(() => {
        navigate('/admin/monitoring');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Box className="loading-container">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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

        <Card className="monitor-card">
          <CardContent className="monitor-card-content">
            <Typography variant="h6" className="section-title">
              Basic Information
            </Typography>
            
            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Type
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.type}
              </Typography>
            </Box>

            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Department
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.department}
              </Typography>
            </Box>

            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Description
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="monitor-card">
          <CardContent className="monitor-card-content">
            <Typography variant="h6" className="section-title">
              Additional Details
            </Typography>
            
            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Person Accountable
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.personAccountable}
              </Typography>
            </Box>

            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Renewal Frequency
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.renewalFrequency}
              </Typography>
            </Box>

            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Validity Date
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.validityDate}
              </Typography>
            </Box>

            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Due Date
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.dueDate}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Card className="monitor-card">
          <CardContent className="monitor-card-content">
            <Typography variant="h6" className="section-title">
              Additional Information
            </Typography>
            
            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Link Proof
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.link_proof}
              </Typography>
            </Box>

            <Box className="field-container">
              <Typography variant="subtitle2" className="field-label">
                Remarks
              </Typography>
              <Typography variant="body1" className="field-value">
                {monitoringData?.special_description}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Divider className="monitor-divider" />

        <Box className="action-buttons">
          <Button
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={handleReject}
            size="large"
            className="action-button"
          >
            Reject
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleApprove}
            size="large"
            className="action-button"
          >
            Approve
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ViewMonitor;
