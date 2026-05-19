import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

export default function TaskForm({ task, categories, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category_id: '',
    due_date: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        category_id: task.category_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = task ? `${API_BASE}/tasks/${task.id}` : `${API_BASE}/tasks`;
      const method = task ? 'PUT' : 'POST';
      
      const payload = { ...formData };
      if (!payload.category_id) payload.category_id = null;
      if (!payload.due_date) payload.due_date = null;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (data.success) {
        onSuccess();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Failed to save task', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.5rem' }}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input 
              type="text" 
              name="title" 
              className="form-control" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-control" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Add details..."
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select name="status" className="form-control" value={formData.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Priority</label>
              <select name="priority" className="form-control" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Category</label>
              <select name="category_id" className="form-control" value={formData.category_id} onChange={handleChange}>
                <option value="">None</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Due Date</label>
              <input 
                type="date" 
                name="due_date" 
                className="form-control" 
                value={formData.due_date} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
            <button type="button" className="btn-icon" style={{ width: 'auto', padding: '0 20px', borderRadius: '8px' }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
