import React from 'react';
import * as Icons from 'lucide-react';
import { NAV_CONFIG } from '../../data/navConfig.js';
import { useApp } from '../../context/AppContext.jsx';

export default function MobileTabBar({ activeScreen, onNavigate }) {
  const { currentRole } = useApp();
  const items = NAV_CONFIG[currentRole] || [];

  // Icon-only in mobile — full labels stay on the desktop Sidebar. With no
  // text to fall back on, the active tab needs a stronger visual cue than
  // color alone, hence the underline dot.
  return (
    <div className="absolute bottom-0 left-0 right-0 flex border-t border-nz-border bg-white">
      {items.map((item) => {
        const Icon = Icons[item.icon] || Icons.Circle;
        const active = activeScreen === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            title={item.label}
            aria-label={item.label}
            className={`flex flex-1 flex-col items-center gap-1 py-3 ${active ? 'text-nz-blue' : 'text-slate-400'}`}
          >
            <Icon size={21} />
            <span className={`h-1 w-1 rounded-full ${active ? 'bg-nz-blue' : 'bg-transparent'}`} />
          </button>
        );
      })}
    </div>
  );
}
