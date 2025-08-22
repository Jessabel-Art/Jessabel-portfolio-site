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

const NOTION_EMBED_URL =
  'https://apple-month-55e.notion.site/ebd/246ec2233e6f802a93aae01cf20205f3';

const shakeVariants = {
  still: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

const gradBtn =
  'text-white font-semibold shadow-lg border-0 ' +
  'bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]';

const ClientsPage = () => {
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [client, setClient] = useState(null);
  const [frameHeight, setFrameHeight] = useState(720);
  const [shake, setShake] = useState(false);

  const inputRefs = useRef(Array.from({ length: 4 }, () => React.createRef()));
  const iframeWrapRef = useRef(null);

  const pin = useMemo(() => pinDigits.join(''), [pinDigits]);

  const focusIndex = (i) => {
    const el = inputRefs.current[i]?.current;
    if (el) el.focus();
  };

  const attemptVerify = (candidatePin) => {
    if (candidatePin.length !== 4) return;
    const foundClient = CLIENTS.find((c) => c.pin === candidatePin);
    if (foundClient) {
      setError('');
      setShake(false);
      setClient(foundClient);
    } else {
      setError('Invalid PIN. Please try again or contact Jessabel.');
      setShake(true);
      setPinDigits(['', '', '', '']);
      setTimeout(() => {
        setShake(false);
        focusIndex(0);
      }, 450);
    }
  };

  const handleDigitChange = (value, index) => {
    setError('');
    const v = value.replace(/\D/g, '').slice(0, 1);
    setPinDigits((prev) => {
      const next = [...prev];
      next[index] = v;
      if (v && index < 3) focusIndex(index + 1);
      const joined = next.join('');
      if (joined.length === 4) attemptVerify(joined);
      return next;
    });
  };

  const handleKeyDown = (e, index) => {
    setError('');
    if (e.key === 'Backspace') {
      if (!pinDigits[index] && index > 0) {
        focusIndex(index - 1);
      } else {
        setPinDigits((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) focusIndex(index - 1);
    if (e.key === 'ArrowRight' && index < 3) focusIndex(index + 1);
  };

  const handlePaste = (e) => {
    setError('');
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (!text) return;
    const next = text.split('');
    while (next.length < 4) next.push('');
    setPinDigits(next);
    attemptVerify(text);
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    attemptVerify(pin);
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
    if (!client) return;
    const measure = () => {
      if (!iframeWrapRef.current) return;
      const rect = iframeWrapRef.current.getBoundingClientRect();
      const available = window.innerHeight - rect.top - 24;
      setFrameHeight(Math.max(available, 600));
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    return () => window.removeEventListener('resize', measure);
  }, [client]);

  useEffect(() => {
    inputRefs.current[0]?.current?.focus();
  }, []);

  // 🔑 Force keyboard helper
  const showKeypad = () => {
    focusIndex(0);
    const el = inputRefs.current[0]?.current;
    if (el) {
      el.blur();
      setTimeout(() => el.focus(), 100);
    }
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
            Enter the 4-digit code we shared with you.{" "}
            <Link to="/contact" className="underline underline-offset-4">
              Don’t have a code?
            </Link>
          </p>
        </div>

        <div className="space-y-3">
          <Label className="text-muted-foreground" htmlFor="pin-digit-1">
            Enter your 4-digit PIN
          </Label>

          <motion.div
            variants={shakeVariants}
            animate={shake ? 'shake' : 'still'}
            className="flex items-center justify-between gap-3"
            aria-describedby="pin-help"
          >
            {pinDigits.map((d, i) => (
              <Input
                key={i}
                id={`pin-digit-${i + 1}`}
                ref={inputRefs.current[i]}
                type="tel"
                inputMode="numeric"
                enterKeyHint="go"
                pattern="\d*"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={i === 0 ? handlePaste : undefined}
                onFocus={(e) => e.currentTarget.select()}
                className="w-16 h-14 text-center text-2xl tracking-widest"
                autoComplete="one-time-code"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </motion.div>

          {/* Show Keypad button */}
          <div className="flex justify-center">
            <Button
              type="button"
              size="sm"
              onClick={showKeypad}
              className={`${gradBtn} mt-3`}
            >
              Show Keypad
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive font-semibold text-center" role="alert" aria-live="assertive">
            {error}
          </p>
        )}

        <button type="submit" className="sr-only" tabIndex={-1} aria-hidden="true">
          Submit
        </button>
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
      <div className="glass p-8 rounded-2xl shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome, {client.name}!</h1>
          <p className="text-muted-foreground">
            Use the actions below to send files and complete your project intake.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" onClick={openUploadWidget} className={gradBtn}>
            Upload files securely
          </Button>

          <Button
            variant="link"
            className="text-muted-foreground"
            onClick={() => {
              setClient(null);
              setPinDigits(['', '', '', '']);
              setError('');
              setTimeout(() => focusIndex(0), 0);
            }}
          >
            Access another portal
          </Button>
        </div>

        <div id="notion-intake" className="pt-4" ref={iframeWrapRef}>
          <Label className="block mb-2 text-foreground font-semibold">
            Project Intake Form
          </Label>
          <div className="rounded-xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <iframe
              src={NOTION_EMBED_URL}
              title="Client Intake Form"
              width="100%"
              height={frameHeight}
              style={{ display: 'block' }}
              frameBorder="0"
              allowFullScreen
              scrolling="auto"
            />
          </div>
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




