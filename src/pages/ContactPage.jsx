import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Linkedin, Instagram, Dribbble, ArrowRight, CheckCircle, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const EMAIL_ADDR = 'hello@jessabel.art';
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkgzlkve';

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
          _gotcha: formData.honey, // honeypot
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
      // optional fallback so the message isn't lost
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

  // theme gradient (brand red → yellow)
  const gradBtn =
    'text-white font-semibold shadow-lg border-0 transition-transform duration-200 ' +
    'hover:scale-[1.01] active:scale-[.99] ' +
    'bg-[linear-gradient(135deg,var(--btn-red,#ba0d0d),var(--btn-yellow,#ecdf26))]';

  const headingShadow = { textShadow: '0 3px 14px rgba(0,0,0,.18)' };

  const charCount = formData.message.length;
  const maxChars = 1200;

  return (
    <div className="py-20">
      <Helmet>
        <title>Contact - Jessabel.Art</title>
        <meta
          name="description"
          content="Let's work together. Reach out to Jessabel Santos for UX/UI design, branding, and web development projects."
        />
      </Helmet>

      {/* Warm background that matches your palette */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl py-12 md:py-16 bg-[var(--orange-100,#fee9a6)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* FORM FIRST (better mobile & a11y) */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-1 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-xl p-6 sm:p-8"
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
                aria-live="polite"
              >
                <CheckCircle className="mx-auto w-14 h-14 text-green-600 mb-3" />
                <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-2">Thank you!</h2>
                <p className="text-[hsl(var(--muted-foreground))]">
                  Your message has been sent. I’ll be in touch soon.
                </p>
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
                />

                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-[hsl(var(--foreground))]">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    inputMode="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={touched.name && !!errors.name}
                    aria-describedby={touched.name && errors.name ? 'name-err' : undefined}
                    className="w-full rounded-lg px-4 py-3 bg-[hsl(var(--popover))] text-[hsl(var(--foreground))]
                               border border-[hsl(var(--border))] placeholder-[hsl(var(--muted-foreground))]
                               focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] focus:border-[var(--orange-600,#fa8a00)] transition"
                    placeholder="Jane Doe"
                  />
                  {touched.name && errors.name && (
                    <p id="name-err" className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-[hsl(var(--foreground))]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={touched.email && !!errors.email}
                    aria-describedby={touched.email && errors.email ? 'email-err' : undefined}
                    className="w-full rounded-lg px-4 py-3 bg-[hsl(var(--popover))] text-[hsl(var(--foreground))]
                               border border-[hsl(var(--border))] placeholder-[hsl(var(--muted-foreground))]
                               focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] focus:border-[var(--orange-600,#fa8a00)] transition"
                    placeholder="you@example.com"
                  />
                  {touched.email && errors.email && (
                    <p id="email-err" className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-[hsl(var(--foreground))]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    maxLength={maxChars}
                    value={formData.message}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    aria-invalid={touched.message && !!errors.message}
                    aria-describedby={touched.message && errors.message ? 'message-err' : 'message-help'}
                    className="w-full rounded-lg px-4 py-3 bg-[hsl(var(--popover))] text-[hsl(var(--foreground))]
                               border border-[hsl(var(--border))] placeholder-[hsl(var(--muted-foreground))]
                               focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] focus:border-[var(--orange-600,#fa8a00)] transition resize-none"
                    placeholder="A quick overview, goals, timeline, and budget (rough is fine!)."
                  />
                  <div className="flex items-center justify-between">
                    {touched.message && errors.message ? (
                      <p id="message-err" className="text-sm text-destructive">{errors.message}</p>
                    ) : (
                      <p id="message-help" className="text-xs text-[hsl(var(--muted-foreground))]">
                        All fields are required.
                      </p>
                    )}
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      {charCount}/{maxChars}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={`w-full text-base md:text-lg py-3.5 rounded-full ${gradBtn}`}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            )}
          </motion.div>

          {/* INTRO + SOCIALS */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
            className="order-2 space-y-8"
          >
            <h1
              className="text-[2.5rem] sm:text-6xl lg:text-7xl font-bold leading-[0.95] text-[var(--orange-800,#d74708)]"
              style={headingShadow}
            >
              Let’s Work
              <br />
              <span className="italic font-['Playfair_Display']">Together</span>
            </h1>

            <p className="text-lg text-[hsl(var(--muted-foreground))] leading-relaxed max-w-prose">
              I’d love to hear about your project and explore how we can bring your ideas to life.
              Fill out the quick form and I’ll respond within 24 hours.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">Follow Me</h3>
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
                      className="w-12 h-12 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm
                                 hover:shadow-md hover:ring-2 hover:ring-[hsl(var(--accent))]/60 flex items-center justify-center"
                    >
                      <Icon className="text-[hsl(var(--foreground))]" size={20} />
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
          </motion.div>
        </div>

        {/* Booking badge — brand gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: 'easeOut' }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div
            className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3
                       border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm"
          >
            <span
              className="font-bold"
              style={{
                background:
                  'linear-gradient(135deg,var(--btn-red,#ba0d0d),var(--btn-yellow,#ecdf26))',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Now booking for September 2025
            </span>
            <span className="text-[hsl(var(--muted-foreground))]">
              Let’s create something amazing together.
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ContactPage;

