// src/pages/ClientsPage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

//theme colors (match ClientUploadPage)
const GRAD_PRIMARY = 'var(--grad-primary)'; // define in CSS: --grad-primary: linear-gradient(135deg, var(--brand-pink), var(--brand-violet));
const GRAD_TRACK   = 'var(--grad-track)';   // e.g. linear-gradient(90deg, var(--brand-pink), var(--brand-violet));

/* ---------------- CLIENTS ---------------- */
const CLIENTS = [
  { name: 'ACME Corp', pin: '7431', folder: 'acme' },
  { name: 'Neoterra Inc.', pin: '8190', folder: 'neoterra' },
  { name: 'Sanchez Services', pin: '1122', folder: 'sanchez', stage: 'Build' },
];
const ROOT_FOLDER = 'client_uploads';

/* ---- Universal intake (use your Formspree id) ---- */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/REPLACE_ME'; // <<<<<< set this
const NOTION_URL_DEFAULT =
  'https://apple-month-55e.notion.site/246ec2233e6f802a93aae01cf20205f3?pvs=105';
const CLIENT_INTAKE_URLS = {};

/* ---------------- Sparkle utilities ---------------- */
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
  'hover:brightness-[1.08] hover:shadow-[0_12px_30px_rgba(0,0,0,.18)] transition';

const btnGhost =
  'border border-[hsl(var(--border))] bg-white/40 backdrop-blur ' +
  'hover:bg-white/60 hover:text-[hsl(var(--foreground))] transition';

const btnMuted =
  'cursor-not-allowed border border-[hsl(var(--border))] bg-white/60 ' +
  'text-[hsl(var(--foreground))] shadow-sm opacity-100';

/* ---------------- Steps & timeline ---------------- */
const STEPS = ['Intake', 'Discovery', 'Design', 'Build', 'Review', 'Handoff'];
const trackBase = 'bg-[hsl(var(--foreground)/0.15)]';

const nodeBase =
  'rounded-full flex items-center justify-center select-none backdrop-blur ' +
  'transition-colors duration-200';
const nodeInactive =
  `${nodeBase} w-12 h-12 text-[15px] font-extrabold ` +
  'bg-white text-[hsl(var(--foreground))] ' +
  'border-2 border-[hsl(var(--foreground)/0.2)] shadow-[0_2px_10px_rgba(0,0,0,.06)]';
const nodeActive =
  `${nodeBase} w-12 h-12 text-[15px] font-extrabold text-white ` +
  'shadow-[0_8px_20px_rgba(0,0,0,.22)] ring-2 ring-white/70';
const nodeCompleted =
  `${nodeBase} w-12 h-12 text-[15px] font-extrabold text-white ` +
  'shadow-[0_6px_16px_rgba(0,0,0,.18)] opacity-[0.98]';

/* ---------------- Utilities ---------------- */
const storageKeyFor = (client) => (client ? `ja:portal:${client.folder}:stage` : null);

async function ensureCloudinary() {
  if (window.cloudinary?.createUploadWidget) return true;
  return new Promise((resolve) => {
    const existing = document.querySelector('script[data-cloudinary-widget]');
    if (existing) {
      existing.addEventListener('load', () => resolve(true));
      existing.addEventListener('error', () => resolve(false));
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    s.async = true;
    s.dataset.cloudinaryWidget = 'true';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

/* ---------------- Embedded universal intake form ---------------- */
const EmbeddedIntakeForm = ({ client, currentStage }) => {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [okMsg, setOkMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // simple local fields; tailor as you wish
  const [form, setForm] = useState({
    contactName: '',
    contactEmail: '',
    projectSummary: '',
    timeline: '',
    budget: '',
    honey: '', // honeypot
  });

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setOkMsg('');
    setErrMsg('');

    if (form.honey) return; // bot

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        __clientName: client?.name || '',
        __clientFolder: client?.folder || '',
        __stage: currentStage || '',
        __site: 'Jessabel.Art',
      };

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to submit form');
      setOkMsg('Thanks! Your intake has been received.');
      setForm({ contactName: '', contactEmail: '', projectSummary: '', timeline: '', budget: '', honey: '' });

      toast?.({
        title: 'Intake received',
        description: `${client?.name || 'Client'} • We emailed you a confirmation (Formspree).`,
      });
    } catch (err) {
      setErrMsg('Could not submit right now. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10" aria-label="Project intake">
      <div className="mb-3">
        <Label className="font-semibold" style={{ color: THEME.warmInk }}>
          Universal Intake Form
        </Label>
        <p className="text-sm text-[hsl(var(--foreground)/0.75)]">
          Fill this out here — it’s the same form we email. You’ll get a confirmation.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="p-6 rounded-2xl border border-white/55 bg-white/60 backdrop-blur space-y-4"
      >
        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={form.honey}
          onChange={onChange('honey')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactName">Your name</Label>
            <Input id="contactName" value={form.contactName} onChange={onChange('contactName')} required />
          </div>
          <div>
            <Label htmlFor="contactEmail">Email</Label>
            <Input id="contactEmail" type="email" value={form.contactEmail} onChange={onChange('contactEmail')} required />
          </div>
        </div>

        <div>
          <Label htmlFor="projectSummary">Project summary</Label>
          <Textarea id="projectSummary" rows={4} value={form.projectSummary} onChange={onChange('projectSummary')} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="timeline">Ideal timeline</Label>
            <Input id="timeline" placeholder="e.g., 2–4 weeks" value={form.timeline} onChange={onChange('timeline')} />
          </div>
          <div>
            <Label htmlFor="budget">Approx. budget</Label>
            <Input id="budget" placeholder="$" value={form.budget} onChange={onChange('budget')} />
          </div>
        </div>

        {/* Hidden context for your inbox threading/filtering */}
        <input type="hidden" name="__clientName" value={client?.name || ''} />
        <input type="hidden" name="__clientFolder" value={client?.folder || ''} />
        <input type="hidden" name="__stage" value={currentStage || ''} />
        <input type="hidden" name="__site" value="Jessabel.Art" />

        <div className="flex gap-3">
          <Button type="submit" disabled={submitting} className={btnPrimary} style={{ backgroundImage: GRAD_PRIMARY }}>
            {submitting ? 'Submitting…' : 'Submit intake'}
          </Button>
          <a
            href={CLIENT_INTAKE_URLS[client?.folder] || NOTION_URL_DEFAULT}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-md border-2 font-semibold"
            style={{ borderColor: THEME.blue, color: THEME.blue }}
          >
            Open in Notion
          </a>
        </div>

        {okMsg && <p className="text-sm font-semibold text-[#1d7d4f]" role="status">{okMsg}</p>}
        {errMsg && <p className="text-sm font-semibold text-[#d74708]" role="alert">{errMsg}</p>}
      </form>
    </section>
  );
};

/* =========================================================
   Component
========================================================= */
const ClientsPage = () => {
  const prefersReducedMotion = useReducedMotion();
  const { toast } = useToast();

  // PIN (single box)
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
      const persisted = localStorage.getItem(storageKeyFor(found));
      setCurrentStage(persisted || found.stage || 'Intake');
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

  const openUploadWidget = async () => {
    if (!client) return;
    const ok = await ensureCloudinary();
    if (!ok) {
      setError('Upload widget not available right now. Please refresh or use the dedicated Upload page.');
      return;
    }
    const folder = `${ROOT_FOLDER}/${client.folder}`;
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dqqee8c51',
        uploadPreset: 'sanchezservices', // unsigned
        folder,
        sources: ['local', 'url', 'camera', 'google_drive'],
        multiple: true,
        maxFiles: 10,
        clientAllowedFormats: ['jpg', 'png', 'pdf', 'docx', 'zip'],
        showAdvancedOptions: false,
        resourceType: 'auto',
      },
      (err, result) => {
        if (err) {
          console.error(err);
          setError('Upload error. Please try again or use the Upload page.');
          return;
        }
        if (result && result.event === 'success') {
          // Receipt/toast on upload
          const fname = result.info?.original_filename || 'File';
          toast?.({
            title: 'Upload complete',
            description: `${fname} uploaded to ${client.name}`,
          });
        }
      }
    );
    try {
      widget.open();
    } catch {
      setError('Could not open uploader. Try the Upload page instead.');
    }
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

  const canChangeStatus = Boolean(client?.canChange);

  // Persist stage per client
  useEffect(() => {
    if (!client) return;
    const key = storageKeyFor(client);
    if (!key) return;
    localStorage.setItem(key, currentStage);
  }, [client, currentStage]);

  /* ---------------- Stepper ---------------- */
  const Stepper = ({ current }) => {
    const idx = Math.max(0, STEPS.indexOf(current));
    const pct = (idx / (STEPS.length - 1)) * 100;

    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4" role="list" aria-label="Project steps">
          {STEPS.map((label, i) => {
            const isActive = i === idx;
            const isDone = i < idx;
            return (
              <div key={label} className="flex-1 flex items-center">
                <motion.div
                  whileHover={canChangeStatus ? { y: -2 } : {}}
                  className={isActive ? nodeActive : isDone ? nodeCompleted : nodeInactive}
                  aria-current={isActive ? 'step' : undefined}
                  aria-label={`${label}${isActive ? ' (current)' : isDone ? ' (completed)' : ''}`}
                  title={label}
                  style={{
                    backgroundImage: isActive || isDone ? GRAD_PRIMARY : undefined,
                    textShadow: isActive || isDone ? '0 1px 0 rgba(0,0,0,.25)' : 'none',
                  }}
                >
                  {i + 1}
                </motion.div>
                {i < STEPS.length - 1 && (
                  <div className="relative flex-1 mx-3" aria-hidden="true">
                    <div className={`h-1.5 rounded-full ${trackBase}`} />
                    <div
                      className="absolute inset-y-0 left-0 h-1.5 rounded-full overflow-hidden"
                      style={{
                        width: isDone ? '100%' : 0,
                        background: isDone ? GRAD_TRACK : 'transparent',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className={`relative h-2 rounded-full overflow-hidden ${trackBase}`} aria-label="Overall progress">
          <motion.div
            className="absolute left-0 top-0 h-full"
            style={{ background: GRAD_TRACK }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>

        <div className="mt-3 text-sm flex justify-between items-center">
          <span className="font-semibold" style={{ color: THEME.warmInk }}>
            {STEPS[Math.max(0, idx)]}
          </span>
          <span className="text-[hsl(var(--foreground)/0.7)]" aria-live="polite">
            {idx + 1} / {STEPS.length}
          </span>
        </div>
      </div>
    );
  };

  /* ---------------- Views ---------------- */
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
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl shadow-lg space-y-6 border border-white/55 bg-white/45 backdrop-blur-xl"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold" style={{ color: THEME.warmInk }}>Client Portal</h1>
            <p id="pin-help" className="mt-2 text-[hsl(var(--foreground)/0.75)]">
              Enter the 4-digit code we shared with you{' '}
              <Link to="/contact" className="relative underline underline-offset-4">
                (Don’t have a code?)
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-[hsl(var(--foreground)/0.8)]" htmlFor="pin-box">
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
                className="h-14 text-2xl tracking-[0.6em] text-center
                           focus:ring-2 focus:ring-offset-0
                           border-[hsl(var(--border))] focus:border-transparent"
                style={{ boxShadow: `0 0 0 2px ${THEME.blue} inset` }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 2px ${THEME.blue} inset`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
            </motion.div>
          </div>

          {error && (
            <p className="text-sm font-semibold text-center text-[#d74708]" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-center pt-2">
            <span
              className="relative inline-block"
              onMouseEnter={() => setHoverUnlock(true)}
              onMouseLeave={() => setHoverUnlock(false)}
            >
              <Button type="submit" size="lg" className={btnPrimary} style={{ backgroundImage: GRAD_PRIMARY }}>
                Unlock Portal
              </Button>
              {!prefersReducedMotion && (
                <motion.span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  initial={{ x: '-110%' }}
                  animate={{ x: hoverUnlock ? '110%' : '-110%' }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
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

    const intakeUrl =
      client ? CLIENT_INTAKE_URLS[client.folder] || NOTION_URL_DEFAULT : NOTION_URL_DEFAULT;

    return (
      <motion.div
        key="welcome"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="p-8 rounded-2xl shadow-lg space-y-8 border border-white/55 bg-white/45 backdrop-blur-xl">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold" style={{ color: THEME.warmInk }}>
              Welcome, {client?.name}!
            </h1>
            <p className="text-[hsl(var(--foreground)/0.75)]">
              Use the actions below to send files and complete your project intake.
            </p>
          </div>

          {/* Project Status Tracker */}
          <section aria-label="Project status">
            <Label className="block mb-3 font-semibold" style={{ color: THEME.warmInk }}>
              Project Status
            </Label>
            <Stepper current={currentStage} />
            <div className="flex flex-wrap gap-2 mt-4">
              {STEPS.map((s) => {
                const isCurrent = s === currentStage;
                return (
                  <Button
                    key={s}
                    size="sm"
                    disabled
                    aria-disabled="true"
                    className={isCurrent ? btnPrimary : btnMuted}
                    style={isCurrent ? { backgroundImage: GRAD_PRIMARY } : {}}
                    title="Status is managed by Jessabel"
                    aria-pressed={isCurrent}
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
              <Button size="lg" onClick={openUploadWidget} className={btnPrimary} style={{ backgroundImage: GRAD_PRIMARY }}>
                Upload files securely
              </Button>
              {!prefersReducedMotion && (
                <motion.span
                  className="pointer-events-none absolute inset-0 opacity-30"
                  initial={{ x: '-110%' }}
                  animate={{ x: hoverUpload ? '110%' : '-110%' }}
                  transition={{ duration: 1.4, ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent)' }}
                />
              )}
              <SparkleOverlay active={hoverUpload} />
            </span>

            <a
              href={intakeUrl}
              target="_blank"
              rel="noreferrer"
              className="relative inline-block"
              onMouseEnter={() => setHoverIntake(true)}
              onMouseLeave={() => setHoverIntake(false)}
            >
              <Button
                size="lg"
                variant="outline"
                className="font-semibold transition border-2"
                style={{ borderColor: THEME.blue, color: THEME.blue }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'white'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                Open full intake (Notion)
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

          {/* Embedded universal intake form */}
          <EmbeddedIntakeForm client={client} currentStage={currentStage} />

          {/* Secondary actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/client-upload" className="underline text-[hsl(var(--foreground)/0.75)]">
              Having trouble? Open the dedicated upload page
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center py-20 px-4"
      style={{
        background: THEME.peachBg,
        position: 'relative',
      }}
    >
      {/* soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10"
        style={{
          background: `radial-gradient(600px circle at 50% 0%, rgba(255,206,158,.28), transparent 60%)`,
        }}
      />
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
