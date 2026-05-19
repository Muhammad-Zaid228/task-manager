import React from 'react';
import { LayoutDashboard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Sidebar({ categories, stats, activeCategory, setActiveCategory }) {
  return (
    <aside className="sidebar">
      <h2>
        <LayoutDashboard className="text-accent" />
        TaskFlow
      </h2>

      {stats && (
        <div className="stats-container">
          <div className="stat-card glass-panel" style={{ '--glass-bg': 'rgba(16, 185, 129, 0.1)' }}>
            <span className="stat-label">Completed</span>
            <span className="stat-value" style={{ color: 'var(--accent-success)' }}>{stats.completed}</span>
          </div>
          <div className="stat-card glass-panel" style={{ '--glass-bg': 'rgba(245, 158, 11, 0.1)' }}>
            <span className="stat-label">Pending</span>
            <span className="stat-value" style={{ color: 'var(--accent-warning)' }}>{stats.pending}</span>
          </div>
        </div>
      )}

      <div>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.05em' }}>
          Categories
        </h3>
        <div className="category-list">
          <button 
            className={`category-item ${activeCategory === null ? 'glass-panel' : ''}`}
            onClick={() => setActiveCategory(null)}
            style={{ textAlign: 'left', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="category-dot" style={{ background: 'var(--text-secondary)' }}></div>
              <span>All Tasks</span>
            </div>
            {stats && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stats.total}</span>}
          </button>
          
          {categories.map(cat => (
            <button 
              key={cat.id}
              className={`category-item ${activeCategory === cat.id ? 'glass-panel' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              style={{ textAlign: 'left', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="category-dot" style={{ background: cat.color }}></div>
                <span>{cat.name}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cat.task_count}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
