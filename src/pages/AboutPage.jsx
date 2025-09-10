import React from "react";
import { Heart, RefreshCw, Star } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light mb-6">About Cavoya</h1>
          <p className="text-xl text-gray-600">
            Crafting elegance, one thread at a time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-light mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2020, Cavoya emerged from a passion for timeless
              elegance and sustainable fashion. We believe that true style
              transcends trends, focusing on quality craftsmanship and ethical
              practices.
            </p>
            <p className="text-gray-600 mb-4">
              Every piece in our collection is carefully curated to offer you
              the perfect blend of comfort, style, and sustainability. From
              luxurious silks to organic cottons, we source the finest materials
              to create pieces that you'll treasure for years to come.
            </p>
            <p className="text-gray-600">
              Our commitment extends beyond fashion – we're dedicated to
              supporting artisans, promoting sustainable practices, and creating
              a positive impact in the fashion industry.
            </p>
          </div>
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <img
              src="https://placehold.co/600x400/E8D2C5/543C42?text=Our+Story"
              alt="About Cavoya"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Crafted with Love</h3>
            <p className="text-gray-600">
              Every piece is made with attention to detail and genuine care
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Sustainable Fashion</h3>
            <p className="text-gray-600">
              Committed to ethical practices and environmental responsibility
            </p>
          </div>
          <div className="text-center p-6">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-medium mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              Using only the finest materials and expert craftsmanship
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
