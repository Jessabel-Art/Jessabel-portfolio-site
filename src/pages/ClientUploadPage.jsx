// src/pages/ClientUploadPage.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

/** === Cloudinary config (yours) ===
 * Keep this unsigned preset in sync with ClientsPage openUploadWidget
 */
const CLOUD_NAME = 'dqqee8c51';
const UPLOAD_PRESET = 'sanchezservices'; // UNSIGNED

/** === PIN → client folder map (same as ClientsPage) === */
const CLIENTS = [
  { name: 'ACME Corp',        pin: '7431', folder: 'acme' },
  { name: 'Neoterra Inc.',    pin: '8190', folder: 'neoterra' },
  { name: 'Sanchez Services', pin: '1122', folder: 'sanchez' },
];

const ROOT_FOLDER = 'client_uploads';

/** === Theme (match portal page) === */
const THEME = {
  peachBg: '#FEE6D4',
  ink: '#3b2a22',
  pink: '#ff3ea5',
  blue: '#6a5cff',
};
const grad = `linear-gradient(135deg, ${THEME.pink}, ${THEME.blue})`;

function buildFallbackLink() {
  const base = 'https://widget.cloudinary.com/v2/uploader';
  const qs = new URLSearchParams({ cloud_name: CLOUD_NAME, upload_preset: UPLOAD_PRESET });
  return `${base}?${qs.toString()}`;
}

const styles = {
  page: { margin: 0, padding: 0, background: THEME.peachBg, color: THEME.ink, minHeight: '100vh' },
  glow: {
    position: 'fixed',
    inset: -40,
    pointerEvents: 'none',
    background: 'radial-gradient(600px circle at 50% 0%, rgba(255,206,158,.28), transparent 60%)',
  },
  wrap: { maxWidth: 720, margin: '40px auto', padding: 20 },
  card: {
    background: 'rgba(255,255,255,.75)', border: '1px solid rgba(0,0,0,.06)', borderRadius: 16,
    boxShadow: '0 10px 30px rgba(0,0,0,.08)', padding: 20, backdropFilter: 'blur(10px)',
  },
  h1: { margin: '0 0 8px' },
  muted: { color: 'rgba(0,0,0,.65)' },
  label: { display: 'block', margin: '.5rem 0 .5rem', fontWeight: 700 },
  input: {
    width: 220, height: 52, borderRadius: 12, border: '1px solid rgba(0,0,0,.15)',
    textAlign: 'center', fontSize: 24, letterSpacing: '.35em', background: '#fff',
    boxShadow: `inset 0 0 0 2px ${THEME.blue}`,
  },
  row: { display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 },
  btn: {
    appearance: 'none', cursor: 'pointer', border: 0, borderRadius: 999, padding: '12px 18px',
    fontWeight: 800, color: '#fff', background: grad,
    boxShadow: '0 8px 20px rgba(0,0,0,.15)', transition: 'filter .2s ease',
  },
  btnGhost: {
    background: '#fff', color: '#333', border: '1px solid rgba(0,0,0,.12)', boxShadow: 'none', fontWeight: 700,
  },
  error: { marginTop: 10, color: '#d74708', fontWeight: 700 },
  ok: { marginTop: 10, color: '#1d7d4f', fontWeight: 700 },
  fallback: { display: 'block', marginTop: 14 },
  tiny: { fontSize: 12, opacity: 0.7, marginTop: 8 },
};

export default function ClientUploadPage() {
  const [pin, setPin] = useState('');
  const [msgErr, setMsgErr] = useState('');
  const [msgOk, setMsgOk] = useState('');
  const [fallbackHref, setFallbackHref] = useState('');
  const [widget, setWidget] = useState(null);

  // Load Cloudinary widget script once (reliable + idempotent)
  useEffect(() => {
    if (window.cloudinary?.createUploadWidget) return;
    const existing = document.querySelector('script[data-cloudinary-widget]');
    if (existing) return;

    const s = document.createElement('script');
    s.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    s.async = true;
    s.dataset.cloudinaryWidget = 'true';
    s.onload = () => {}; // ready
    s.onerror = () => {
      setFallbackHref(buildFallbackLink());
      setMsgErr('Could not load the embedded uploader. Use the basic uploader link below.');
    };
    document.head.appendChild(s);
  }, []);

  function hideMsgs() { setMsgErr(''); setMsgOk(''); }
  function findClient(v) { return CLIENTS.find((c) => c.pin === v); }

  function createWidgetIfNeeded(folder) {
    if (!window.cloudinary || typeof window.cloudinary.createUploadWidget !== 'function') {
      setFallbackHref(buildFallbackLink());
      setMsgErr('Could not load the embedded uploader. Use the basic uploader link below.');
      return null;
    }
    if (widget) return widget;

    const w = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder,
        sources: ['local', 'url', 'camera', 'google_drive'],
        multiple: true,
        resourceType: 'auto',
        showAdvancedOptions: false,
      },
      (err, result) => {
        if (err) {
          console.error('Upload error:', err);
          setMsgErr('Upload error. Please try again or use the basic uploader link.');
          return;
        }
        if (result && result.event === 'success') {
          // console.log('Uploaded:', result.info.secure_url);
        }
      }
    );
    setWidget(w);
    return w;
  }

  function openWidget(folder) {
    const w = createWidgetIfNeeded(folder);
    if (!w) return;
    try {
      w.update({ folder });
      w.open();
    } catch (e) {
      console.error(e);
      setFallbackHref(buildFallbackLink());
      setMsgErr('Could not open the uploader. Use the basic uploader link below.');
    }
  }

  function onUnlock() {
    hideMsgs();
    const v = (pin || '').replace(/\D/g, '').slice(0, 4);
    if (v.length !== 4) { setMsgErr('Enter your 4-digit PIN.'); return; }
    const found = findClient(v);
    if (!found) { setMsgErr('Invalid PIN. Please try again or contact Jessabel.'); return; }

    const folder = `${ROOT_FOLDER}/${found.folder}`;
    setMsgOk(`Welcome, ${found.name}. Uploads will go to “${folder}”. Opening uploader…`);
    openWidget(folder);
  }

  return (
    <div style={styles.page}>
      <div aria-hidden style={styles.glow} />
      <Helmet>
        <title>Client Upload - Jessabel.Art</title>
        <meta name="description" content="Secure client upload without login." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <div style={styles.wrap}>
        <div style={styles.card}>
          <h1 style={styles.h1}>Secure Client Upload</h1>
          <p style={styles.muted}>
            Enter your 4-digit PIN to open your upload window. No login required.
          </p>

          <label htmlFor="pin" style={styles.label}>4-digit PIN</label>
          <input
            id="pin"
            type="tel"
            inputMode="numeric"
            maxLength={4}
            placeholder="1234"
            aria-label="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onUnlock(); }}
            style={styles.input}
          />

          <div style={styles.row}>
            <button style={styles.btn} onClick={onUnlock} onMouseDown={(e) => (e.currentTarget.style.filter = 'brightness(1.08)')} onMouseUp={(e) => (e.currentTarget.style.filter = 'none')} onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}>
              Unlock
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() => { setPin(''); hideMsgs(); }}
              type="button"
            >
              Clear
            </button>
          </div>

          {msgErr ? <div role="alert" aria-live="assertive" style={styles.error}>{msgErr}</div> : null}
          {msgOk ? <div aria-live="polite" style={styles.ok}>{msgOk}</div> : null}

          {fallbackHref ? (
            <div style={styles.fallback}>
              Having trouble? Use the basic uploader:
              <div>
                <a href={fallbackHref} target="_blank" rel="noreferrer" style={{ fontWeight: 800 }}>
                  Open uploader
                </a>
              </div>
              <div style={styles.tiny}>
                Tip: if a popup is blocked, allow popups for this site and try again.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
