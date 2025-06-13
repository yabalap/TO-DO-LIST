import React, { useState, useEffect } from 'react';
import { FaTasks, FaCheckCircle, FaClock, FaPlus } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../../../css/Admin/dashboard.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const [recentTasks, setRecentTasks] = useState([]);

  // Sample data for the chart
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 19, 15, 17, 22, 25, 20],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Weekly Task Completion',
      },
    },
  };

  useEffect(() => {
    // TODO: Fetch actual data from your backend
    // This is sample data for demonstration
    setStats({
      totalTasks: 45,
      completedTasks: 30,
      pendingTasks: 15,
    });

    setRecentTasks([
      { id: 1, title: 'Complete project documentation', status: 'completed' },
      { id: 2, title: 'Review pull requests', status: 'pending' },
      { id: 3, title: 'Update user interface', status: 'pending' },
    ]);
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <FaTasks className="stat-icon" />
          <div className="stat-info">
            <h3>Total Tasks</h3>
            <p>{stats.totalTasks}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div className="stat-info">
            <h3>Completed</h3>
            <p>{stats.completedTasks}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div className="stat-info">
            <h3>Pending</h3>
            <p>{stats.pendingTasks}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Recent Tasks */}
      <div className="recent-tasks">
        <div className="section-header">
          <h2>Recent Tasks</h2>
          <button className="add-task-btn">
            <FaPlus /> Add Task
          </button>
        </div>
        <div className="tasks-list">
          {recentTasks.map((task) => (
            <div key={task.id} className={`task-item ${task.status}`}>
              <span className="task-title">{task.title}</span>
              <span className="task-status">{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
