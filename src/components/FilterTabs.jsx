import { FILTERS } from '../lib/filters'

export function FilterTabs({ value, onChange, counts }) {
  const index = Math.max(
    0,
    FILTERS.findIndex((filter) => filter.id === value),
  )

  return (
    <div
      role="tablist"
      aria-label="Фильтр задач"
      className="relative grid grid-cols-3 gap-1 rounded-xl bg-slate-200/60 p-1 dark:bg-white/5"
    >
      {/* Подложка активной вкладки — едет между колонками. */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-slate-700"
        style={{
          width: `calc((100% - 1rem) / 3)`,
          transform: `translateX(calc(${index} * (100% + 0.25rem)))`,
        }}
      />
      {FILTERS.map((filter) => {
        const selected = filter.id === value
        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(filter.id)}
            className={`relative z-10 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
              selected
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {filter.label}
            <span className="text-xs tabular-nums opacity-60">{counts[filter.id]}</span>
          </button>
        )
      })}
    </div>
  )
}
