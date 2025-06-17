import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import '../../../css/Admin/manageEmployee.css';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const departments = [
    { value: 'Legal', label: 'Legal' },
    { value: 'Executive', label: 'Executive' },
    { value: 'Compliance', label: 'Compliance' },
    { value: 'Corporate Affairs', label: 'Corporate Affairs' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Accounting', label: 'Accounting' },
    { value: 'HR', label: 'HR' },
    { value: 'Engineer', label: 'Engineer' }
  ];
  const roles = ['admin', 'employee'];

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
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`http://localhost/TO-DO-LIST/server/employee/get_employees.php?id=${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setFormData({
          name: data.employee.name,
          department: data.employee.department,
          role: data.employee.role
        });
      } else {
        setError(data.message || 'Failed to fetch employee data');
      }
    } catch (err) {
      setError('An error occurred while fetching employee data');
      console.error('Error fetching employee:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDepartmentChange = (selectedOption) => {
    setFormData(prevState => ({
      ...prevState,
      department: selectedOption.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost/TO-DO-LIST/server/employee/update_employee.php', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update employee');
      }

      setSuccess('Employee updated successfully!');
      
      // Navigate back to employee list after 2 seconds
      setTimeout(() => {
        navigate('/admin/manage-employee');
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <div className="loading">Loading employee data...</div>;
  }

  return (
    <div className="manage-employee-container">
      <div className="manage-employee-header">
        <h1>Edit Employee</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="edit-employee-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <Select
            value={departments.find(option => option.value === formData.department)}
            onChange={handleDepartmentChange}
            options={departments}
            styles={customStyles}
            placeholder="Select Department"
            isClearable
            isSearchable
            className="department-select"
            classNamePrefix="select"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="button" className="back-button" onClick={handleBack}>
            Back
          </button>
          <button type="submit" className="submit-button">
            Update Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
