import React, { useEffect } from "react";
import { Heart, RefreshCw, Star, Sparkles, Linkedin, Mail } from "lucide-react";
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
        "Born from the belief that fashion should move with a woman and never limit her, Cavoya redefines contemporary western wear for the modern, ever-evolving woman. Built on a foundation of sustainability, the brand uses consciously chosen fabrics to craft pieces that feel as good as they look. Cavoya creates versatile wardrobe essentials thoughtfully designed for the rhythm of real life.",
        "At the heart of Cavoya is a deep love for expressive colours and distinctive prints. Every garment is fully printed, bringing vibrancy, emotion, and personality to the collection. The prints are bold yet refined, allowing women to express themselves effortlessly with elegance and versatility.",
        "What truly sets Cavoya apart is its intelligently adjustable silhouettes that move with a woman through every phase of her journey. As bodies change and lifestyles evolve, Cavoya adapts while offering comfort without compromising on style. Rooted in flow, strength, and femininity, Cavoya is made around women because they were never meant to fit in.",
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
        gradientFrom: "from-gray-600",
        gradientTo: "to-gray-800",
        title: "Crafted with Love",
        description:
          "Every piece is made with attention to detail and genuine care",
      },
      {
        icon: RefreshCw,
        iconColor: "text-white",
        gradientFrom: "from-gray-500",
        gradientTo: "to-gray-700",
        title: "Sustainable Fashion",
        description:
          "Committed to ethical practices and environmental responsibility",
      },
      {
        icon: Star,
        iconColor: "text-white",
        gradientFrom: "from-gray-700",
        gradientTo: "to-black",
        title: "Premium Quality",
        description: "Using only the finest materials and expert craftsmanship",
      },
    ],
    founders: [
      {
        name: "ZEEL JARIWALA",
        role: "Founder",
        description: "Zeel jariwala leads with a strong focus on quality, production, and execution. With deep involvement in sourcing and manufacturing, she ensures every piece reflects purity of material, fine craftsmanship, and consistent standards the brand stands for.",
        image: "/founder1.jpg",
        linkedin: "#",
        email: "sophia@cavoya.com",
      },
      {
        name: "RIYA CHEVLI",
        role: "Founder",
        description: "Riya chevli is the creative force behind the brand, bringing a sharp eye for design, colour, and contemporary styling. Her passion for textiles and aesthetics shapes collections that feel fresh, vibrant, and emotionally connected to the modern woman.",
        image: "/founder2.jpg",
        linkedin: "#",
        email: "alexandra@cavoya.com",
      },
    ],
  };

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-20 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gray-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Header Content */}
        <div className="relative z-10 container mx-auto text-center" data-aos="fade-down">
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <Sparkles className="w-4 h-4 text-gray-300" />
            <span className="text-gray-200 text-sm font-light tracking-wider">
              Our Journey
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-4">
            {aboutData.header.title}
          </h1>

          <p className="text-lg md:text-xl font-light text-gray-300 max-w-2xl mx-auto">
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
                <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold tracking-wider">
                  SINCE 2026
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-light mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {aboutData.story.title}
              </h2>

              <div className="space-y-4">
                {aboutData.story.content.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div
              className="relative group"
              data-aos="fade-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
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
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">
              Our Core Values
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.gradientFrom} ${value.gradientTo} rounded-2xl opacity-0 group-hover:opacity-10 blur transition-all duration-300`}></div>

                  <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${value.gradientFrom} ${value.gradientTo} rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-md`}>
                      <IconComponent className={`h-8 w-8 ${value.iconColor}`} />
                    </div>

                    <h3 className="text-2xl font-semibold mb-3 text-gray-900 text-center">
                      {value.title}
                    </h3>

                    <p className="text-gray-500 leading-relaxed text-center">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Founders Section */}
          <div className="mb-12 text-center" data-aos="fade-up">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold tracking-wider">
                LEADERSHIP
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-gray-900">
              Meet Our Founders
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              The visionaries behind Cavoya's commitment to sustainable elegance
            </p>
          </div>

          <div className="space-y-20">
            {aboutData.founders.map((founder, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Section */}
                <div
                  className={`relative group ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div
                  className={`space-y-6 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                    }`}
                >
                  <div>
                    <h3 className="text-3xl md:text-4xl font-light mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {founder.name}
                    </h3>
                    <p className="text-xl text-gray-600 font-medium mb-4">
                      {founder.role}
                    </p>
                  </div>

                  <p className="text-gray-600 leading-relaxed text-lg">
                    {founder.description}
                  </p>

                  {/* Social Links */}
                  <div className="flex gap-4 pt-4">
                    <a
                      href={founder.linkedin}
                      className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="font-medium">LinkedIn</span>
                    </a>
                    <a
                      href={`mailto:${founder.email}`}
                      className="group flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      <Mail className="w-5 h-5" />
                      <span className="font-medium">Email</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
