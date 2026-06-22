import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import AOS from "aos";
import SEO from "../components/SEO";

const WHATSAPP_NUMBER = "917383096696"; // Replace with actual number (country code + number)

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleSubmit = (e) => {
    // ... existing submit logic ...
    e.preventDefault();

    const phone = WHATSAPP_NUMBER;

    const message =
      `*New Contact Form Submission*\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Subject:* ${formData.subject}\n\n` +
      `*Message:*\n${formData.message}`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': 'https://cavoya.in/#business',
      name: 'Cavoya',
      description: 'Premium women\'s fashion brand based in Surat, Gujarat, India.',
      url: 'https://cavoya.in',
      email: 'support@cavoya.in',
      image: 'https://cavoya.in/cavoya_logo.PNG',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '142, Puna Kumbhariya Road, Bhagyoday Industrial Estate, Parvat Patiya',
        addressLocality: 'Surat',
        addressRegion: 'Gujarat',
        postalCode: '395010',
        addressCountry: 'IN',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '10:00',
          closes: '19:00',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How can I contact Cavoya?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can contact Cavoya via email at support@cavoya.in or by sending a WhatsApp message to +91 73830 96696. Our team responds Monday to Saturday, 10AM to 7PM IST.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where is Cavoya located?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cavoya is located at 142, Puna Kumbhariya Road, Bhagyoday Industrial Estate, Parvat Patiya, Surat, Gujarat 395010, India.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is Cavoya\'s return policy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Cavoya offers returns and refunds as per our return policy. Please visit our Returns page or contact us directly for assistance.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does Cavoya ship across India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Cavoya ships premium women\'s fashion across India. Shipping details and timelines are provided at checkout.',
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="Contact Cavoya | Reach Us in Surat, India"
        description="Get in touch with Cavoya — India's premium women's fashion brand. Email us at support@cavoya.in, WhatsApp us, or visit our Surat, Gujarat showroom. We're here Monday to Saturday, 10AM–7PM IST."
        structuredData={contactSchemas}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact Us', url: '/contact' },
        ]}
      />
      {/* Hero Section - Synced with HomePage */}
      <div className="relative pt-32 pb-20 flex items-center justify-center text-center bg-gray-50 border-b border-gray-200 text-gray-900">
        {/* Hero Content */}
        <div
          className="relative z-10 text-center px-4"
          data-aos="fade-down"
        >
          <h1 className="text-4xl md:text-6xl font-extralight tracking-wide mb-6 text-gray-900">
            Get in Touch
          </h1>

          <p className="text-lg md:text-xl font-light text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 flex-grow">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Email
              </h3>
              <p className="text-gray-600">support@cavoya.in</p>
              <p className="text-gray-600">info@cavoya.com</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Phone
              </h3>
              <p className="text-gray-600">+91 98765 43210</p>
              <p className="text-gray-600">Mon-Sat: 10AM - 7PM IST</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Address
              </h3>
              <p className="text-gray-600">
                142, Puna kumbhariya Road, Bhagyoday Industrial Estate, Parvat Patiya,
                <br />
                Surat, Gujarat 395010
                <br />
                India
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-light mb-6 text-gray-800">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-4 rounded-none hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
