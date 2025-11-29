import { TrendingUp, TrendingDown } from "lucide-react";
import type { School } from "../types/school";
import { useTheme } from "../theme/ThemeContext";

interface SchoolResultCardProps {
  school: School;
  onSelect: (school: School) => void;
}

export function SchoolResultCard({ school, onSelect }: SchoolResultCardProps) {
  const { theme } = useTheme();

  return (
    <article
      onClick={() => onSelect(school)}
      className="rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}
    >
      {/* Top row: School name + Score */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-3">
          <h2 className="text-base font-semibold leading-tight" style={{ color: theme.text }}>
            {school.name}
          </h2>
          <p className="text-[11px] mt-1" style={{ color: theme.textSecondary }}>
            {school.type} · {school.grades} · {school.county}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] uppercase tracking-wide" style={{ color: theme.textMuted }}>Score</div>
          <div className="text-xl font-bold" style={{ color: theme.primary }}>{school.overallScore}</div>
        </div>
      </div>

      {/* Metrics pills */}
      <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
        {/* Math */}
        <span className="px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ backgroundColor: theme.primaryGlow, color: theme.primary }}>
          Math {school.mathProficiency}
          {school.trends.mathChange !== 0 && (
            <span style={{ color: school.trends.mathChange > 0 ? theme.success : theme.error }}>
              {school.trends.mathChange > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(school.trends.mathChange)}
            </span>
          )}
        </span>

        {/* ELA */}
        <span className="px-2.5 py-1 rounded-full font-medium flex items-center gap-1" style={{ backgroundColor: theme.primaryGlow, color: theme.accentDark }}>
          ELA {school.elaProficiency}
          {school.trends.elaChange !== 0 && (
            <span style={{ color: school.trends.elaChange > 0 ? theme.success : theme.error }}>
              {school.trends.elaChange > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(school.trends.elaChange)}
            </span>
          )}
        </span>

        {/* Attendance */}
        <span className="px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: theme.primaryGlow, color: theme.warning }}>
          Att {(100 - school.chronicAbsenteeism).toFixed(0)}
        </span>

        {/* Student-Teacher Ratio */}
        <span className="px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: theme.primaryGlow, color: theme.accent }}>
          Class {school.studentTeacherRatio}:1
        </span>

        {/* Optional: Gifted badge */}
        {school.giftedTalentedProgram && (
          <span className="px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: theme.primaryGlow, color: theme.primary }}>
            ⭐ Gifted
          </span>
        )}
      </div>
    </article>
  );
}
