import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://cavoya.in';
const SITE_NAME = 'Cavoya';
const DEFAULT_IMAGE = 'https://cavoya.in/cavoya_logo.PNG';
const DEFAULT_IMAGE_WIDTH = 1200;
const DEFAULT_IMAGE_HEIGHT = 630;

/**
 * SEO component — injects per-page <head> metadata via react-helmet-async.
 *
 * Props:
 *  title         — Page-specific title. Rendered as "<title> | Cavoya" unless fullTitle is set.
 *  fullTitle     — If provided, used as-is (no " | Cavoya" suffix).
 *  description   — Meta description (recommended 150–160 chars).
 *  image         — Absolute URL for OG/Twitter card image. Falls back to logo.
 *  imageAlt      — Alt text for the OG image.
 *  type          — OG type: "website" | "product" | "article". Default "website".
 *  noIndex       — If true, adds noindex,nofollow robots directive.
 *  structuredData — Array of JSON-LD objects to inject as <script type="application/ld+json">.
 *  breadcrumbs   — Array of { name, url } for BreadcrumbList schema (auto-generated).
 */
const SEO = ({
  title,
  fullTitle,
  description,
  image,
  imageAlt,
  type = 'website',
  noIndex = false,
  structuredData = [],
  breadcrumbs = [],
}) => {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const ogImage = image || DEFAULT_IMAGE;
  const ogImageAlt = imageAlt || `${SITE_NAME} - Premium Women's Fashion Brand in India`;

  // Build the final page title
  const pageTitle = fullTitle
    ? fullTitle
    : title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Premium Women's Fashion Brand in India`;

  // Build BreadcrumbList schema from breadcrumbs prop
  const breadcrumbSchema =
    breadcrumbs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}`,
          })),
        }
      : null;

  const allSchemas = [
    ...structuredData,
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ];

  return (
    <Helmet>
      {/* ── Standard metadata ── */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* ── Canonical URL ── */}
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content={String(DEFAULT_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(DEFAULT_IMAGE_HEIGHT)} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:locale" content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@cavoyafashion" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {/* ── JSON-LD Structured Data ── */}
      {allSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
