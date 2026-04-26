import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type TabOption<T extends string> = {
  id: T
  label: string
  content: ReactNode
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
  columns = 3,
  className,
}: {
  value: T
  onChange: (next: T) => void
  options: Array<TabOption<T>>
  columns?: 2 | 3 | 4
  className?: string
}) {
  return (
    <div className={cn('grid gap-3', className)}>
      <div
        className={cn(
          'grid gap-2 rounded-2xl border border-slate-200 bg-white p-2',
          columns === 2 && 'grid-cols-2',
          columns === 3 && 'grid-cols-3',
          columns === 4 && 'grid-cols-4',
        )}
      >
        {options.map((o) => {
          const active = o.id === value
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={cn(
                'h-10 rounded-xl px-3 text-sm font-semibold transition-colors',
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100',
              )}
            >
              {o.label}
            </button>
          )
        })}
      </div>

      <div>{options.find((o) => o.id === value)?.content}</div>
    </div>
  )
}

