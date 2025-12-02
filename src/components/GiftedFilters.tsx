import { useTheme } from "../theme/ThemeContext";
import { X, Check } from "lucide-react";

interface GiftedFiltersProps {
  activeFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const availableFilters = [
  { id: "gifted", label: "Gifted", shortLabel: "Gifted" },
  { id: "lowAbsentee", label: "Low Absentee (<5%)", shortLabel: "Low Absent" },
  { id: "highMath", label: "High Math (>80%)", shortLabel: "High Math" },
  { id: "highAsianPerformance", label: "High Asian (>85%)", shortLabel: "High Asian" },
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

        {/* Compact Button Group - Airbnb Style */}
        <div className="flex flex-wrap gap-2">
          {availableFilters.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className="px-4 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap border-2"
                style={
                  isActive
                    ? {
                        backgroundColor: theme.info,
                        color: '#FFFFFF',
                        borderColor: theme.info,
                        boxShadow: `0px 2px 8px ${theme.info}33`
                      }
                    : {
                        backgroundColor: theme.backgroundElevated,
                        borderColor: theme.border,
                        color: theme.textSecondary
                      }
                }
              >
                {isActive && <Check className="size-4" />}
                <span className="hidden sm:inline">{filter.label}</span>
                <span className="sm:hidden">{filter.shortLabel}</span>
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