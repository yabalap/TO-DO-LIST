import React, { useState, useEffect } from 'react';
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
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  Collapse,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

const AuditEmployee = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [tableFilter, setTableFilter] = useState('all');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    fetchLogs();
    // Get user department from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.department) {
      const userDepartment = userData.department;
      const allowedValues = departmentDirectoryMap[userDepartment];
      if (allowedValues) {
        setFilteredOptions(allowedValues);
      }
    }
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Get user department from localStorage
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userDepartment = userData?.department;
      console.log('Current user department:', userDepartment);

      const response = await fetch('http://localhost/TO-DO-LIST/server/audit/fetch_audit_logs.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      const result = await response.json();
      console.log('Server response:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch audit logs');
      }

      if (result.status === 'error') {
        throw new Error(result.message || 'Failed to fetch audit logs');
      }

      // Filter logs based on user's department
      const filteredLogs = result.data.filter(log => {
        // If user has no department, show all logs
        if (!userDepartment) return true;
        
        // Get allowed directories for the user's department
        const allowedDirectories = departmentDirectoryMap[userDepartment] || [];
        
        // Check if the log's table_name is in the allowed directories
        return allowedDirectories.includes(log.table_name);
      });

      console.log('Filtered logs:', filteredLogs);
      setLogs(filteredLogs);
      setError(null);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    switch (action?.toLowerCase()) {
      case 'create':
        return 'success';
      case 'update':
        return 'info';
      case 'delete':
        return 'error';
      case 'upload':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress === 'completed') return 'success';
    if (progress === 'in progress') return 'info';
    if (progress === 'not started') return 'default';
    return 'error';
  };

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatChanges = (changes) => {
    try {
      const parsedChanges = JSON.parse(changes);
      
      if (parsedChanges.type === 'update') {
        const oldData = parsedChanges.old_data;
        const newData = parsedChanges.new_data;
        
        return (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Changes:
            </Typography>
            {Object.entries(newData).map(([key, value]) => {
              const oldValue = oldData[key];
              if (oldValue !== value) {
                if (key === 'status' || key === 'progress') {
                  return (
                    <Box key={key} sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={oldValue || 'N/A'}
                          color={key === 'status' ? getActionColor(oldValue) : getProgressColor(oldValue)}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="body2" color="text.secondary">
                          →
                        </Typography>
                        <Chip
                          label={value}
                          color={key === 'status' ? getActionColor(value) : getProgressColor(value)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  );
                }
                
                return (
                  <Box key={key} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                    </Typography>
                    <Typography variant="body2" color="error">
                      Old: {oldValue || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      New: {value}
                    </Typography>
                  </Box>
                );
              }
              return null;
            })}
          </Box>
        );
      }
      
      if (parsedChanges.type === 'upload') {
        const fileInfo = parsedChanges.file_info;
        return (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Upload Details:
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>File Name:</strong> {fileInfo.file_name}
              </Typography>
              <Typography variant="body2">
                <strong>File Type:</strong> {fileInfo.file_type}
              </Typography>
              <Typography variant="body2">
                <strong>File Size:</strong> {(fileInfo.file_size / 1024).toFixed(2)} KB
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                Uploaded Data:
              </Typography>
              {Object.entries(fileInfo.uploaded_data).map(([key, value]) => (
                <Box key={key} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      }
      
      return JSON.stringify(parsedChanges, null, 2);
    } catch (e) {
      return changes;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = Object.values(log)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAction =
      actionFilter === 'all' || log.action?.toLowerCase() === actionFilter;
    const matchesTable =
      tableFilter === 'all' || log.table_name?.toLowerCase() === tableFilter.toLowerCase();
    return matchesSearch && matchesAction && matchesTable;
  });

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
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Action Filter</InputLabel>
            <Select
              value={actionFilter}
              label="Action Filter"
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <MenuItem value="all">All Actions</MenuItem>
              <MenuItem value="create">Create</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
              <MenuItem value="upload">Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Table Filter</InputLabel>
            <Select
              value={tableFilter}
              label="Table Filter"
              onChange={(e) => setTableFilter(e.target.value)}
            >
              <MenuItem value="all">All Tables</MenuItem>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((table) => (
                  <MenuItem key={table} value={table}>
                    {table.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </MenuItem>
                ))
              ) : (
                <>
                  <MenuItem value="pcab_documents">PCAB</MenuItem>
                  <MenuItem value="iso_certifying_body_documents">ISO-Certifying Body</MenuItem>
                  <MenuItem value="dti_sec_cda_documents">DTI / SEC / CDA</MenuItem>
                  <MenuItem value="bir_documents">BIR Documents</MenuItem>
                  <MenuItem value="lgu_documents">LGU</MenuItem>
                  <MenuItem value="sec_documents">SEC</MenuItem>
                  <MenuItem value="sss_documents">SSS</MenuItem>
                  <MenuItem value="philhealth_documents">PhilHealth</MenuItem>
                  <MenuItem value="pag_ibig_fund_documents">Pag-IBIG Fund</MenuItem>
                  <MenuItem value="dole_accredited_training_centers_documents">DOLE-Accredited Training Centers</MenuItem>
                  <MenuItem value="nbi_documents">NBI</MenuItem>
                  <MenuItem value="bir_accredited_cpa_documents">BIR Accredited CPA</MenuItem>
                  <MenuItem value="company_appraiser_banks_documents">Company / Appraiser / Banks</MenuItem>
                  <MenuItem value="bank_documents">Bank</MenuItem>
                  <MenuItem value="prc_documents">PRC</MenuItem>
                  <MenuItem value="dole_accredited_trainers_documents">DOLE / Accredited Trainers</MenuItem>
                  <MenuItem value="company_lto_suppliers_documents">Company / LTO / Suppliers</MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Table</TableCell>
              <TableCell>Record ID</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No audit logs found
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(log.id)}
                      >
                        {expandedRows[log.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.user_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.action}
                        color={getActionColor(log.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{log.table_name}</TableCell>
                    <TableCell>{log.record_id}</TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                      <Collapse in={expandedRows[log.id]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          {formatChanges(log.changes)}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditEmployee;
