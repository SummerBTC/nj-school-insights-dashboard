import type { School } from "../types/school";
import { useTheme } from "../theme/ThemeContext";

interface CountyStatsCardsProps {
  overallScore: number;
  totalSchools: number;
  giftedPrograms: number;
  avgMath: number;
  language: 'en' | 'zh';
}

export function CountyStatsCards({
  overallScore,
  totalSchools,
  giftedPrograms,
  avgMath,
  language,
}: CountyStatsCardsProps) {
  const { theme } = useTheme();

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {/* 综合评分 */}
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: theme.backgroundHover, borderColor: theme.primary + '33' }}
      >
        <div className="text-sm mb-1" style={{ color: theme.primary }}>
          {language === 'en' ? 'Overall Score' : '综合评分'}
        </div>
        <div className="text-2xl" style={{ color: theme.primary }}>
          {overallScore || 0}
          <span className="text-sm" style={{ color: theme.textMuted }}>/100</span>
        </div>
      </div>

      {/* 学校总数 */}
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: theme.backgroundHover, borderColor: theme.success + '33' }}
      >
        <div className="text-sm mb-1" style={{ color: theme.success }}>
          {language === 'en' ? 'Total Schools' : '学校总数'}
        </div>
        <div className="text-2xl" style={{ color: theme.success }}>
          {totalSchools}
          <span className="text-sm ml-1" style={{ color: theme.textMuted }}>
            {language === 'en' ? 'schools' : '所'}
          </span>
        </div>
      </div>

      {/* 资优项目 */}
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: theme.backgroundHover, borderColor: theme.warning + '33' }}
      >
        <div className="text-sm mb-1" style={{ color: theme.warning }}>
          {language === 'en' ? 'Gifted Programs' : '资优项目'}
        </div>
        <div className="text-2xl" style={{ color: theme.warning }}>
          {giftedPrograms}
          <span className="text-sm ml-1" style={{ color: theme.textMuted }}>
            {language === 'en' ? 'programs' : '个'}
          </span>
        </div>
      </div>

      {/* 平均数学 */}
      <div
        className="rounded-xl p-4 border"
        style={{ backgroundColor: theme.backgroundHover, borderColor: theme.info + '33' }}
      >
        <div className="text-sm mb-1" style={{ color: theme.info }}>
          {language === 'en' ? 'Avg Math' : '平均数学'}
        </div>
        <div className="text-2xl" style={{ color: theme.info }}>
          {avgMath || 0}
          <span className="text-sm" style={{ color: theme.textMuted }}>%</span>
        </div>
      </div>
    </div>
  );
}
