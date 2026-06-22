import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BrandAuthoritySection
 * ─────────────────────
 * An SEO-rich content section displayed on the Homepage below the Best Sellers grid.
 * Uses brand keywords naturally without stuffing, and maintains the premium
 * luxury aesthetic of Cavoya.
 *
 * Covers:
 *  - About Cavoya (who we are)
 *  - Why Choose Cavoya
 *  - Fashion categories offered (internal links)
 *  - Brand mission
 */

const CATEGORIES = [
  {
    name: 'Dresses',
    href: '/products?category=dresses',
    desc: 'Elegant cuts for every occasion',
    icon: '✦',
  },
  {
    name: 'Co-ord Sets',
    href: '/products?category=coord-sets',
    desc: 'Effortlessly matched, always stylish',
    icon: '✦',
  },
  {
    name: 'Ethnic Wear',
    href: '/products?category=ethnic-wear',
    desc: 'Heritage craft, modern silhouettes',
    icon: '✦',
  },
  {
    name: 'Western Wear',
    href: '/products?category=western-wear',
    desc: 'Contemporary styles for today\'s woman',
    icon: '✦',
  },
  {
    name: 'Tops',
    href: '/products?category=tops',
    desc: 'Versatile pieces for every wardrobe',
    icon: '✦',
  },
  {
    name: 'Jumpsuits',
    href: '/products?category=jumpsuits',
    desc: 'One-piece wonders, endless style',
    icon: '✦',
  },
];

const WHY_CHOOSE = [
  {
    heading: 'Premium Quality Fabrics',
    body: 'Every Cavoya garment is crafted from consciously sourced, high-quality fabrics that feel as good as they look — durable, breathable, and designed to last.',
  },
  {
    heading: 'Distinctive Prints',
    body: 'Cavoya clothing is defined by fully-printed garments with bold yet refined patterns. Each print is a signature of the brand — vibrant, emotional, and uniquely expressive.',
  },
  {
    heading: 'Adaptable Silhouettes',
    body: 'Cavoya fashion is built around you. Intelligently designed silhouettes adapt to your movement and your life, ensuring comfort without compromising on elegance.',
  },
  {
    heading: 'Made for Real Women',
    body: "Cavoya's women's fashion collections are thoughtfully sized and structured to celebrate every body. Because women were never meant to fit in — they were meant to stand out.",
  },
];

const BrandAuthoritySection = () => {
  const navigate = useNavigate();

  return (
    <section
      aria-label="About Cavoya Fashion Brand"
      className="bg-white border-t border-gray-100"
    >
      {/* ── About Cavoya ── */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-gray-100 text-gray-600 text-xs font-semibold tracking-[0.2em] uppercase rounded-full mb-5">
            The Brand
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-6 tracking-wide">
            About Cavoya
          </h2>
          <div className="w-12 h-px bg-gray-400 mx-auto mb-8" />
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            <strong className="text-gray-900 font-medium">Cavoya</strong> is a premium women's fashion brand
            headquartered in Surat, Gujarat, India — the textile capital of the country. Founded on
            the belief that fashion should move with a woman and never limit her, Cavoya redefines
            contemporary women's clothing for the modern, ever-evolving woman. From elegant
            dresses and co-ord sets to ethnic wear and western styles, every Cavoya collection
            is designed to celebrate femininity, comfort, and self-expression.
          </p>
        </div>

        {/* ── Why Choose Cavoya ── */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-serif font-light text-gray-900 text-center mb-12 tracking-wide">
            Why Choose Cavoya Fashion?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WHY_CHOOSE.map((item, i) => (
              <div
                key={i}
                className="flex gap-5 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">{item.heading}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Shop by Category ── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-serif font-light text-gray-900 mb-4 tracking-wide">
              Cavoya Fashion Collections
            </h3>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Explore our curated range of premium women's clothing — designed for every mood, occasion, and moment in her life.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.name}
                href={cat.href}
                onClick={(e) => { e.preventDefault(); navigate(cat.href); }}
                className="group relative block p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-900 hover:bg-gray-900 transition-all duration-300"
                aria-label={`Shop ${cat.name} at Cavoya`}
              >
                <span className="text-lg font-serif font-light text-gray-900 group-hover:text-white transition-colors block mb-1">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">
                  {cat.desc}
                </span>
                <svg
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* ── Brand Mission ── */}
        <div className="relative bg-gray-900 rounded-3xl overflow-hidden p-10 md:p-16 text-center">
          {/* subtle radial glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(ellipse at center, #888 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <span className="inline-block text-gray-400 text-xs font-semibold tracking-[0.3em] uppercase mb-6">
              Our Mission
            </span>
            <h3 className="text-2xl md:text-4xl font-serif font-light text-white mb-6 leading-relaxed max-w-3xl mx-auto">
              "Rooted in flow, strength, and femininity — Cavoya Clothing is made around women, because they were never meant to fit in."
            </h3>
            <p className="text-gray-400 text-base max-w-2xl mx-auto mb-10">
              As a premium women's fashion brand in India, Cavoya is committed to creating garments
              that adapt to every chapter of a woman's journey — celebrating her individuality, her
              story, and her style.
            </p>
            <a
              href="/about"
              onClick={(e) => { e.preventDefault(); navigate('/about'); }}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-gray-900 font-semibold text-sm tracking-wide rounded-none hover:bg-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
              aria-label="Learn more about Cavoya Fashion Brand"
            >
              Discover Our Story
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandAuthoritySection;
