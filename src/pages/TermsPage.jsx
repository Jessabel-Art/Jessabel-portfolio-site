import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const TermsPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' },
  };

  const effectiveDate = '2025-08-11';

  // Badge if updated in last 30 days
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
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: [
        <>
          By accessing or using this website, you agree to these Terms. If you do not agree, please do not use the site.
          These Terms apply to the public site and any embedded tools (e.g., contact forms, client uploads, intake forms).
        </>,
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      content: [
        <>
          Use this site respectfully. Do not interfere with its operation, attempt to gain unauthorized access, scrape at
          scale, reverse engineer, or use automated bots that degrade service. Do not upload unlawful, infringing, or
          malicious content.
        </>,
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      content: [
        <>
          All content on this website—including design, text, graphics, logos, case studies, and media—is owned by
          Jessabel.Art or used with permission. You may not copy, reproduce, or distribute any content without prior
          written consent, except as allowed by applicable law (e.g., brief quotations with attribution).
        </>,
      ],
    },
    {
      id: 'user-content',
      title: 'User-Submitted Content',
      content: [
        <>
          If you submit content (e.g., files via the client upload widget, intake information, or messages), you
          represent that you have the rights to share it and that it does not violate any third-party rights or laws. You
          grant us a limited license to use that content solely to evaluate, plan, design, and deliver your project or to
          respond to your inquiry.
        </>,
        <>
          You are responsible for backing up your submissions. We may remove or disable access to content we believe may
          be unlawful or infringing.
        </>,
      ],
    },
    {
      id: 'portfolio-rights',
      title: 'Portfolio Rights',
      content: [
        <>
          We retain the right to display work created for clients in our portfolio (online and in print) for marketing
          purposes. We respect confidentiality agreements and will not share sensitive or proprietary information.
        </>,
      ],
    },
    {
      id: 'third-parties',
      title: 'Third-Party Links & Services',
      content: [
        <>
          This site may link to or embed third-party services (e.g., contact form processing, file uploads, Notion
          embeds). We don’t control those services and aren’t responsible for their content or practices. Your use of
          third-party services is governed by their terms and policies.
        </>,
      ],
    },
    {
      id: 'availability',
      title: 'Site Availability & Changes',
      content: [
        <>
          The site is provided on an “as is” and “as available” basis. We may modify, suspend, or discontinue any part of
          the site at any time without notice. We may also update these Terms; the “Effective date” will reflect the most
          recent version.
        </>,
      ],
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      content: [
        <>
          We strive to make the site accessible and usable. If you encounter barriers, please email{' '}
          <a className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] rounded" href="mailto:hello@jessabel.art">
            hello@jessabel.art
          </a>{' '}
          and we will work to provide an alternative or improve the experience.
        </>,
      ],
    },
    {
      id: 'no-warranty',
      title: 'Warranty Disclaimer',
      content: [
        <>
          The site and its content are provided <em>“as is”</em> without warranties of any kind, express or implied,
          including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We do not
          guarantee that the site will be error-free or uninterrupted.
        </>,
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: [
        <>
          To the fullest extent permitted by law, we will not be liable for any indirect, incidental, special,
          consequential, exemplary, or punitive damages, or for lost profits, data, or goodwill, arising from or related
          to your use of the site.
        </>,
      ],
    },
    {
      id: 'indemnity',
      title: 'Indemnification',
      content: [
        <>
          You agree to indemnify and hold us harmless from claims arising out of your misuse of the site or violation of
          these Terms, including reasonable attorneys’ fees.
        </>,
      ],
    },
    {
      id: 'dmca',
      title: 'Copyright / Takedown',
      content: [
        <>
          If you believe content on this site infringes your copyright, contact{' '}
          <a className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] rounded" href="mailto:hello@jessabel.art">
            hello@jessabel.art
          </a>{' '}
          with details of the work and the allegedly infringing material. We will review and respond appropriately.
        </>,
      ],
    },
    {
      id: 'engagements',
      title: 'Client Engagements (Projects)',
      content: [
        <>
          Project-specific terms (scope, timelines, fees, revision limits, IP transfer, confidentiality, payment
          schedules) will be defined in a separate proposal or agreement. If there is a conflict between that agreement
          and this page, the agreement governs.
        </>,
        <>
          Unless otherwise agreed in writing, final deliverables are transferred to the client upon receipt of full
          payment. Working files and exploration artifacts are not included by default.
        </>,
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing Law & Venue',
      content: [
        <>
          These Terms are governed by the laws of the jurisdiction where we are based, without regard to conflict of law
          principles. Venue and jurisdiction lie in the courts of that location.
        </>,
      ],
    },
    {
      id: 'misc',
      title: 'Miscellaneous',
      content: [
        <>
          <strong>Severability:</strong> if any provision is found unenforceable, the rest remain in effect.
        </>,
        <>
          <strong>No waiver:</strong> failure to enforce a provision is not a waiver of our right to do so later.
        </>,
        <>
          <strong>Entire agreement:</strong> these Terms constitute the entire agreement regarding site use and supersede
          prior communications on that subject.
        </>,
      ],
    },
    {
      id: 'changes',
      title: 'Changes to These Terms',
      content: [
        <>
          We may update these Terms from time to time. Material changes will be reflected on this page with an updated
          effective date. Your continued use of the site after changes indicates acceptance.
        </>,
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      content: [
        <>
          Questions about these Terms? Email{' '}
          <a className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] rounded" href="mailto:hello@jessabel.art">
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
      'bg-[#fa8a00]/10', // softer with opacity
    ];
    return colors[i % colors.length];
  };

  return (
    <div className="py-20">
      <Helmet>
        <title>Terms of Service — Jessabel.Art</title>
        <meta
          name="description"
          content="Read the terms of service for using the Jessabel.Art website."
        />
      </Helmet>

      {/* Header band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="rounded-3xl px-6 py-10 md:px-10 md:py-14 bg-[#d74708] text-white relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] italic tracking-tight">Terms of Service</h1>
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
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-3">Contact</h2>
            <p className="text-[hsl(var(--muted-foreground))]">
              For questions about these Terms, please contact me.
            </p>
            <a
              href="mailto:hello@jessabel.art?subject=Terms%20Question"
              className="mt-4 inline-block font-semibold underline decoration-[hsl(var(--accent))] underline-offset-4 hover:no-underline text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[var(--orange-600,#fa8a00)] rounded"
            >
              hello@jessabel.art
            </a>
            <div className="mt-6">
              <a
                href="#acceptance"
                className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-semibold
                           text-white bg-[linear-gradient(135deg,var(--btn-pink,#ff3ea5),var(--btn-teal,#00c2b2))]"
              >
                Back to top
              </a>
            </div>
          </section>

          {/* Note */}
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
            This page is for general information and isn’t legal advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;

