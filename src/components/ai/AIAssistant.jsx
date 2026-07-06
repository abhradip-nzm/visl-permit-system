import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { aiAssistant, matchIntent } from '../../data/aiAssistantData.js';
import { ROLE_LABELS } from '../../data/navConfig.js';

function formatInline(text, keyPrefix = '') {
  // Minimal markdown: **bold** and *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={key} className="font-bold text-nz-navy">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

// Detects inline numbered steps like "1) Do X, 2) Do Y, 3) Do Z" and
// renders them as an ordered list instead of one dense paragraph.
function formatReply(text) {
  const stepPattern = /\d+\)\s/g;
  const stepMatches = text.match(stepPattern);
  if (stepMatches && stepMatches.length >= 2) {
    const introEnd = text.search(stepPattern);
    const intro = text.slice(0, introEnd).trim();
    const stepsBlock = text.slice(introEnd);
    const steps = stepsBlock
      .split(/\d+\)\s/)
      .filter(Boolean)
      .map((s) => s.replace(/,\s*$/, '').trim());
    return (
      <>
        {intro && <div className="mb-1.5">{formatInline(intro, 'intro')}</div>}
        <ol className="list-decimal space-y-1 pl-4">
          {steps.map((s, i) => (
            <li key={i}>{formatInline(s, `step-${i}`)}</li>
          ))}
        </ol>
      </>
    );
  }
  return <>{formatInline(text)}</>;
}

export default function AIAssistant({ contained = false }) {
  const { currentRole, aiOpen, setAiOpen } = useApp();
  const [messagesByRole, setMessagesByRole] = useState({});
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const roleData = aiAssistant[currentRole];
  const messages = messagesByRole[currentRole] || [];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing, aiOpen]);

  if (!currentRole || !roleData) return null;

  function sendMessage(text) {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessagesByRole((prev) => ({ ...prev, [currentRole]: [...(prev[currentRole] || []), userMsg] }));
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = matchIntent(currentRole, text);
      setMessagesByRole((prev) => ({
        ...prev,
        [currentRole]: [...(prev[currentRole] || []), { id: Date.now() + 1, sender: 'ai', text: reply }]
      }));
      setTyping(false);
    }, 900 + Math.random() * 500);
  }

  return (
    <>
      {/* Floating button — raised clear of the bottom tab bar when contained inside the phone frame */}
      <button
        onClick={() => setAiOpen(true)}
        className={`${contained ? 'absolute bottom-20 right-5' : 'fixed bottom-6 right-6'} z-40 flex items-center gap-2 rounded-full bg-nz-orange ${
          contained ? 'p-3.5' : 'px-5 py-3.5'
        } font-semibold text-white shadow-panel transition-transform hover:scale-105 focus-ring ${
          aiOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <Sparkles size={18} />
        {!contained && 'Ask AI'}
      </button>

      {/* Drawer — parent already clips to the phone's rounded corners via overflow-hidden */}
      {aiOpen && (
        <div
          className={`${contained ? 'absolute' : 'fixed'} inset-0 z-50 flex justify-end bg-black/20 animate-fadeIn`}
          onClick={() => setAiOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`flex h-full flex-col bg-white shadow-2xl animate-slideInRight ${contained ? 'w-full' : 'w-full max-w-md'}`}
          >
            <div className="flex items-center justify-between border-b border-nz-border bg-nz-charcoal px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nz-orange">
                  <Bot size={18} />
                </div>
                <div>
                  <div className="text-sm font-bold">Vedanta AI</div>
                  <div className="text-xs text-white/50">{ROLE_LABELS[currentRole]}</div>
                </div>
              </div>
              <button onClick={() => setAiOpen(false)} className="rounded-full p-1.5 hover:bg-white/10 focus-ring">
                <X size={18} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-nz-surface px-5 py-5">
              <div className="rounded-lg border border-nz-border bg-white p-3 text-xs text-slate-500">
                <Sparkles size={13} className="mb-1 inline text-nz-orange" /> Responses are generated from mock demo
                data for illustration. No live model or system is called in this prototype.
              </div>

              {messages.length === 0 && (
                <div className="text-sm text-slate-500">
                  Hi, I'm your role-aware assistant. Ask me anything about your permits, or try a suggestion below.
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-nz-blue text-white'
                        : 'border border-nz-border bg-white text-slate-700 shadow-card'
                    }`}
                  >
                    {formatReply(m.text)}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-xl border border-nz-border bg-white px-4 py-3 shadow-card">
                    <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-slate-400" />
                    <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-slate-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulseSoft rounded-full bg-slate-400 [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-nz-border px-5 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {roleData.chips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="rounded-full border border-nz-blue/30 bg-nz-blue-light px-3 py-1.5 text-xs font-medium text-nz-blue hover:bg-nz-blue/10 focus-ring"
                  >
                    {chip}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your permits…"
                  className="flex-1 rounded-lg border border-nz-border bg-nz-surface px-3.5 py-2.5 text-sm focus-ring focus:bg-white"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-nz-orange text-white hover:brightness-95 focus-ring"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
