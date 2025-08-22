import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

const CLIENTS = [
  { name: 'ACME Corp', pin: '7431', folder: 'acme' },
  { name: 'Neoterra Inc.', pin: '8190', folder: 'neoterra' },
  { name: 'Sanchez Services', pin: '1122', folder: 'sanchez' },
];

// Notion: open as a new tab via CTA (no iframe)
const NOTION_URL = 'https://apple-month-55e.notion.site/246ec2233e6f802a93aae01cf20205f3?pvs=105';

const shakeVariants = {
  still: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

// Updated button styles (tailwind-friendly)
const btnPrimary =
  'text-white font-semibold shadow-lg border-0 bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-violet,#6a5cff))] hover:opacity-95';
const btnGhost =
  'border border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]';

const STEPS = ['Intake', 'Discovery', 'Design', 'Build', 'Review', 'Handoff'] as const;
type StepName = typeof STEPS[number];

const ClientsPage = () => {
  // PIN (single box)
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const [client, setClient] = useState<{ name: string; pin: string; folder: string } | null>(null);

  // Project status tracker state (can be driven from Notion or your DB later)
  const [currentStage, setCurrentStage] = useState<StepName>('Intake');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const sanitizedPin = useMemo(() => pinValue.replace(/\D/g, '').slice(0, 4), [pinValue]);

  const attemptVerify = (candidatePin: string) => {
    if (candidatePin.length !== 4) return;
    const found = CLIENTS.find((c) => c.pin === candidatePin);
    if (found) {
      setError('');
      setShake(false);
      setClient(found);
      // (Optional) set initial stage per client if you have it
      setCurrentStage('Intake');
    } else {
      setError('Invalid PIN. Please try again or contact Jessabel.');
      setShake(true);
      setPinValue('');
      setTimeout(() => {
        setShake(false);
        inputRef.current?.focus();
      }, 450);
    }
  };

  const handlePinChange = (v: string) => {
    setError('');
    const next = v.replace(/\D/g, '').slice(0, 4);
    setPinValue(next);
    if (next.length === 4) attemptVerify(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attemptVerify(sanitizedPin);
  };

  const openUploadWidget = () => {
    if (!client) return;
    if (!window.cloudinary || !window.cloudinary.createUploadWidget) {
      setError('Upload widget not available. Please refresh the page.');
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dqqee8c51',
        uploadPreset: 'Jessabel.Art',
        folder: client.folder,
        sources: ['local', 'url', 'camera', 'google_drive'],
        multiple: true,
        maxFiles: 10,
        clientAllowedFormats: ['jpg', 'png', 'pdf', 'docx', 'zip'],
        showAdvancedOptions: false,
      },
      (err, result) => {
        if (!err && result && result.event === 'success') {
          console.log('Uploaded:', result.info.secure_url);
        }
      }
    );
    widget.open();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const resetPortal = () => {
    setClient(null);
    setPinValue('');
    setError('');
    setCurrentStage('Intake');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // ---- UI bits ----

  const Stepper = ({ current }: { current: StepName }) => {
    const idx = STEPS.indexOf(current);
    const pct = Math.max(0, (idx / (STEPS.length - 1)) * 100);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          {STEPS.map((label, i) => {
            const active = i <= idx;
            return (
              <div key={label} className="flex-1 flex items-center">
                <div
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                    active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'bg-muted text-muted-foreground',
                    'shadow-sm',
                  ].join(' ')}
                  aria-current={i === idx ? 'step' : undefined}
                  title={label}
                >
                  {i + 1}
                </div>
                {i < STEPS.length - 1 && <div className="flex-1 h-1 bg-muted mx-2 rounded" />}
              </div>
            );
          })}
        </div>

        <div className="relative h-2 bg-muted/70 rounded overflow-hidden">
          <motion.div
            className="absolute left-0 top-0 h-full bg-[hsl(var(--primary))]"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        <div className="mt-2 text-sm text-muted-foreground flex justify-between">
          <span>{STEPS[idx]}</span>
          <span>
            {idx + 1} / {STEPS.length}
          </span>
        </div>
      </div>
    );
  };

  const PinForm = () => (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl shadow-lg space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Client Postal</h1>
          <p id="pin-help" className="text-muted-foreground mt-2">
            Enter the 4-digit code we shared with you.{' '}
            <Link to="/contact" className="underline underline-offset-4">
              Don’t have a code?
            </Link>
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-muted-foreground" htmlFor="pin-box">
            Enter your 4-digit PIN
          </Label>

          <motion.div
            variants={shakeVariants}
            animate={shake ? 'shake' : 'still'}
            className="w-full"
            aria-describedby="pin-help"
          >
            <Input
              id="pin-box"
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={sanitizedPin}
              onChange={(e) => handlePinChange(e.target.value)}
              onFocus={(e) => e.currentTarget.select()}
              placeholder="••••"
              autoComplete="one-time-code"
              className="h-14 text-2xl tracking-[0.6em] text-center"
              aria-label="PIN code"
            />
          </motion.div>
        </div>

        {error && (
          <p className="text-sm text-destructive font-semibold text-center" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <div className="flex gap-3 justify-center pt-2">
          <Button type="submit" size="lg" className={btnPrimary}>
            Unlock Portal
          </Button>
          <Button
            type="button"
            variant="ghost"
            className={btnGhost}
            onClick={() => {
              setPinValue('');
              setError('');
              inputRef.current?.focus();
            }}
          >
            Clear
          </Button>
        </div>
      </form>
    </motion.div>
  );

  const WelcomeCard = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl"
    >
      <div className="glass p-8 rounded-2xl shadow-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome, {client?.name}!</h1>
          <p className="text-muted-foreground">
            Use the actions below to send files and complete your project intake.
          </p>
        </div>

        {/* Project Status Tracker */}
        <section aria-label="Project status">
          <Label className="block mb-3 text-foreground font-semibold">Project Status</Label>
          <Stepper current={currentStage} />
          <div className="flex flex-wrap gap-2 mt-4">
            {STEPS.map((s) => (
              <Button
                key={s}
                size="sm"
                className={s === currentStage ? btnPrimary : btnGhost}
                onClick={() => setCurrentStage(s)}
                aria-pressed={s === currentStage}
              >
                {s}
              </Button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={openUploadWidget} className={btnPrimary}>
            Upload files securely
          </Button>

          <a href={NOTION_URL} target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="font-semibold">
              UX/UI Project Intake
            </Button>
          </a>

          <Button
            variant="ghost"
            className={btnGhost}
            onClick={resetPortal}
          >
            Access another portal
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
      <Helmet>
        <title>Client Postal - Jessabel.Art</title>
        <meta name="description" content="Secure client portal for project access." />
      </Helmet>

      <AnimatePresence mode="wait">
        {client ? <WelcomeCard /> : <PinForm />}
      </AnimatePresence>
    </div>
  );
};

export default ClientsPage;
