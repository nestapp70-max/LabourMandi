import { Hammer, Wrench, Zap, Droplet, Flame, Square, Paintbrush, Grid3x3, Truck, HardHat, Settings, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@shared/schema";

interface HeroSectionProps {
  onPostJob?: () => void;
}

const categoryIcons: Record<string, any> = {
  construction: Hammer,
  industrial: Settings,
  agricultural: Wrench,
  household: HardHat,
  transportation: Truck,
  event: Grid3x3,
  retail: Square,
  municipal: Droplet,
  specialized: Zap,
  maintenance: Paintbrush,
  other: Flame,
};

export function HeroSection({ onPostJob }: HeroSectionProps) {
  const displayCategories = CATEGORIES.slice(0, 8);

  return (
    <div className="relative w-full mb-6 sm:mb-8 overflow-hidden">
      {/* Hero Background with Indian Flag Colors */}
      <div className="relative bg-gradient-to-r from-orange-600 via-white to-green-600 rounded-lg overflow-hidden shadow-lg">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.05) 35px, rgba(0,0,0,.05) 70px)`
          }}></div>
        </div>

        {/* Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="hidden sm:block text-4xl">🇮🇳</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                    LabourMandi
                  </h1>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                    India's Marketplace for Skilled Technicians
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-xl mb-6">
                Find and hire trusted professionals across 100+ categories. Fast, reliable, and affordable services.
              </p>
              
              {/* CTA Button */}
              <Button
                onClick={onPostJob}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
                data-testid="hero-post-job"
              >
                Post Your Job Now
              </Button>
            </div>

            {/* Worker Types Grid */}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wide">
                Popular Services
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-8 gap-2 sm:gap-3">
                {displayCategories.map((category) => {
                  const Icon = categoryIcons[category.id] || Briefcase;
                  return (
                    <div
                      key={category.id}
                      className="flex flex-col items-center justify-center gap-1.5 p-2 sm:p-3 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                      data-testid={`hero-category-${category.id}`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs text-center font-medium text-gray-700 dark:text-gray-200 leading-tight">
                        {category.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
