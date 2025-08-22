import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  // Update when you materially change the policy
  const effectiveDate = '2025-08-11';

  // Badge if updated in the last 30 days
  const isNew = useMemo(() => {
    try {
      const now = new Date();
      const eff = new Date(effectiveDate);
      const diffDays = (now - eff) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    } catch {
      return false;
    }
  }, [effectiveDate]);

  const sections = [
    {
      id: 'overview',
      title: 'Overview & Scope',
      content: [
        <>
          This Privacy Policy explains how <strong>Jessabel.Art</strong> (“we”/“us”) collects and uses information when
          you visit this website, submit the contact form, or use client features like file uploads and the intake form.
          It applies only to this website and related project tools we embed or connect to.
        </>,
        <>
          <strong>Data controller:</strong> Jessabel.Art •{' '}
          <a className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)]" href="mailto:hello@jessabel.art">
            hello@jessabel.art
          </a>
          .
        </>,
      ],
    },
    {
      id: 'what-we-collect',
      title: 'What data we collect',
      content: [
        <>
          <strong>Contact form submissions:</strong> name, email address, and your message. Sent via our form provider so
          we can reply to you.
        </>,
        <>
          <strong>Client uploads (Cloudinary widget):</strong> files you choose to upload (e.g., logos, briefs, images)
          and basic technical metadata necessary to complete the upload.
        </>,
        <>
          <strong>Client intake (Notion embed):</strong> the details you submit in the embedded intake form (e.g.,
          project requirements). Your browser may also share technical info with Notion to display the embed.
        </>,
        <>
          <strong>Usage data / analytics:</strong> high-level, privacy-friendly metrics (e.g., page views, referrers,
          approximate time on page). We don’t build profiles and do not use ad tracking.
        </>,
        <>
          <strong>Preferences:</strong> we may store lightweight settings (e.g., dark theme) in local storage or cookies
          so the site remembers your choices.
        </>,
      ],
    },
    {
      id: 'why-we-collect',
      title: 'Why we collect it',
      content: [
        <>
          <strong>Communication:</strong> to respond to your inquiries and continue conversations about potential or
          active projects.
        </>,
        <>
          <strong>Project delivery:</strong> to receive assets, understand requirements, and manage the project intake
          process.
        </>,
        <>
          <strong>Improve the site:</strong> to understand what content is useful and to keep the experience fast,
          accessible, and reliable.
        </>,
      ],
    },
    {
      id: 'legal-basis',
      title: 'Legal basis & retention',
      content: [
        <>
          <strong>Legal bases (where applicable):</strong> your consent (when you submit information), legitimate
          interests (to secure and improve the site, communicate with you), and contract necessity (to deliver client work).
        </>,
        <>
          <strong>Retention:</strong> contact messages are kept for up to <strong>12 months</strong> for reference, then
          deleted; project assets are kept for the duration of the engagement and a reasonable archival window (typically{' '}
          <strong>up to 24 months</strong>) unless you request earlier deletion; analytics data is kept only as long as
          needed for aggregate reporting.
        </>,
      ],
    },
    {
      id: 'third-parties',
      title: 'Third-party services we use',
      content: [
        <>
          We don’t sell your personal data. We share limited data with providers that help us run the site and projects:
        </>,
        <>
          <strong>Formspree</strong> (contact form processing); <strong>Cloudinary</strong> (client file uploads via
          widget); <strong>Notion</strong> (embedded intake form); website hosting/CDN and privacy-friendly analytics.
          These providers may process limited technical data (like IP address) to deliver their service securely.
        </>,
        <>
          Each provider has its own privacy practices. If you prefer not to use an embed (e.g., Notion), email us and
          we’ll provide an alternative (PDF/email).
        </>,
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies & local storage',
      content: [
        <>
          We use essential cookies/local storage for things like remembering your theme or improving page performance.
          We don’t use third-party advertising cookies.
        </>,
        <>
          You can clear cookies/local storage in your browser settings at any time. Blocking all storage may affect some
          features.
        </>,
      ],
    },
    {
      id: 'security',
      title: 'Security',
      content: [
        <>
          We use reasonable technical and organizational measures to protect data (HTTPS, limited access, least-privilege
          practices). No method of transmission or storage is 100% secure, but we take protection seriously.
        </>,
      ],
    },
    {
      id: 'international',
      title: 'International transfers',
      content: [
        <>
          Our site and many providers operate in the <strong>United States</strong>. If you access the site from another
          region, your data may be processed in countries with different data protection laws.
        </>,
      ],
    },
    {
      id: 'your-rights',
      title: 'Your rights',
      content: [
        <>
          Depending on your location, you may have rights to access, correct, delete, or receive a copy of your personal
          data, and to object or restrict certain processing. To exercise these rights, contact{' '}
          <a className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)]" href="mailto:hello@jessabel.art">
            hello@jessabel.art
          </a>
          .
        </>,
        <>
          If we rely on consent, you can withdraw it at any time (this won’t affect processing already performed). If you
          are a California resident, you may also have rights not to be discriminated against for exercising your
          privacy rights.
        </>,
      ],
    },
    {
      id: 'children',
      title: 'Children’s privacy',
      content: [
        <>
          This website isn’t directed to children under 13, and we don’t knowingly collect personal information from
          them.
        </>,
      ],
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      content: [
        <>
          We may update this policy to reflect changes to our practices. We’ll revise the “Effective date” and, when
          appropriate, provide additional notice.
        </>,
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      content: [
        <>
          Questions or requests? Email{' '}
          <a className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)]" href="mailto:hello@jessabel.art">
            hello@jessabel.art
          </a>
          .
        </>,
      ],
    },
  ];

  // soft orange backgrounds that alternate
  const bgByIndex = (i) => {
    const colors = [
      'bg-[#fee9a6]', // lightest
      'bg-[#ffe574]',
      'bg-[#fec200]',
      'bg-[#fa8a00]/10', // softer via opacity
    ];
    return colors[i % colors.length];
  };

  return (
    <div className="py-20">
      <Helmet>
        <title>Privacy Policy — Jessabel.Art</title>
        <meta
          name="description"
          content="Learn how Jessabel.Art handles your data with respect and transparency."
        />
      </Helmet>

      {/* Header band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-3xl px-6 py-10 md:px-10 md:py-14 bg-[#d74708] text-white relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] italic tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm md:text-base opacity-90">
            Effective date: <time dateTime={effectiveDate}>{effectiveDate}</time>
          </p>
          {isNew && (
            <span
              className="absolute top-4 right-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                         bg-white/15 ring-1 ring-white/40 backdrop-blur"
              aria-label="Recently updated"
            >
              New
            </span>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[280px,1fr] gap-8">
        {/* Sticky quick nav on desktop */}
        <nav className="hidden lg:block sticky top-24 self-start">
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
            <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-2">On this page</p>
            <ul className="space-y-2 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:underline
                               focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] rounded"
                    href={`#${s.id}`}
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => window.print()}
              className="mt-4 w-full text-center text-sm font-semibold text-white px-3 py-2 rounded-lg
                         bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]"
            >
              Print / Save PDF
            </button>
          </div>
        </nav>

        {/* Sections */}
        <motion.div {...fadeIn} className="space-y-6">
          {sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className={`rounded-2xl border border-[hsl(var(--border))] ${bgByIndex(i)} p-6 md:p-8 shadow-sm scroll-mt-24`}
            >
              <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">{section.title}</h2>
              <div className="space-y-4 text-[hsl(var(--muted-foreground))] leading-relaxed">
                {section.content.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </section>
          ))}

          {/* Contact card */}
          <section
            className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 md:p-8 shadow-sm text-center"
          >
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-3">Questions?</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              If you have any questions about this policy, feel free to reach out.
            </p>
            <a
              href="mailto:hello@jessabel.art?subject=Privacy%20Request&body=Hi%20Jessabel%2C%0A%0AI'd%20like%20to%20ask%20about%20%5Baccess%2Fdeletion%2Fupdate%5D%20of%20my%20data.%0A%0AThanks!"
              className="mt-4 inline-block font-semibold underline decoration-[hsl(var(--accent))] underline-offset-4 hover:no-underline text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] rounded"
            >
              hello@jessabel.art
            </a>
            <div className="mt-6">
              <a
                href="#overview"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold
                           text-white bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]"
              >
                Back to top
              </a>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;

