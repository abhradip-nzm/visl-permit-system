import React from 'react';
import * as Icons from 'lucide-react';
import { NAV_CONFIG } from '../../data/navConfig.js';
import { useApp } from '../../context/AppContext.jsx';

export default function MobileTabBar({ activeScreen, onNavigate }) {
  const { currentRole } = useApp();
  const items = NAV_CONFIG[currentRole] || [];

  return (
    <div className="absolute bottom-0 left-0 right-0 flex overflow-x-auto border-t border-nz-border bg-white">
      {items.map((item) => {
        const Icon = Icons[item.icon] || Icons.Circle;
        const active = activeScreen === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex min-w-[68px] flex-1 flex-shrink-0 flex-col items-center gap-1 whitespace-nowrap px-1.5 py-2.5 text-[10px] font-semibold ${
              active ? 'text-nz-blue' : 'text-slate-400'
            }`}
          >
            <Icon size={19} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
