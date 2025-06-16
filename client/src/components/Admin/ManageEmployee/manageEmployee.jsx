import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../css/Admin/manageEmployee.css';
import { FaSearch, FaPlus } from 'react-icons/fa';

const ManageEmployee = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost/TO-DO-LIST/server/employee/get_employees.php', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAddEmployee = () => {
    navigate('/admin/add-employee');
  };

  const handleEditEmployee = (id) => {
    navigate(`/admin/edit-employee/${id}`);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const response = await fetch('http://localhost/TO-DO-LIST/server/employee/delete_employee.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
          // Refresh the employee list
          fetchEmployees();
        } else {
          setError(data.message || 'Failed to delete employee');
        }
      } catch (err) {
        setError('An error occurred while deleting employee');
        console.error('Error deleting employee:', err);
      }
    }
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="manage-employee-container">
      <div className="manage-employee-header">
        <h1>Manage Employees</h1>
        <div className="search-add-container">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button className="add-button" onClick={handleAddEmployee}>
            <FaPlus /> Add Employee
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Department</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.username}</td>
                <td>{employee.department}</td>
                <td>
                  <span className={`status-badge ${employee.role.toLowerCase()}`}>
                    {employee.role}
                  </span>
                </td>
                <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="action-button edit"
                    onClick={() => handleEditEmployee(employee.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEmployee;
