import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

  const departments = ['Audit', 'Accounting', 'HR', 'Engineer', 'IT'];
  const roles = ['admin', 'employee'];

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`http://localhost/TO-DO-LIST/server/employee/get_employee.php?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost/TO-DO-LIST/server/employee/update_employee.php', {
        method: 'POST',
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
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
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
