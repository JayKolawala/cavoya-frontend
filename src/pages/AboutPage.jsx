import React, { use, useEffect } from "react";
import { Heart, RefreshCw, Star } from "lucide-react";
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
        iconColor: "text-blush-500",
        bgColor: "bg-blush-100",
        title: "Crafted with Love",
        description:
          "Every piece is made with attention to detail and genuine care",
      },
      {
        icon: RefreshCw,
        iconColor: "text-matcha-500",
        bgColor: "bg-matcha-100",
        title: "Sustainable Fashion",
        description:
          "Committed to ethical practices and environmental responsibility",
      },
      {
        icon: Star,
        iconColor: "text-sea-500",
        bgColor: "bg-sea-100",
        title: "Premium Quality",
        description: "Using only the finest materials and expert craftsmanship",
      },
    ],
  };

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <section className="container mx-auto px-4 pt-24 bg-gradient-to-b from-butter-50 to-white">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 " data-aos="fade-down">
          <h1 className="text-4xl font-light mb-2">{aboutData.header.title}</h1>
          <p className="text-xl text-gray-600">{aboutData.header.tagline}</p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-light mb-6">
              {aboutData.story.title}
            </h2>
            {aboutData.story.content.map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          <div
            className="bg-gray-200 rounded-lg h-96 flex items-center justify-center"
            data-aos="fade-left"
          >
            <img
              src={aboutData.story.image.src}
              alt={aboutData.story.image.alt}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {aboutData.values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div key={index} className="text-center p-6 hover:bg-white rounded-lg transition-all hover:shadow-lg">
                <div
                  className={`${value.bgColor} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110`}
                >
                  <IconComponent className={`h-8 w-8 ${value.iconColor}`} />
                </div>
                <h3 className="text-xl font-medium mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
