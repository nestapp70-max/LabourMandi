import {
  Hammer,
  Wrench,
  Zap,
  Droplet,
  Flame,
  Square,
  Paintbrush,
  Grid3x3,
  Truck,
  HardHat,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@shared/schema";

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

interface CategoryIconSliderProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryIconSlider({
  selectedCategory,
  onSelectCategory,
}: CategoryIconSliderProps) {
  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {CATEGORIES.map((category) => {
          const Icon = categoryIcons[category.id] || Hammer;
          const isSelected = selectedCategory === category.id;

          return (
            <Button
              key={category.id}
              variant="ghost"
              className={`flex-shrink-0 flex-col h-auto py-3 px-4 gap-2 min-w-[85px] rounded-lg transition-all font-semibold ${
                isSelected
                  ? 'bg-blue-600 dark:bg-orange-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover-elevate active-elevate-2 hover:text-blue-600 dark:hover:text-orange-400'
              }`}
              onClick={() => onSelectCategory(category.id)}
              data-testid={`button-category-${category.id}`}
            >
              <Icon className={`h-6 w-6 transition-colors ${isSelected ? 'text-white' : ''}`} />
              <span className="text-xs font-medium text-center leading-tight">
                {category.name.split(' ')[0]}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
