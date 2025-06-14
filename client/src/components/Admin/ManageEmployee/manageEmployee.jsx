import React, { useState } from 'react';
import '../../../css/Admin/manageEmployee.css';
import { FaSearch, FaPlus } from 'react-icons/fa';

const ManageEmployee = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([
    // Sample data - replace with actual API call
    { id: 1, name: 'John Doe', department: 'IT', role: 'Developer', status: 'Active' },
    { id: 2, name: 'Jane Smith', department: 'HR', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Mike Johnson', department: 'Finance', role: 'Analyst', status: 'Inactive' },
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <button className="add-button">
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
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.department}</td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button className="action-button edit">Edit</button>
                  <button className="action-button delete">Delete</button>
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
