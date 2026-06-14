import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SLIDES = [
    {
        id: "1",
        type: "image",
        url: "/ScarletDress-bg.JPEG",
        title: "The Cavoya Collection",
        subtitle: "Elegance in every stitch. Discover timeless fashion.",
        buttonText: "Explore Collections",
        buttonLink: "/products"
    },
    {
        id: "2",
        type: "image",
        url: "/LilyDress.PNG",
        title: "Pure Elegance",
        subtitle: "Designed for movement. Crafted for elegance.",
        buttonText: "Shop New Arrivals",
        buttonLink: "/products"
    },
    {
        id: "3",
        type: "image",
        url: "/Riviera-set.png",
        title: "The Riviera Set",
        subtitle: "Sophisticated resort wear for your next getaway.",
        buttonText: "Explore More",
        buttonLink: "/products"
    },

];

const HeroCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const timeoutRef = useRef(null);

    // Setup autoplay
    useEffect(() => {
        if (SLIDES.length <= 1 || isHovered) return;

        const nextSlide = () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
        };

        timeoutRef.current = setTimeout(nextSlide, 6000); // 6s duration

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex, isHovered]);

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex - 1 + SLIDES.length) % SLIDES.length);
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % SLIDES.length);
    };

    const handleDotClick = (index, e) => {
        e.stopPropagation();
        setCurrentIndex(index);
    };

    return (
        <div
            className="group relative min-h-screen w-full overflow-hidden bg-black select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides container */}
            {SLIDES.map((slide, index) => {
                const isActive = index === currentIndex;
                return (
                    <div
                        key={slide.id || index}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                            }`}
                    >
                        {/* Background Media */}
                        {slide.type === "video" ? (
                            <video
                                key={slide.url}
                                className="absolute inset-0 w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src={slide.url} type="video/mp4" />
                            </video>
                        ) : (
                            <img
                                src={slide.url}
                                alt={slide.title || "Hero banner"}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        )}

                        {/* Elegant Dark Overlay */}
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Slide Content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className={`relative z-20 text-center px-4 max-w-4xl mx-auto transform transition-all duration-1000 delay-300 ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                                    }`}
                            >


                                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extralight tracking-wide mb-6 text-white leading-tight font-serif">
                                    {slide.title}
                                </h1>

                                <p className="text-lg sm:text-xl md:text-2xl font-light mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed">
                                    {slide.subtitle}
                                </p>

                                {slide.buttonText && (
                                    <div className="flex justify-center items-center">
                                        <button
                                            onClick={() => navigate(slide.buttonLink || "/products")}
                                            className="group px-10 py-4 bg-white text-black font-semibold rounded-none hover:bg-gray-100 hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                                        >
                                            <span className="flex items-center gap-2">
                                                {slide.buttonText}
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Slider Navigation Chevrons */}
            {SLIDES.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        aria-label="Previous slide"
                        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/35 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 items-center justify-center"
                    >
                        <ChevronLeft className="h-6 w-6 stroke-[1.5]" />
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label="Next slide"
                        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/35 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-black transition-all duration-300 opacity-0 group-hover:opacity-100 items-center justify-center"
                    >
                        <ChevronRight className="h-6 w-6 stroke-[1.5]" />
                    </button>
                </>
            )}

            {/* Slide Indicator Dots */}
            {SLIDES.length > 1 && (
                <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-3">
                    {SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => handleDotClick(index, e)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HeroCarousel;
