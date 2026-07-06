import React from 'react';
import { Signal, Wifi, BatteryFull } from 'lucide-react';

export default function PhoneFrame({ children, statusLabel = '', overlay = null }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-nz-charcoal/5 p-6">
      {/* This outer phone body is the positioning root ("relative") that the
          overlay (AI assistant drawer, toasts) anchors to via "absolute",
          so those elements stay confined to the phone mockup instead of
          floating over the whole browser viewport. */}
      <div className="relative flex h-[780px] w-[380px] flex-col overflow-hidden rounded-[2.2rem] border-[6px] border-nz-charcoal bg-white shadow-phone">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-20 h-5 w-32 -translate-x-1/2 rounded-b-xl bg-nz-charcoal" />
        {/* Status bar */}
        <div className="flex items-center justify-between bg-nz-charcoal px-6 pb-1.5 pt-2 text-[11px] font-semibold text-white">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryFull size={14} />
          </div>
        </div>
        {statusLabel && (
          <div className="bg-nz-charcoal px-4 pb-2 text-center text-[10px] font-bold uppercase tracking-wide text-white/70">
            {statusLabel}
          </div>
        )}
        <div className="flex-1 overflow-y-auto bg-nz-surface">{children}</div>
        {overlay}
      </div>
    </div>
  );
}
