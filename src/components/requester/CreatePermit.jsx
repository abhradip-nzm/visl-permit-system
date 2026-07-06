import React, { useState } from 'react';
import { Type, Mic, ScanLine, Hash, ArrowLeft, Sparkles, Square } from 'lucide-react';
import { NLP_SAMPLE_PARSE, OCR_SAMPLE_EXTRACTION } from '../../data/mockData.js';
import { Button, Card } from '../shared/Primitives.jsx';
import { useApp } from '../../context/AppContext.jsx';
import NLPPrefilledForm from './NLPPrefilledForm.jsx';

const MODES = [
  { key: 'nlp', label: 'Type', sub: 'Describe the job in plain language', icon: Type },
  { key: 'voice', label: 'Speak', sub: 'Voice input, hands-free', icon: Mic },
  { key: 'ocr', label: 'Scan', sub: 'Digitize a legacy paper permit', icon: ScanLine },
  { key: 'sap', label: 'SAP PM Order #', sub: 'Auto-populate from a work order', icon: Hash }
];

export default function CreatePermit({ navigate }) {
  const [step, setStep] = useState('select'); // select | nlp | voice | ocr | sap | form
  const [prefillSource, setPrefillSource] = useState(null);

  if (step === 'form') {
    return <NLPPrefilledForm source={prefillSource} navigate={navigate} onBack={() => setStep('select')} />;
  }

  return (
    <div className="px-4 py-4">
      <button
        onClick={() => (step === 'select' ? navigate('mypermits') : setStep('select'))}
        className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-slate-500"
      >
        <ArrowLeft size={15} /> {step === 'select' ? 'Back to My Permits' : 'Back to input options'}
      </button>

      {step === 'select' && (
        <>
          <h2 className="mb-1 text-lg font-bold text-nz-navy">Create Permit</h2>
          <p className="mb-5 text-sm text-slate-500">Choose how you'd like to start this permit.</p>
          <div className="grid grid-cols-2 gap-3">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setStep(m.key)}
                className="flex flex-col items-start gap-2 rounded-xl2 border border-nz-border bg-white p-4 text-left shadow-card active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nz-blue-light text-nz-blue">
                  <m.icon size={19} />
                </div>
                <div className="font-bold text-nz-navy">{m.label}</div>
                <div className="text-xs leading-snug text-slate-400">{m.sub}</div>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 'nlp' && (
        <NLPInputStep onBack={() => setStep('select')} onParsed={() => { setPrefillSource('nlp'); setStep('form'); }} />
      )}
      {step === 'voice' && (
        <VoiceInputStep onBack={() => setStep('select')} onParsed={() => { setPrefillSource('voice'); setStep('form'); }} />
      )}
      {step === 'ocr' && (
        <OCRInputStep onBack={() => setStep('select')} onParsed={() => { setPrefillSource('ocr'); setStep('form'); }} />
      )}
      {step === 'sap' && (
        <SAPInputStep onBack={() => setStep('select')} onParsed={() => { setPrefillSource('sap'); setStep('form'); }} />
      )}
    </div>
  );
}

function NLPInputStep({ onBack, onParsed }) {
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);

  function parse() {
    setParsing(true);
    setTimeout(onParsed, 1100);
  }

  return (
    <Card className="p-4">
      <div className="mb-2 text-sm font-bold text-nz-navy">Describe the job</div>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="e.g. welding work on conveyor belt 7 in crushing plant tomorrow morning shift"
        className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
      />
      <button
        onClick={() => setText(NLP_SAMPLE_PARSE.inputText)}
        className="mt-2 text-xs font-semibold text-nz-blue underline"
      >
        Use sample sentence
      </button>
      <Button
        variant="primary"
        className="mt-4 w-full"
        disabled={!text.trim() || parsing}
        onClick={parse}
      >
        <Sparkles size={15} /> {parsing ? 'Parsing with NLP…' : 'Parse & Pre-fill Permit'}
      </Button>
    </Card>
  );
}

function VoiceInputStep({ onBack, onParsed }) {
  const [recording, setRecording] = useState(false);
  const [transcribed, setTranscribed] = useState(false);

  function record() {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setTranscribed(true);
    }, 1600);
  }

  return (
    <Card className="p-4">
      <div className="mb-4 text-sm font-bold text-nz-navy">Voice Input</div>
      <div className="flex flex-col items-center gap-4 py-4">
        <button
          onClick={record}
          disabled={recording}
          className={`flex h-20 w-20 items-center justify-center rounded-full ${
            recording ? 'bg-nz-red animate-pulseSoft' : 'bg-nz-blue'
          } text-white shadow-panel`}
        >
          {recording ? <Square size={26} /> : <Mic size={26} />}
        </button>
        <div className="text-xs text-slate-400">{recording ? 'Listening…' : transcribed ? 'Transcribed' : 'Tap to speak'}</div>
        {recording && (
          <div className="flex items-end gap-1">
            {[6, 14, 20, 10, 18, 8].map((h, i) => (
              <span key={i} className="w-1.5 rounded-full bg-nz-blue/60" style={{ height: h, animation: 'pulseSoft 0.8s ease-in-out infinite', animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        )}
        {transcribed && (
          <div className="w-full rounded-lg bg-nz-surface p-3 text-sm italic text-slate-600">
            "{NLP_SAMPLE_PARSE.inputText}"
          </div>
        )}
      </div>
      <Button variant="primary" className="w-full" disabled={!transcribed} onClick={onParsed}>
        <Sparkles size={15} /> Pre-fill Permit
      </Button>
    </Card>
  );
}

function OCRInputStep({ onBack, onParsed }) {
  const [scanning, setScanning] = useState(false);
  const [extracted, setExtracted] = useState(false);

  function scan() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setExtracted(true);
    }, 1400);
  }

  return (
    <Card className="p-4">
      <div className="mb-3 text-sm font-bold text-nz-navy">Scan Legacy Permit</div>
      <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-nz-border bg-nz-surface">
        {!extracted ? (
          <button onClick={scan} disabled={scanning} className="flex flex-col items-center gap-2 text-slate-400">
            <ScanLine size={28} className={scanning ? 'animate-pulseSoft text-nz-blue' : ''} />
            <span className="text-xs font-semibold">{scanning ? 'Extracting fields…' : 'Tap to capture / upload photo'}</span>
          </button>
        ) : (
          <div className="w-full px-4 text-xs text-slate-500">
            <div className="mb-1 font-bold text-nz-navy">Extraction preview — {OCR_SAMPLE_EXTRACTION.sourceFile}</div>
            <div>Confidence: <span className="font-semibold text-nz-green">{Math.round(OCR_SAMPLE_EXTRACTION.confidence * 100)}%</span></div>
            <div>Equipment: {OCR_SAMPLE_EXTRACTION.equipment}</div>
            <div>Location: {OCR_SAMPLE_EXTRACTION.location}</div>
          </div>
        )}
      </div>
      <Button variant="primary" className="mt-4 w-full" disabled={!extracted} onClick={onParsed}>
        <Sparkles size={15} /> Use Extracted Data
      </Button>
    </Card>
  );
}

function SAPInputStep({ onBack, onParsed }) {
  const [order, setOrder] = useState('');
  const [fetched, setFetched] = useState(false);
  const { pushToast } = useApp();

  function fetchOrder() {
    setFetched(true);
    pushToast('SAP PM order fetched (mock)');
  }

  return (
    <Card className="p-4">
      <div className="mb-2 text-sm font-bold text-nz-navy">SAP PM Order Lookup</div>
      <input
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        placeholder="Enter order number e.g. 4500-9987"
        className="w-full rounded-lg border border-nz-border p-3 text-sm focus-ring"
      />
      <Button variant="outline" className="mt-3 w-full" disabled={!order.trim()} onClick={fetchOrder}>
        Fetch Order Details
      </Button>
      {fetched && (
        <div className="mt-3 rounded-lg bg-nz-surface p-3 text-xs text-slate-500">
          <div className="font-bold text-nz-navy">Order {order}</div>
          <div>Equipment: MCC-3 Drive Panel · Job Scope: Mechanical Maintenance</div>
          <div>Checklist: 6 SAP-linked items attached</div>
        </div>
      )}
      <Button variant="primary" className="mt-4 w-full" disabled={!fetched} onClick={onParsed}>
        <Sparkles size={15} /> Pre-fill Permit
      </Button>
    </Card>
  );
}
