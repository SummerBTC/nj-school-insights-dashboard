import { TrendingUp, TrendingDown, BookOpen, Calculator } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import type { School } from "../types/school";

interface AcademicSnapshotProps {
  school: School;
  language: 'en' | 'zh';
}

export function AcademicSnapshot({ school, language }: AcademicSnapshotProps) {
  const { theme } = useTheme();
  return (
    <div className="rounded-xl p-6 border-2 shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.info + '33' }}>
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${theme.info}20 0%, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="mb-4">
          <h3 style={{ color: theme.text }}>
            {language === 'en' ? 'Academic Performance' : '学业表现'}
          </h3>
        </div>

        {/* Two metrics in horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Math Proficiency */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="size-4" style={{ color: theme.info }} />
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                {language === 'en' ? 'Math Proficiency' : '数学水平'}
              </span>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: theme.info }}>
              {school.mathProficiency}%
            </div>

            {/* Trend indicator */}
            {school.trends.mathChange !== 0 && (
              <div className="flex items-center gap-1 mb-2" style={{ color: school.trends.mathChange > 0 ? theme.success : theme.error }}>
                {school.trends.mathChange > 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                <span className="text-sm font-semibold">
                  {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange} {language === 'en' ? 'pts' : '分'}
                </span>
              </div>
            )}

            {/* Performance by Group */}
            <div className="mt-3">
              <div className="text-xs mb-2" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Performance by Group' : '各族裔表现'}
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Asian', value: school.performanceByDemographic.asian.math, color: theme.success },
                  { label: 'White', value: school.performanceByDemographic.white.math, color: theme.warning },
                  { label: 'Hispanic', value: school.performanceByDemographic.hispanic.math, color: theme.accent },
                  { label: 'Black', value: school.performanceByDemographic.black.math, color: theme.error }
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span style={{ color: theme.textSecondary }}>{label}</span>
                      <span style={{ color: theme.text }} className="font-semibold">{value}%</span>
                    </div>
                    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
                      <div
                        className="absolute top-0 left-0 h-full transition-all rounded-full"
                        style={{ width: `${value}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ELA Proficiency */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="size-4" style={{ color: theme.success }} />
              <span className="text-sm font-medium" style={{ color: theme.text }}>
                {language === 'en' ? 'ELA Proficiency' : '英语水平'}
              </span>
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: theme.success }}>
              {school.elaProficiency}%
            </div>

            {/* Trend indicator */}
            {school.trends.elaChange !== 0 && (
              <div className="flex items-center gap-1 mb-2" style={{ color: school.trends.elaChange > 0 ? theme.success : theme.error }}>
                {school.trends.elaChange > 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                <span className="text-sm font-semibold">
                  {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange} {language === 'en' ? 'pts' : '分'}
                </span>
              </div>
            )}

            {/* Performance by Group */}
            <div className="mt-3">
              <div className="text-xs mb-2" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Performance by Group' : '各族裔表现'}
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Asian', value: school.performanceByDemographic.asian.ela, color: theme.success },
                  { label: 'White', value: school.performanceByDemographic.white.ela, color: theme.warning },
                  { label: 'Hispanic', value: school.performanceByDemographic.hispanic.ela, color: theme.accent },
                  { label: 'Black', value: school.performanceByDemographic.black.ela, color: theme.error }
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span style={{ color: theme.textSecondary }}>{label}</span>
                      <span style={{ color: theme.text }} className="font-semibold">{value}%</span>
                    </div>
                    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.border }}>
                      <div
                        className="absolute top-0 left-0 h-full transition-all rounded-full"
                        style={{ width: `${value}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}