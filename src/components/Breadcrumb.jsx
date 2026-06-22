import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Breadcrumb component
 * ─────────────────────
 * Renders a visual breadcrumb trail + injects a BreadcrumbList JSON-LD schema.
 *
 * Props:
 *  items — Array of { name: string, href: string }.
 *          Last item is treated as the current page (no link rendered).
 *
 * Usage:
 *  <Breadcrumb items={[
 *    { name: 'Home', href: '/' },
 *    { name: 'Shop', href: '/products' },
 *    { name: 'Scarlet Dress', href: '/product/abc123' },
 *  ]} />
 */
const Breadcrumb = ({ items = [] }) => {
  const navigate = useNavigate();

  if (!items || items.length < 2) return null;

  const SITE_URL = 'https://cavoya.in';

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href.startsWith('http') ? item.href : `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      {/* Inject BreadcrumbList JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Visual Breadcrumb Trail */}
      <nav aria-label="Breadcrumb" className="w-full">
        <ol
          className="flex flex-wrap items-center gap-1 text-sm text-gray-500"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={index}
                className="flex items-center gap-1"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {isLast ? (
                  <span
                    className="text-gray-800 font-medium truncate max-w-[200px]"
                    aria-current="page"
                    itemProp="name"
                  >
                    {item.name}
                  </span>
                ) : (
                  <>
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); navigate(item.href); }}
                      className="hover:text-gray-900 hover:underline transition-colors truncate max-w-[150px]"
                      itemProp="item"
                    >
                      <span itemProp="name">{item.name}</span>
                    </a>
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
                <meta itemProp="position" content={String(index + 1)} />
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;
