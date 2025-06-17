import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../../../css/Admin/manageEmployee.css';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const departments = [
    { value: 'Legal', label: 'Legal' },
    { value: 'Executive', label: 'Executive' },
    { value: 'Compliance', label: 'Compliance' },
    { value: 'Corporate Affairs', label: 'Corporate Affairs' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Accounting', label: 'Accounting' },
    { value: 'HR', label: 'HR' },
    { value: 'Engineer', label: 'Engineer' },
    { value: 'DCC', label: 'DCC' }
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
      const response = await fetch('http://localhost/TO-DO-LIST/server/employee/add_employee.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add employee');
      }

      // Show success message
      setSuccess('Employee added successfully!');
      
      // Clear form
      setFormData({
        name: '',
        department: '',
        username: '',
        password: '',
        role: ''
      });
      
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

  return (
    <div className="manage-employee-container">
      <div className="manage-employee-header">
        <h1>Add New Employee</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="add-employee-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
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
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
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
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
