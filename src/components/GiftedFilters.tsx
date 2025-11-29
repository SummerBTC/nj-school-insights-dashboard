import { Badge } from "./ui/badge";
import { useTheme } from "../theme/ThemeContext";
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
  const { theme } = useTheme();

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
    <div className="rounded-xl p-6 border-2 shadow-lg mb-6 relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.warning + '33' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#FBBF24]/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#3B82F6]/10 to-transparent rounded-full blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <h3 style={{ color: theme.text }}>Filter Schools</h3>
          </div>
          {activeFilters.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: theme.error, backgroundColor: theme.error + '1A' }}
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
                  className="cursor-pointer px-4 py-2"
                  style={
                    isActive
                      ? { backgroundColor: theme.info, color: '#FFFFFF', borderColor: theme.info }
                      : { borderColor: theme.border, color: theme.textSecondary }
                  }
                >
                  {filter.label}
                  {isActive && <X className="size-3 ml-2" />}
                </Badge>
              </button>
            );
          })}
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} active
            </p>
          </div>
        )}
      </div>
    </div>
  );
}