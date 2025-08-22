import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

/**
 * Thin redirector so older/internal links like /case-study/full-sail keep working.
 * It forwards to the dynamic case-study route that uses your projects[] data.
 */
export default function FullSailCaseStudyPage() {
  // optional: scroll to top on mount for nicer UX
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Full Sail UX Certificate — Case Study</title>
        <meta name="description" content="Full Sail UX certificate case study by Jessabel Santos." />
        <link rel="canonical" href="https://jessabel.art/portfolio/full-sail" />
      </Helmet>

      {/* Immediate redirect to the canonical route */}
      <Navigate to="/portfolio/full-sail" replace />
    </>
  );
}
