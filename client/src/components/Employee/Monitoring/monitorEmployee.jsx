import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const departmentDirectoryMap = {
  "Executive": ["pcab_documents", "iso_certifying_body_documents"],
  "Compliance": ["pcab_documents", "iso_certifying_body_documents"],
  "Legal": ["dti_sec_cda_documents", "bir_documents", "lgu_documents", "sec_documents", "pcab_documents"],
  "Corporate Affairs": ["dti_sec_cda_documents", "bir_documents", "lgu_documents", "sec_documents", "pcab_documents"],
  "HR": ["sss_documents", "philhealth_documents", "pag_ibig_fund_documents", "dole_accredited_training_centers_documents", "nbi_documents"],
  "Accounting": ["bir_accredited_cpa_documents", "company_appraiser_banks_documents", "bank_documents"],
  "Finance": ["bir_accredited_cpa_documents", "company_appraiser_banks_documents", "bank_documents"],
  "Engineer": ["prc_documents", "dole_accredited_trainers_documents", "pcab_documents", "company_lto_suppliers_documents"],
  "Technical": ["prc_documents", "dole_accredited_trainers_documents", "pcab_documents", "company_lto_suppliers_documents"]
};

const MonitorEmployee = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get user department from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userDepartment = userData?.department;
      console.log('Current user department:', userDepartment);

      const response = await fetch('http://localhost/TO-DO-LIST/server/monitoring/fetch_monitoring.php', {
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

      // Filter data based on user's department
      const filteredData = result.data.filter(item => {
        // If user has no department, show all data
        if (!userDepartment) return true;
        
        // Get allowed directories for the user's department
        const allowedDirectories = departmentDirectoryMap[userDepartment] || [];
        
        // Check if the item's table_name is in the allowed directories
        return allowedDirectories.includes(item.table_name);
      });

      console.log('Filtered data based on department:', filteredData);
      setData(filteredData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProgressColor = (progress) => {
    switch (progress?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatProgress = (progress) => {
    if (!progress) return 'Pending';
    return progress.charAt(0).toUpperCase() + progress.slice(1);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || item.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (id) => {
    navigate(`/employee/monitoring/edit/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              label="Status Filter"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Person Accountable</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Validity Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Process Days</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={`${row.table_name}-${row.id}`}>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>{row.personAccountable}</TableCell>
                  <TableCell>{row.expirationDate || '-'}</TableCell>
                  <TableCell>{row.validityDate}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell>{row.process_days || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={getStatusColor(row.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={formatProgress(row.progress)}
                      color={getProgressColor(row.progress)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={() => handleEdit(row.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MonitorEmployee;
