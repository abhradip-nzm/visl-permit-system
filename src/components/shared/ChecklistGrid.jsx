import React from 'react';
import { Check, ChevronDown } from 'lucide-react';

// Flat multi-column checkbox grid, used for Sections A/C/D/F.
export function CheckboxGrid({ items, selected, onToggle, columns = 2 }) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2'}`}>
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            type="button"
            onClick={() => onToggle(item)}
            className={`flex items-start gap-1.5 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors ${
              active ? 'border-nz-blue bg-nz-blue-light text-nz-blue-dark' : 'border-nz-border bg-white text-slate-600'
            }`}
          >
            <span className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border ${active ? 'border-nz-blue bg-nz-blue text-white' : 'border-slate-300'}`}>
              {active && <Check size={11} />}
            </span>
            {item}
          </button>
        );
      })}
    </div>
  );
}

// Collapsible group wrapper used for Section E's risk-control categories.
export function Accordion({ title, badge, defaultOpen = false, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-nz-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between bg-nz-surface px-3 py-2.5 text-left text-sm font-semibold text-nz-navy"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge > 0 && <span className="rounded-full bg-nz-blue px-1.5 py-0.5 text-[10px] font-bold text-white">{badge}</span>}
        </span>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="border-t border-nz-border bg-white p-3">{children}</div>}
    </div>
  );
}
