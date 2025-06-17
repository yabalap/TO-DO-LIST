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

const AuditEmployee = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost/TO-DO-LIST/server/audit/fetch_audit_logs.php', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        }
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch audit logs');
      }

      setLogs(result.data);
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
                return (
                  <Box key={key} sx={{ mt: 1 }}>
                    <Typography variant="body2">
                      <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong>
                    </Typography>
                    <Typography variant="body2" color="error">
                      Old: {oldValue}
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
    return matchesSearch && matchesAction;
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
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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
