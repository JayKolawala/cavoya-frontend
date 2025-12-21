import React, { useEffect } from "react";
import { Heart, RefreshCw, Star, Sparkles } from "lucide-react";
import AOS from "aos";

const AboutPage = () => {
  // Data array for dynamic rendering
  const aboutData = {
    header: {
      title: "About Cavoya",
      tagline: "Crafting elegance, one thread at a time",
    },
    story: {
      title: "Our Story",
      content: [
        "Founded in 2020, Cavoya emerged from a passion for timeless elegance and sustainable fashion. We believe that true style transcends trends, focusing on quality craftsmanship and ethical practices.",
        "Every piece in our collection is carefully curated to offer you the perfect blend of comfort, style, and sustainability. From luxurious silks to organic cottons, we source the finest materials to create pieces that you'll treasure for years to come.",
        "Our commitment extends beyond fashion – we're dedicated to supporting artisans, promoting sustainable practices, and creating a positive impact in the fashion industry.",
      ],
      image: {
        src: "https://placehold.co/600x400/E8D2C5/543C42?text=Our+Story",
        alt: "About Cavoya",
      },
    },
    values: [
      {
        icon: Heart,
        iconColor: "text-white",
        gradientFrom: "from-blush-400",
        gradientTo: "to-blush-600",
        title: "Crafted with Love",
        description:
          "Every piece is made with attention to detail and genuine care",
      },
      {
        icon: RefreshCw,
        iconColor: "text-white",
        gradientFrom: "from-matcha-400",
        gradientTo: "to-matcha-600",
        title: "Sustainable Fashion",
        description:
          "Committed to ethical practices and environmental responsibility",
      },
      {
        icon: Star,
        iconColor: "text-white",
        gradientFrom: "from-sea-400",
        gradientTo: "to-sea-600",
        title: "Premium Quality",
        description: "Using only the finest materials and expert craftsmanship",
      },
    ],
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-[#111827] via-[#1f2937] to-[#4a1942] text-white py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-tangerine-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blush-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Header Content */}
        <div className="relative z-10 container mx-auto text-center" data-aos="fade-down">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-butter-300" />
            <span className="text-butter-100 text-sm font-light tracking-wider">
              Our Journey
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-4">
            {aboutData.header.title}
          </h1>

          <p className="text-lg md:text-xl font-light text-gray-200 max-w-2xl mx-auto">
            {aboutData.header.tagline}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Story Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div data-aos="fade-right">
              <div className="inline-block mb-4">
                <span className="px-4 py-2 bg-blush-100 text-blush-600 rounded-full text-sm font-semibold tracking-wider">
                  SINCE 2020
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {aboutData.story.title}
              </h2>

              <div className="space-y-4">
                {aboutData.story.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div
              className="relative group"
              data-aos="fade-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blush-400 to-tangerine-400 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={aboutData.story.image.src}
                  alt={aboutData.story.image.alt}
                  className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-12 text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-800">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {aboutData.values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradientFrom} ${value.gradientTo} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300`}></div>

                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${value.gradientFrom} ${value.gradientTo} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md`}>
                      <IconComponent className={`h-8 w-8 ${value.iconColor}`} />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3 text-gray-800 text-center">
                      {value.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-center">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
