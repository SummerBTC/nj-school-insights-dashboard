import { Badge } from "./ui/badge";
import { X } from "lucide-react";

interface GiftedFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const availableFilters = [
  { id: "gifted", label: "Gifted Program" },
  { id: "lowAbsentee", label: "Low Absentee (<5%)" },
  { id: "highMath", label: "High Math (>80%)" },
  { id: "highAsianPerformance", label: "High Asian Performance (>85%)" },
];

export function GiftedFilters({ activeFilters, onFilterChange }: GiftedFiltersProps) {
  const toggleFilter = (filterId: string) => {
    if (activeFilters.includes(filterId)) {
      onFilterChange(activeFilters.filter((f) => f !== filterId));
    } else {
      onFilterChange([...activeFilters, filterId]);
    }
  };

  const clearAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="bg-gradient-to-r from-white via-[#FFFBEB] to-white rounded-xl p-6 border-2 border-[#FBBF24]/20 shadow-lg mb-6 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#FBBF24]/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#3B82F6]/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h3 className="text-[#374151]">Filter Schools</h3>
          </div>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-[#EF4444] hover:text-[#DC2626] flex items-center gap-1 bg-[#FEF2F2] px-3 py-1.5 rounded-lg transition-colors"
            >
              <X className="size-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className="transition-all"
              >
                <Badge
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    isActive
                      ? "bg-[#3B82F6] text-white border-[#3B82F6] hover:bg-[#2563EB]"
                      : "border-[#E5E7EB] text-[#6B7280] hover:border-[#3B82F6] hover:text-[#3B82F6]"
                  }`}
                >
                  {filter.label}
                  {isActive && <X className="size-3 ml-2" />}
                </Badge>
              </button>
            );
          })}
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">
              {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
            </p>
          </div>
        )}
      </div>
    </div>
  );
}