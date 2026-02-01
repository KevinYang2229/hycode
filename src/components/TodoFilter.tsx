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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
      <div className="flex items-center gap-2">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            {label}
            <span className="ml-1.5 text-xs opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          className="px-4 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)] transition-all duration-200"
        >
          清除已完成
        </button>
      )}
    </div>
  );
}
