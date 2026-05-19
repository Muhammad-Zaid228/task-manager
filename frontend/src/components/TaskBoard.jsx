import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Plus, MoreVertical, Calendar, Flag, Check, Clock, Edit2, Trash2 } from 'lucide-react';
import TaskForm from './TaskForm';

const API_BASE = 'http://localhost:5000/api';

export default function TaskBoard({ tasks, categories, refreshAll }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await fetch(`${API_BASE}/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      refreshAll();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, { method: 'DELETE' });
      refreshAll();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--accent-danger)';
      case 'medium': return 'var(--accent-warning)';
      case 'low': return 'var(--accent-success)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <>
      <div className="task-header">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Good Morning, Zaid</h1>
          <p style={{ color: 'var(--text-secondary)' }}>You have {tasks.filter(t => t.status !== 'completed').length} tasks to complete.</p>
        </div>
        <button className="btn-primary" onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
          <Plus size={20} /> New Task
        </button>
      </div>

      <div className="filters-row">
        {['all', 'pending', 'in_progress', 'completed'].map(f => (
          <button 
            key={f}
            className={`filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="tasks-grid">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-card glass-panel" style={{ '--category-color': task.category_color || 'var(--accent-primary)' }}>
            <div className="task-header-row">
              <div style={{ flex: 1, paddingRight: '16px' }}>
                <h3 className="task-title" style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none', color: task.status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                  {task.title}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {task.status !== 'completed' && (
                  <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => handleStatusChange(task.id, 'completed')} title="Mark complete">
                    <Check size={14} />
                  </button>
                )}
                <button className="btn-icon" style={{ width: '28px', height: '28px' }} onClick={() => openEdit(task)}>
                  <Edit2 size={14} />
                </button>
                <button className="btn-icon" style={{ width: '28px', height: '28px', color: 'var(--accent-danger)' }} onClick={() => handleDelete(task.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {task.description && (
              <p className="task-desc">{task.description}</p>
            )}

            <div className="task-meta">
              {task.due_date && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  <span>{format(parseISO(task.due_date), 'MMM d, yyyy')}</span>
                </div>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: getPriorityColor(task.priority) }}>
                <Flag size={14} />
                <span style={{ textTransform: 'capitalize' }}>{task.priority}</span>
              </div>
              
              <div style={{ marginLeft: 'auto' }}>
                <span className={`badge badge-${task.status}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <p>No tasks found. Create a new one to get started!</p>
          </div>
        )}
      </div>

      {isFormOpen && (
        <TaskForm 
          task={editingTask} 
          categories={categories}
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => { setIsFormOpen(false); refreshAll(); }} 
        />
      )}
    </>
  );
}
