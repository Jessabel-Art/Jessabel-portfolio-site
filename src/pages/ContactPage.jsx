// src/pages/ContactPage.jsx
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Linkedin, Instagram, Dribbble, ArrowRight, CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const EMAIL_ADDR = 'hello@jessabel.art';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgzlkve';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay } },
});

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honey: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // validation
  const errors = useMemo(() => {
    const e = { name: '', email: '', message: '' };
    e.name = formData.name.trim().length >= 2 ? '' : 'Please enter your full name.';
    e.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) ? '' : 'Enter a valid email address.';
    e.message = formData.message.trim().length >= 20 ? '' : 'Please share a bit more (20+ characters).';
    return e;
  }, [formData]);

  const isValid = !errors.name && !errors.email && !errors.message && !formData.honey;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!isValid) {
      toast({ title: 'Almost there', description: 'Please fix the highlighted fields.' });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: 'New inquiry from Jessabel.Art',
          _gotcha: formData.honey,
          page: window.location.href,
        }),
      });
      if (res.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        const data = await res.json().catch(() => null);
        const msg =
          data?.errors?.map((er) => er.message).join(', ') ||
          'Send failed. Please try again or email me directly.';
        throw new Error(msg);
      }
    } catch (err) {
      setIsSubmitting(false);
      toast({
        title: 'Send failed',
        description: err.message || 'Please try again or email me directly at hello@jessabel.art.',
        variant: 'destructive',
      });
      const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
      submissions.push({ ...formData, id: Date.now(), timestamp: new Date().toISOString() });
      localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
    }
  };

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/jessysantos31' },
    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/jessieleonne/' },
    { icon: Dribbble, label: 'Dribbble', url: '' }, // hidden if empty
  ];

  const handleSocialClick = (url) => {
    if (!url) return;
    toast({ title: 'Redirecting…', description: 'Opening in a new tab.' });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_ADDR);
      toast({ title: 'Email copied', description: EMAIL_ADDR });
    } catch {
      toast({ title: 'Copy failed', description: 'You can copy it manually.', variant: 'destructive' });
    }
  };

  const onKeyDownForm = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'enter') handleSubmit(e);
  };

  // Buttons: on-brand gradient
  const gradBtn =
    'text-white font-semibold shadow-lg border-0 transition-transform duration-200 ' +
    'hover:scale-[1.01] active:scale-[.99] ' +
    'bg-[linear-gradient(135deg,#06b6d4,#7c4dff)]';

  const charCount = formData.message.length;
  const maxChars = 1200;

  // Shared input class (dark glass w/ cyan focus)
  const inputCls =
    'w-full rounded-lg px-4 py-3 bg-white/5 text-white ' +
    'border border-white/10 placeholder-white/40 ' +
    'focus:outline-none focus:ring-2 focus:ring-cyan-400/70 focus:border-cyan-400/70 transition';

  return (
    <div className="relative overflow-hidden">
      <Helmet>
        <title>Contact - Jessabel.Art</title>
        <meta
          name="description"
          content="Let's work together. Reach out to Jessabel Santos for UX/UI design, branding, and web development projects."
        />
      </Helmet>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-10 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute top-1/3 right-8 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-[36rem] rounded-[999px] bg-gradient-to-r from-cyan-500/10 via-sky-400/10 to-violet-500/10 blur-3xl" />
      </div>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div {...fadeUp(0)} className="text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Let’s <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400">talk</span> about your project
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/60">
              Quick reply • Clear scope • Measurable outcomes
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* FORM */}
            <motion.div
              {...fadeUp(0.05)}
              className="order-2 lg:order-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6 sm:p-8"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                  aria-live="polite"
                >
                  <CheckCircle className="mx-auto w-14 h-14 text-emerald-400 mb-3" />
                  <h2 className="text-2xl font-bold">Thank you!</h2>
                  <p className="text-white/70">Your message has been sent. I’ll be in touch soon.</p>
                  <div className="mt-6 flex gap-3 justify-center">
                    <Button asChild variant="outline" className="rounded-full transition-transform hover:scale-[1.01]">
                      <a href="/portfolio">See recent work</a>
                    </Button>
                    <Button asChild className={`rounded-full ${gradBtn}`}>
                      <a href="/contact">Start another message</a>
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} onKeyDown={onKeyDownForm} className="space-y-5" noValidate>
                  {/* Honeypot (hidden) */}
                  <input
                    type="text"
                    name="honey"
                    value={formData.honey}
                    onChange={handleInputChange}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                  />

                  {/* SR error summary */}
                  <div role="status" aria-live="polite" className="sr-only">
                    {!isValid && (touched.name || touched.email || touched.message) ? 'Form has errors' : ''}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      minLength={2}
                      value={formData.name}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-invalid={touched.name && !!errors.name}
                      aria-describedby={touched.name && errors.name ? 'name-err' : undefined}
                      className={inputCls}
                      placeholder="Jane Doe"
                    />
                    {touched.name && errors.name && (
                      <p id="name-err" className="text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold">Email Address</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-invalid={touched.email && !!errors.email}
                      aria-describedby={touched.email && errors.email ? 'email-err' : undefined}
                      className={inputCls}
                      placeholder="you@example.com"
                    />
                    {touched.email && errors.email && (
                      <p id="email-err" className="text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-semibold">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      maxLength={1200}
                      value={formData.message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      aria-invalid={touched.message && !!errors.message}
                      aria-describedby={touched.message && errors.message ? 'message-err' : 'message-help'}
                      className={`${inputCls} resize-none`}
                      placeholder="A quick overview, goals, timeline, and budget (rough is fine!)."
                    />
                    <div className="flex items-center justify-between">
                      {touched.message && errors.message ? (
                        <p id="message-err" className="text-sm text-red-400">{errors.message}</p>
                      ) : (
                        <p id="message-help" className="text-xs text-white/50">All fields are required.</p>
                      )}
                      <span className="text-xs text-white/50">
                        {formData.message.length}/1200
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full text-base md:text-lg py-3.5 rounded-full ${gradBtn} disabled:opacity-60 disabled:cursor-not-allowed`}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? 'Sending…' : 'Send Message'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              )}
            </motion.div>

            {/* INTRO + SOCIALS */}
            <motion.div {...fadeUp(0.1)} className="order-1 lg:order-2 space-y-8">
              <h2 className="text-[2.1rem] sm:text-5xl lg:text-6xl font-extrabold leading-[0.98]">
                Let’s Work
                <br />
                <span className="italic font-['Playfair_Display']">Together</span>
              </h2>

              <p className="text-lg text-white/70 leading-relaxed max-w-prose">
                I’d love to hear about your project and explore how we can bring your ideas to life.
                Fill out the quick form and I’ll respond within 24 hours.
              </p>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Follow Me</h3>
                <div className="flex gap-3">
                  {socialLinks
                    .filter((s) => !!s.url)
                    .map(({ icon: Icon, label, url }) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.08, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleSocialClick(url)}
                        aria-label={label}
                        className="w-12 h-12 rounded-full border border-white/10 bg-white/5 backdrop-blur
                                   hover:shadow-md hover:ring-2 hover:ring-cyan-400/40 flex items-center justify-center"
                      >
                        <Icon className="text-white" size={20} />
                      </motion.button>
                    ))}
                </div>

                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="rounded-full transition-transform hover:scale-[1.01] active:scale-[.99]"
                    onClick={copyEmail}
                    aria-label="Copy my email address"
                  >
                    <Copy className="mr-2 h-4 w-4" /> {EMAIL_ADDR}
                  </Button>
                </div>
              </div>

              {/* Booking badge */}
              <motion.div {...fadeUp(0.15)} className="pt-2">
                <div className="inline-flex flex-wrap items-center gap-2 rounded-full px-5 py-3 border border-white/10 bg-white/5 backdrop-blur">
                  <span className="font-bold text-transparent bg-clip-text bg-[linear-gradient(135deg,#06b6d4,#7c4dff)]">
                    Now booking for September 2025
                  </span>
                  <span className="text-white/60">Let’s create something amazing together.</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
