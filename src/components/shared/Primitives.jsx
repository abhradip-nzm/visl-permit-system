import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Lock } from 'lucide-react';

export function StatusBadge({ status }) {
  const map = {
    draft: ['Draft', 'bg-slate-100 text-slate-600 border-slate-200'],
    'pending-approval': ['Awaiting Approval', 'bg-nz-amber-light text-nz-amber border-nz-amber/30'],
    approved: ['Approved', 'bg-nz-green-light text-nz-green border-nz-green/30'],
    rejected: ['Rejected', 'bg-nz-red-light text-nz-red border-nz-red/30'],
    issued: ['Issued', 'bg-nz-blue-light text-nz-blue border-nz-blue/30'],
    active: ['Active', 'bg-nz-blue-light text-nz-blue border-nz-blue/30'],
    blocked: ['Blocked', 'bg-nz-red-light text-nz-red border-nz-red/30'],
    'closure-due': ['Closure Due', 'bg-nz-orange-light text-nz-orange border-nz-orange/30'],
    closed: ['Closed', 'bg-slate-100 text-slate-500 border-slate-200']
  };
  const [label, cls] = map[status] || [status, 'bg-slate-100 text-slate-600 border-slate-200'];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}

export function RiskBadge({ risk }) {
  const map = {
    high: 'bg-nz-red-light text-nz-red border-nz-red/30',
    medium: 'bg-nz-amber-light text-nz-amber border-nz-amber/30',
    low: 'bg-nz-green-light text-nz-green border-nz-green/30'
  };
  if (!risk) return null;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${map[risk] || ''}`}>
      {risk} risk
    </span>
  );
}

export function Card({ children, className = '', ...props }) {
  return (
    <div className={`rounded-xl2 border border-nz-border bg-white shadow-card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-ring disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-5 py-3 text-base' };
  const variants = {
    primary: 'bg-nz-blue text-white hover:bg-nz-blue-dark',
    orange: 'bg-nz-orange text-white hover:brightness-95',
    danger: 'bg-nz-red text-white hover:brightness-95',
    success: 'bg-nz-green text-white hover:brightness-95',
    ghost: 'bg-transparent text-nz-blue hover:bg-nz-blue-light',
    outline: 'bg-white text-slate-700 border border-nz-border hover:bg-nz-surface',
    subtle: 'bg-nz-surface text-slate-700 hover:bg-slate-200'
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function WarningBanner({ text, tone = 'red', onAcknowledge, acknowledged }) {
  const tones = {
    red: 'bg-nz-red-light border-nz-red/30 text-nz-red',
    amber: 'bg-nz-amber-light border-nz-amber/30 text-nz-amber'
  };
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-3 ${tones[tone]} ${acknowledged ? 'opacity-60' : ''}`}>
      <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
      <div className="flex-1 text-sm font-medium text-slate-700">{text}</div>
      {onAcknowledge && (
        <button
          onClick={onAcknowledge}
          disabled={acknowledged}
          className="flex-shrink-0 rounded-md border border-current/30 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-70"
        >
          {acknowledged ? (
            <span className="flex items-center gap-1 text-nz-green"><CheckCircle2 size={13} /> Acknowledged</span>
          ) : (
            'Acknowledge'
          )}
        </button>
      )}
    </div>
  );
}

export function InfoNote({ children }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-nz-blue-light p-3 text-sm text-nz-blue-dark">
      <Info size={16} className="mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-nz-orange/40 bg-nz-orange-light px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-nz-orange">
      Mock / Demo Data
    </span>
  );
}

export function SectionLabel({ children }) {
  return <div className="mb-2 text-xs font-bold uppercase tracking-wide text-nz-slate">{children}</div>;
}

export function EmptyState({ icon: Icon = Lock, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-dashed border-nz-border bg-white py-12 text-center">
      <Icon size={28} className="text-slate-300" />
      <div className="text-sm font-semibold text-slate-500">{title}</div>
      {subtitle && <div className="max-w-xs text-xs text-slate-400">{subtitle}</div>}
    </div>
  );
}

export function ToastHost({ toasts, contained = false }) {
  return (
    <div
      className={`${contained ? 'absolute bottom-20' : 'fixed bottom-5'} left-1/2 z-[100] flex w-[90%] -translate-x-1/2 flex-col items-center gap-2`}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slideUp flex items-center gap-2 rounded-lg px-4 py-2.5 text-center text-sm font-semibold shadow-panel ${
            t.tone === 'success' ? 'bg-nz-charcoal text-nz-navy' : t.tone === 'error' ? 'bg-nz-red text-white' : 'bg-slate-800 text-white'
          }`}
        >
          <CheckCircle2 size={16} className="flex-shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function SignaturePad({ signed, onSign, label = 'Sign to confirm' }) {
  return (
    <div className="rounded-lg border border-dashed border-nz-border bg-nz-surface p-4">
      <div className="mb-2 text-xs font-semibold text-nz-slate">Digital Signature</div>
      {signed ? (
        <div className="flex items-center justify-between rounded-md border border-nz-green/30 bg-nz-green-light px-3 py-3">
          <span className="font-signature text-lg italic text-nz-navy" style={{ fontFamily: 'cursive' }}>
            {signed.name}
          </span>
          <span className="text-xs text-nz-green">{signed.timestamp}</span>
        </div>
      ) : (
        <button
          onClick={onSign}
          className="flex h-14 w-full items-center justify-center rounded-md border-2 border-dashed border-nz-blue/40 text-sm font-semibold text-nz-blue hover:bg-nz-blue-light focus-ring"
        >
          {label}
        </button>
      )}
    </div>
  );
}
