import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TaskBoard from './components/TaskBoard';

const API_BASE = import.meta.env.VITE_API_URL ? (import.meta.env.VITE_API_URL + '/api') : (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api');

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchTasks = async () => {
    try {
      let url = `${API_BASE}/tasks`;
      if (activeCategory) {
        url += `?category_id=${activeCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setTasks(data.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/tasks/stats`);
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const refreshAll = () => {
    fetchTasks();
    fetchCategories();
    fetchStats();
  };

  useEffect(() => {
    refreshAll();
  }, [activeCategory]);

  return (
    <div className="app-container">
      <Sidebar 
        categories={categories} 
        stats={stats} 
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div className="main-content">
        <TaskBoard 
          tasks={tasks} 
          categories={categories}
          refreshAll={refreshAll} 
        />
      </div>
    </div>
  );
}

export default App;
