import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, name = "Cavoya", type = "website" }) => {
  const location = useLocation();
  // We prefer an environment variable for the site URL, but fallback to origin
  const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
  const currentUrl = `${siteUrl}${location.pathname}`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title ? `${title} | ${name}` : name}</title>
      <meta name="description" content={description} />

      {/* Canonical URL to prevent duplicate content indexing */}
      <link rel="canonical" href={currentUrl} />

      {/* OpenGraph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title ? `${title} | ${name}` : name} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />

      {/* Twitter tags */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | ${name}` : name} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;
