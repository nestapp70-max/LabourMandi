import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// FIXED IMPORT PATHS ⬇⬇⬇
import plumberImg from "../../attached_assets/generated_images/indian_plumber_at_work.png";
import electricianImg from "../../attached_assets/generated_images/indian_electrician_working.png";
import carpenterImg from "../../attached_assets/generated_images/indian_carpenter_crafting_wood.png";
import masonImg from "../../attached_assets/generated_images/indian_mason_construction_work.png";
import welderImg from "../../attached_assets/generated_images/indian_welder_at_work.png";
// ⬆⬆⬆ FIXED IMPORT PATHS

interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
}

interface HeroCarouselProps {
  onPostJob?: () => void;
}

const slides: Slide[] = [
  {
    id: "plumber",
    image: plumberImg,
    title: "Plumbing Services",
    description: "Expert plumbers for all your water system needs",
  },
  {
    id: "electrician",
    image: electricianImg,
    title: "Electrical Services",
    description: "Licensed electricians for installations and repairs",
  },
  {
    id: "carpenter",
    image: carpenterImg,
    title: "Carpentry Services",
    description: "Skilled carpenters for furniture and construction",
  },
  {
    id: "mason",
    image: masonImg,
    title: "Masonry Services",
    description: "Professional masons for construction and repairs",
  },
  {
    id: "welder",
    image: welderImg,
    title: "Welding Services",
    description: "Expert welders for metal work and fabrication",
  },
];

export function HeroCarousel({ onPostJob }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const nextSlide = () => {
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full mb-6 sm:mb-8 overflow-hidden rounded-xl shadow-2xl">
      {/* Carousel Container */}
      <div className="relative w-full h-48 sm:h-64 md:h-72 lg:h-96 bg-gray-200 dark:bg-slate-800">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-sm sm:text-base text-white/90 mb-4 drop-shadow-md">
              {slide.description}
            </p>
            <Button
              onClick={onPostJob}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base w-fit"
            >
              Post Your Job
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all hover:scale-110"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`transition-all ${
                idx === currentSlide
                  ? "bg-emerald-500 w-8 h-2"
                  : "bg-white/50 hover:bg-white/70 w-2 h-2"
              } rounded-full`}
            />
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 via-white to-green-500 px-4 sm:px-6 py-3 sm:py-4">
        <p className="text-center text-xs sm:text-sm font-bold text-gray-900">
          🇮🇳 Connecting India with Skilled Technicians • 100+ Categories •
          Instant Booking
        </p>
      </div>
    </div>
  );
}
