import type { FilterType } from '../types/todo';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export function TodoFilter({
  filter,
  onFilterChange,
  totalCount,
  activeCount,
  completedCount,
  onClearCompleted,
}: TodoFilterProps) {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: totalCount },
    { key: 'active', label: '進行中', count: activeCount },
    { key: 'completed', label: '已完成', count: completedCount },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      padding: '16px',
      borderRadius: '12px',
      backgroundColor: '#1e293b',
      border: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: filter === key ? '#6366f1' : 'transparent',
              color: filter === key ? 'white' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {label} <span style={{ opacity: 0.7 }}>({count})</span>
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '14px',
            textAlign: 'left'
          }}
        >
          清除已完成
        </button>
      )}
    </div>
  );
}
