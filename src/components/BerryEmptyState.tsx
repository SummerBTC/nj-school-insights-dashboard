import { useTheme } from "../theme/ThemeContext";
import { Search } from "lucide-react";

interface BerryEmptyStateProps {
  language: 'en' | 'zh';
  onSearchClick?: () => void;
  variant?: 'default' | 'trends' | 'school-details';
}

export function BerryEmptyState({ language, onSearchClick, variant = 'default' }: BerryEmptyStateProps) {
  const { theme } = useTheme();

  // Customize content based on variant
  const isTrends = variant === 'trends';
  const isSchoolDetails = variant === 'school-details';

  // For trends, show ultra-minimal single line
  if (isTrends) {
    return (
      <p className="text-2xl text-center max-w-2xl px-6" style={{ color: theme.textSecondary }}>
        {language === 'en'
          ? 'No school selected — use the search bar above to enter a school, district, or ZIP code to view trend charts.'
          : '未选择学校 — 使用上方搜索栏输入学校、学区或邮编以查看趋势图表。'}
      </p>
    );
  }

  // For school details, show simplified single line
  if (isSchoolDetails) {
    return (
      <p className="text-2xl text-center max-w-2xl px-6" style={{ color: theme.textSecondary }}>
        {language === 'en'
          ? 'No school selected — use the search bar above to enter a school, district, or ZIP code to view school details.'
          : '未选择学校 — 使用上方搜索栏输入学校、学区或邮编以查看学校详情。'}
      </p>
    );
  }

  // Default variant with full Berry experience
  const title = language === 'en' ? 'Oops! Berry is waiting...' : '哎呀！Berry 在等你...';
  const message = language === 'en'
    ? 'Search for a school name, district, or zip code to view detailed performance data.'
    : '搜索学校名称、学区或邮编，查看详细的学校表现数据。';

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-[#FFB3C6]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-[#A78BFA]/20 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-md">
        {/* Berry Character */}
        <div className="mb-6 animate-bounce">
          <div className="text-8xl mb-2">🫐</div>
          <div className="text-2xl font-bold" style={{ color: theme.primary, fontFamily: "'Fredoka', 'Comic Sans MS', cursive" }}>
            {title}
          </div>
        </div>

        {/* Message */}
        <p className="text-lg mb-8" style={{ color: theme.textSecondary }}>
          {message}
        </p>

        {/* Search prompt */}
        <div className="flex items-center justify-center gap-2 mb-6 p-4 rounded-2xl" style={{ backgroundColor: theme.primaryGlow }}>
          <Search className="size-5" style={{ color: theme.primary }} />
          <p className="text-sm font-semibold" style={{ color: theme.primary }}>
            {language === 'en'
              ? 'Use the search bar above to get started 🍓'
              : '使用上方搜索栏开始探索 🍓'}
          </p>
        </div>

        {/* Stats or tips */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
            <div className="text-2xl font-bold mb-1" style={{ color: theme.info }}>500+</div>
            <div className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'en' ? 'Schools' : '学校'}
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
            <div className="text-2xl font-bold mb-1" style={{ color: theme.success }}>21</div>
            <div className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'en' ? 'Counties' : '县区'}
            </div>
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
            <div className="text-2xl font-bold mb-1" style={{ color: theme.warning }}>K-12</div>
            <div className="text-xs" style={{ color: theme.textMuted }}>
              {language === 'en' ? 'Grades' : '年级'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
