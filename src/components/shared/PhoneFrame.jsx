import React from 'react';
import { Signal, Wifi, BatteryFull } from 'lucide-react';

// On a real narrow device the actual browser viewport IS the phone — there's
// no room (or need) for a decorative bezel, so below the `sm` breakpoint this
// renders full-bleed (no border/rounding/notch/fake status bar). At `sm` and
// above (i.e. someone toggling "Mobile View" on a wide desktop browser) it
// renders as a fixed-size phone mockup, which is the only case a decorative
// frame around it actually makes sense.
export default function PhoneFrame({ children, statusLabel = '', overlay = null }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-nz-charcoal/5 sm:p-6">
      {/* This phone body is the positioning root ("relative") that the
          overlay (AI assistant drawer, toasts) anchors to via "absolute",
          so those elements stay confined to the phone mockup instead of
          floating over the whole browser viewport. */}
      <div className="relative flex h-full w-full flex-col overflow-hidden bg-white sm:h-[780px] sm:w-[380px] sm:rounded-[2.2rem] sm:border-[6px] sm:border-nz-charcoal sm:shadow-phone">
        {/* Notch — desktop-mockup only */}
        <div className="absolute left-1/2 top-0 z-20 hidden h-5 w-32 -translate-x-1/2 rounded-b-xl bg-nz-charcoal sm:block" />
        {/* Status bar — desktop-mockup only; a real device already has its own */}
        <div className="hidden items-center justify-between bg-nz-charcoal px-6 pb-1.5 pt-2 text-[11px] font-semibold text-nz-navy sm:flex">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryFull size={14} />
          </div>
        </div>
        {statusLabel && (
          <div className="hidden bg-nz-charcoal px-4 pb-2 text-center text-[10px] font-bold uppercase tracking-wide text-slate-500 sm:block">
            {statusLabel}
          </div>
        )}
        <div className="flex-1 overflow-y-auto bg-nz-surface">{children}</div>
        {overlay}
      </div>
    </div>
  );
}
