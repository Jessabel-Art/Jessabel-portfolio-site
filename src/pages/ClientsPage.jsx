import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

/**
 * Add clients here.
 * Optional: stage (defaults to 'Intake'), canChange (defaults to false)
 */
const CLIENTS = [
  { name: 'ACME Corp', pin: '7431', folder: 'acme' },
  { name: 'Neoterra Inc.', pin: '8190', folder: 'neoterra' },
  // Sanchez starts at BUILD
  { name: 'Sanchez Services', pin: '1122', folder: 'sanchez', stage: 'Build' },
];

// Notion: open as a new tab via CTA (no iframe)
const NOTION_URL = 'https://apple-month-55e.notion.site/246ec2233e6f802a93aae01cf20205f3?pvs=105';

/* ---------------- Sparkle utilities (local for now) ---------------- */
const SparkleOverlay = ({ active }) => {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} className="pointer-events-none absolute inset-0">
      {[...Array(6)].map((_, i) => {
        const x = (i * 17 + 8) % 100;
        const y = (i * 29 + 12) % 100;
        const delay = (i * 0.12) % 1.4;
        return (
          <motion.span
            key={i}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 1, 0], scale: [0.6, 1.1, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity, delay, ease: 'easeInOut' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-[hsl(var(--primary))]">
              <path fill="currentColor" d="M12 2l1.6 4.7L18 8.4l-4.2 2.9L14.8 16 12 13.7 9.2 16l1-4.7L6 8.4l4.4-1.7L12 2z" />
            </svg>
          </motion.span>
        );
      })}
    </motion.span>
  );
};

/* ---------------- Anim presets ---------------- */
const shakeVariants = {
  still: { x: 0 },
  shake: { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.4, ease: 'easeInOut' } },
};

/* ---------------- Buttons ---------------- */
const btnPrimary =
  'relative overflow-hidden text-white font-semibold shadow-lg border-0 ' +
  'bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-violet,#6a5cff))] ' +
  'hover:brightness-[1.08] hover:shadow-[0_12px_30px_rgba(0,0,0,.18)] transition';

const btnGhost =
  'border border-[hsl(var(--border))] bg-transparent ' +
  'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))] transition';

const btnMuted =
  'cursor-not-allowed border border-[hsl(var(--border))] bg-[hsl(var(--secondary))/0.25] ' +
  'text-[hsl(var(--foreground))] shadow-sm opacity-100';

/* ---------------- Steps & timeline ---------------- */
const STEPS = ['Intake', 'Discovery', 'Design', 'Build', 'Review', 'Handoff'];

const trackBase = 'bg-[hsl(var(--foreground)/0.14)]';
const trackFill =
  'bg-[linear-gradient(90deg,var(--btn-pink,#ff3ea5),var(--btn-violet,#6a5cff),var(--btn-teal,#00c2b2))] ' +
  'shadow-[inset_0_0_0_2px_rgba(255,255,255,.35),0_6px_18px_rgba(0,0,0,.18)]';
const nodeInactive =
  'bg-white text-[hsl(var(--foreground)/0.8)] border border-[hsl(var(--foreground)/0.18)] ' +
  'shadow-[0_2px_10px_rgba(0,0,0,.08)]';
const nodeActive =
  'text-white bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] ' +
  'shadow-[0_8px_20px_rgba(0,0,0,.22)] ring-2 ring-white/60';
const nodeCompleted =
  'text-white bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))] ' +
  'shadow-[0_6px_16px_rgba(0,0,0,.18)] opacity-[0.95]';

const ClientsPage = () => {
  const prefersReducedMotion = useReducedMotion();

  // PIN (single box, seamless)
  const [pinValue, setPinValue] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [client, setClient] = useState(null);

  // Project status
  const [currentStage, setCurrentStage] = useState('Intake');

  const inputRef = useRef(null);

  const sanitizedPin = useMemo(() => pinValue.replace(/\D/g, '').slice(0, 4), [pinValue]);

  const attemptVerify = (candidatePin) => {
    if (candidatePin.length !== 4) return;
    const found = CLIENTS.find((c) => c.pin === candidatePin);
    if (found) {
      setError('');
      setShake(false);
      setClient(found);
      setCurrentStage(found.stage || 'Intake');
    } else {
      setError('Invalid PIN. Please try again or contact Jessabel.');
      setShake(true);
      setPinValue('');
      setTimeout(() => {
        setShake(false);
        inputRef.current && inputRef.current.focus();
      }, 450);
    }
  };

  const handlePinChange = (v) => {
    setError('');
    const next = v.replace(/\D/g, '').slice(0, 4);
    setPinValue(next);
    if (next.length === 4) attemptVerify(next);
  };

  const handlePaste = (e) => {
    const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 4);
    if (text) {
      e.preventDefault();
      setPinValue(text);
      attemptVerify(text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      attemptVerify(sanitizedPin);
    }
  };

  const handleSubmit = (e) => {
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
    inputRef.current && inputRef.current.focus();
  }, []);

  const resetPortal = () => {
    setClient(null);
    setPinValue('');
    setError('');
    setCurrentStage('Intake');
    setTimeout(() => inputRef.current && inputRef.current.focus(), 0);
  };

  /** Whether this client is allowed to change status (off by default). */
  const canChangeStatus = Boolean(client?.canChange);

  // ---- Stepper ----
  const Stepper = ({ current }) => {
    const idx = STEPS.indexOf(current);
    const pct = Math.max(0, (idx / (STEPS.length - 1)) * 100);

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((label, i) => {
            const isActive = i === idx;
            const isDone = i < idx;
            return (
              <div key={label} className="flex-1 flex items-center">
                <motion.div
                  whileHover={canChangeStatus ? { y: -2 } : {}}
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold select-none',
                    isActive ? nodeActive : isDone ? nodeCompleted : nodeInactive,
                  ].join(' ')}
                  aria-current={isActive ? 'step' : undefined}
                  title={label}
                >
                  {i + 1}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className="relative flex-1 mx-3">
                    <div className={`h-1.5 rounded-full ${trackBase}`} />
                    <div
                      className={`absolute inset-y-0 left-0 h-1.5 rounded-full overflow-hidden ${
                        isDone ? trackFill : 'opacity-0'
                      }`}
                      style={{ width: isDone ? '100%' : 0 }}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={`relative h-2 rounded-full overflow-hidden ${trackBase}`}>
          <motion.div
            className={`absolute left-0 top-0 h-full ${trackFill}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        <div className="mt-3 text-sm flex justify-between items-center">
          <span className="font-semibold text-[hsl(var(--foreground))]">{STEPS[Math.max(0, idx)]}</span>
          <span className="text-[hsl(var(--foreground)/0.7)]">
            {Math.max(0, idx) + 1} / {STEPS.length}
          </span>
        </div>
      </div>
    );
  };

  // ---- Views ----
  const PinForm = () => {
    const [hoverUnlock, setHoverUnlock] = useState(false);
    const [hoverClear, setHoverClear] = useState(false);

    return (
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
            <h1 className="text-3xl font-bold text-foreground">Client Portal</h1>
            <p id="pin-help" className="text-muted-foreground mt-2">
              Enter the 4‑digit code we shared with you{' '}
              <Link to="/contact" className="relative underline underline-offset-4">
                (Don’t have a code?)
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-muted-foreground" htmlFor="pin-box">
              Enter your 4‑digit PIN
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
                type="tel"
                inputMode="numeric"
                enterKeyHint="go"
                autoFocus
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="one-time-code"
                aria-label="PIN code"
                pattern="\d{4}"
                maxLength={4}
                value={sanitizedPin}
                onChange={(e) => handlePinChange(e.target.value)}
                onPaste={handlePaste}
                onKeyDown={handleKeyDown}
                onDrop={(e) => e.preventDefault()}
                placeholder="1234"
                className="h-14 text-2xl tracking-[0.6em] text-center focus:ring-2 focus:ring-[hsl(var(--accent))] focus:border-[hsl(var(--accent))]"
              />
            </motion.div>
          </div>

          {error && (
            <p className="text-sm text-destructive font-semibold text-center" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <span
              className="relative inline-block"
              onMouseEnter={() => setHoverUnlock(true)}
              onMouseLeave={() => setHoverUnlock(false)}
            >
              <Button type="submit" size="lg" className={btnPrimary}>
                Unlock Portal
              </Button>
              {/* gradient sweep + sparkle */}
              {!prefersReducedMotion && (
                <motion.span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  initial={{ x: '-110%' }}
                  animate={{ x: hoverUnlock ? '110%' : '-110%' }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                />
              )}
              <SparkleOverlay active={hoverUnlock} />
            </span>

            <span
              className="relative inline-block"
              onMouseEnter={() => setHoverClear(true)}
              onMouseLeave={() => setHoverClear(false)}
            >
              <Button
                type="button"
                variant="ghost"
                className={btnGhost}
                onClick={() => {
                  setPinValue('');
                  setError('');
                  inputRef.current && inputRef.current.focus();
                }}
              >
                Clear
              </Button>
              <SparkleOverlay active={hoverClear} />
            </span>
          </div>
        </form>
      </motion.div>
    );
  };

  const WelcomeCard = () => {
    const [hoverUpload, setHoverUpload] = useState(false);
    const [hoverIntake, setHoverIntake] = useState(false);
    const [hoverReset, setHoverReset] = useState(false);

    return (
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
              {STEPS.map((s) => {
                const isCurrent = s === currentStage;
                return canChangeStatus ? (
                  <Button
                    key={s}
                    size="sm"
                    className={isCurrent ? btnPrimary : btnGhost}
                    onClick={() => setCurrentStage(s)}
                    aria-pressed={isCurrent}
                  >
                    {s}
                  </Button>
                ) : (
                  <Button
                    key={s}
                    size="sm"
                    disabled
                    aria-disabled="true"
                    className={isCurrent ? btnPrimary : btnMuted}
                    title="Status is managed by Jessabel"
                  >
                    {s}
                  </Button>
                );
              })}
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span
              className="relative inline-block"
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
            >
              <Button size="lg" onClick={openUploadWidget} className={btnPrimary}>
                Upload files securely
              </Button>
              {!prefersReducedMotion && (
                <motion.span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  initial={{ x: '-110%' }}
                  animate={{ x: hoverUpload ? '110%' : '-110%' }}
                  transition={{ duration: 1.8, ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                />
              )}
              <SparkleOverlay active={hoverUpload} />
            </span>

            <a href={NOTION_URL} target="_blank" rel="noreferrer" className="relative inline-block"
               onMouseEnter={() => setHoverIntake(true)} onMouseLeave={() => setHoverIntake(false)}>
              <Button size="lg" variant="outline" className="font-semibold transition hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
                UX/UI Project Intake
              </Button>
              <SparkleOverlay active={hoverIntake} />
            </a>

            <span
              className="relative inline-block"
              onMouseEnter={() => setHoverReset(true)}
              onMouseLeave={() => setHoverReset(false)}
            >
              <Button variant="ghost" className={btnGhost} onClick={resetPortal}>
                Access another portal
              </Button>
              <SparkleOverlay active={hoverReset} />
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-[#FAFAF7]">
      <Helmet>
        <title>Client Portal - Jessabel.Art</title>
        <meta name="description" content="Secure client portal for project access." />
      </Helmet>

      <AnimatePresence mode="wait">
        {client ? <WelcomeCard /> : <PinForm />}
      </AnimatePresence>
    </div>
  );
};

export default ClientsPage;
