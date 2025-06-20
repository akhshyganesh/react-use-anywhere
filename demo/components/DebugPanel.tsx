import React, { useState, useEffect, useRef } from 'react';
import { useHook } from '../../lib';

interface LogEntry {
  id: number;
  timestamp: string;
  type: 'service_call' | 'context_update' | 'data_sync';
  message: string;
  data?: any;
}

interface DebugPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ logs, onClear }) => {
  const theme = useHook<{ theme: string; isDark: boolean }>('theme');
  const auth = useHook<{ user: any; isAuthenticated: boolean }>('auth');
  
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'service_call' | 'context_update' | 'data_sync'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newLogIds, setNewLogIds] = useState<Set<number>>(new Set());
  const [autoScroll, setAutoScroll] = useState(true);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const previousLogsLength = useRef(logs.length);

  // Track new logs for animation
  useEffect(() => {
    if (logs.length > previousLogsLength.current) {
      const newIds = logs.slice(previousLogsLength.current).map(log => log.id);
      setNewLogIds(prev => new Set([...prev, ...newIds]));
      
      // Remove highlight after animation
      setTimeout(() => {
        setNewLogIds(prev => {
          const updated = new Set(prev);
          newIds.forEach(id => updated.delete(id));
          return updated;
        });
      }, 2000);
    }
    previousLogsLength.current = logs.length;
  }, [logs]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs
    .filter(log => filter === 'all' || log.type === filter)
    .filter(log => 
      searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.data).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .reverse(); // Show latest first

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'service_call': return '🔧';
      case 'context_update': return '📡';
      case 'data_sync': return '🔄';
      default: return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'service_call': return '#28a745';
      case 'context_update': return '#17a2b8';
      case 'data_sync': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getTypeBgColor = (type: string) => {
    if (theme?.isDark) {
      switch (type) {
        case 'service_call': return '#1a4d1a';
        case 'context_update': return '#1a3d4d';
        case 'data_sync': return '#4d3d1a';
        default: return '#333';
      }
    } else {
      switch (type) {
        case 'service_call': return '#d4edda';
        case 'context_update': return '#d1ecf1';
        case 'data_sync': return '#fff3cd';
        default: return '#f8f9fa';
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      width: isExpanded ? '500px' : '250px',
      height: isExpanded ? '600px' : '60px',
      backgroundColor: theme?.isDark ? '#1a1a1a' : '#ffffff',
      border: `2px solid ${theme?.isDark ? '#444' : '#e0e0e0'}`,
      borderRadius: '12px',
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div 
        style={{
          padding: '1rem',
          backgroundColor: theme?.isDark ? '#2d2d2d' : '#f8f9fa',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: isExpanded ? `2px solid ${theme?.isDark ? '#444' : '#e0e0e0'}` : 'none',
          background: `linear-gradient(135deg, ${theme?.isDark ? '#2d2d2d' : '#f8f9fa'} 0%, ${theme?.isDark ? '#3d3d3d' : '#ffffff'} 100%)`
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: logs.length > 0 ? '#28a745' : '#6c757d',
            animation: logs.length > previousLogsLength.current ? 'pulse 1s ease-in-out' : 'none'
          }} />
          <span style={{ fontWeight: 'bold', fontSize: '1rem', whiteSpace: 'nowrap' }}>
            🔍 Live Debug Panel
          </span>
          <span style={{ 
            fontSize: '0.8rem', 
            backgroundColor: theme?.isDark ? '#444' : '#e9ecef',
            padding: '0.2rem 0.5rem',
            borderRadius: '12px',
            fontWeight: 'bold'
          }}>
            {logs.length}
          </span>
        </div>
        <div style={{ 
          fontSize: '1.2rem',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }}>
          ▲
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {/* Controls */}
          <div style={{
            padding: '1rem',
            backgroundColor: theme?.isDark ? '#252525' : '#f1f3f4',
            borderBottom: `1px solid ${theme?.isDark ? '#444' : '#e0e0e0'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            
            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['all', 'service_call', 'context_update', 'data_sync'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: filter === type ? getTypeColor(type) : (theme?.isDark ? '#444' : '#e9ecef'),
                    color: filter === type ? '#fff' : (theme?.isDark ? '#ccc' : '#666'),
                    transition: 'all 0.2s ease'
                  }}
                >
                  {getTypeIcon(type)} {type.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Controls row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                />
                Auto-scroll
              </label>
              <button
                onClick={onClear}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.3rem 0.6rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                🗑️ Clear ({logs.length})
              </button>
            </div>
          </div>

          {/* Current State */}
          <div style={{
            padding: '1rem',
            fontSize: '0.9rem',
            backgroundColor: theme?.isDark ? '#1f1f1f' : '#f8f9fa',
            borderBottom: `1px solid ${theme?.isDark ? '#444' : '#e0e0e0'}`,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div style={{ 
              padding: '0.5rem',
              backgroundColor: theme?.isDark ? '#2a2a2a' : '#ffffff',
              borderRadius: '6px',
              border: `1px solid ${theme?.isDark ? '#444' : '#e0e0e0'}`
            }}>
              <strong>🎨 Theme:</strong>
              <div style={{ color: getTypeColor('context_update') }}>
                {theme?.theme || 'loading...'}
              </div>
            </div>
            <div style={{ 
              padding: '0.5rem',
              backgroundColor: theme?.isDark ? '#2a2a2a' : '#ffffff',
              borderRadius: '6px',
              border: `1px solid ${theme?.isDark ? '#444' : '#e0e0e0'}`
            }}>
              <strong>👤 User:</strong>
              <div style={{ color: getTypeColor('service_call') }}>
                {auth?.isAuthenticated ? auth.user?.name : 'Not logged in'}
              </div>
            </div>
          </div>

          {/* Logs */}
          <div 
            ref={logsContainerRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0.5rem'
            }}
          >
            {filteredLogs.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#888',
                fontSize: '0.9rem'
              }}>
                {searchTerm ? '🔍 No logs match your search' : '✨ No activity yet. Click buttons to see the magic!'}
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    fontSize: '0.85rem',
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: getTypeBgColor(log.type),
                    borderLeft: `4px solid ${getTypeColor(log.type)}`,
                    borderRadius: '8px',
                    transition: 'all 0.3s ease',
                    transform: newLogIds.has(log.id) ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: newLogIds.has(log.id) ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.05)',
                    border: newLogIds.has(log.id) ? `2px solid ${getTypeColor(log.type)}` : '1px solid transparent',
                    animation: newLogIds.has(log.id) ? 'slideIn 0.5s ease-out' : 'none'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.1rem' }}>
                        {getTypeIcon(log.type)}
                      </span>
                      {log.type.replace('_', ' ').toUpperCase()}
                      {newLogIds.has(log.id) && (
                        <span style={{ 
                          fontSize: '0.7rem',
                          backgroundColor: getTypeColor(log.type),
                          color: '#fff',
                          padding: '0.1rem 0.3rem',
                          borderRadius: '4px',
                          animation: 'pulse 2s ease-in-out'
                        }}>
                          NEW
                        </span>
                      )}
                    </div>
                    <div style={{ 
                      color: '#666', 
                      fontSize: '0.75rem',
                      fontFamily: 'monospace'
                    }}>
                      {log.timestamp}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {log.message}
                  </div>
                  
                  {log.data && (
                    <details style={{ marginTop: '0.5rem' }}>
                      <summary style={{ 
                        cursor: 'pointer', 
                        fontSize: '0.8rem',
                        padding: '0.25rem',
                        backgroundColor: theme?.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        📊 View Data ({Object.keys(log.data || {}).length} properties)
                      </summary>
                      <pre style={{ 
                        fontSize: '0.75rem', 
                        marginTop: '0.5rem',
                        backgroundColor: theme?.isDark ? '#111' : '#f8f9fa',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        overflow: 'auto',
                        border: `1px solid ${theme?.isDark ? '#333' : '#e0e0e0'}`,
                        textAlign: 'left',
                        maxHeight: '200px'
                      }}>
                        {JSON.stringify(log.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes slideIn {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
