import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

interface ServiceSliderProps {
  selectedService?: string;
  onSelectService: (service: string) => void;
}

const SERVICES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'AC Service',
  'Cleaning',
  'Welding',
  'Masonry',
  'Repairs',
  'Installation',
  'Maintenance',
  'Renovation',
  'Tilework',
  'Landscaping',
  'Glass Work',
];

export function ServiceSlider({ selectedService, onSelectService }: ServiceSliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollContainerRef.current.scrollLeft <
        scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
      );
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {canScrollLeft && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => scroll('left')}
          data-testid="button-service-scroll-left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide flex-1"
        onScroll={checkScroll}
        onLoad={checkScroll}
        data-testid="service-slider-container"
      >
        {SERVICES.map((service) => (
          <button
            key={service}
            onClick={() => onSelectService(service.toLowerCase())}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium text-sm transition-all flex-shrink-0 ${
              selectedService?.toLowerCase() === service.toLowerCase()
                ? 'bg-blue-600 dark:bg-orange-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-orange-400'
            }`}
            data-testid={`btn-service-${service.toLowerCase()}`}
          >
            {service}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
          onClick={() => scroll('right')}
          data-testid="button-service-scroll-right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
