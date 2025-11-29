import { Badge } from "./ui/badge";
import { useTheme } from "../theme/ThemeContext";
import { MapPin, Users, GraduationCap } from "lucide-react";
import type { School } from "../types/school";

interface OverviewCardProps {
  school: School;
  language: 'en' | 'zh';
}

export function OverviewCard({ school, language }: OverviewCardProps) {
  const { theme } = useTheme();

  return (
    <div className="rounded-xl p-8 border-2 shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.info + '33' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#3B82F6]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#22C55E]/5 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="mb-2 text-4xl font-bold" style={{ color: theme.text }}>{school.name}</h2>
            <div className="flex items-center gap-3" style={{ color: theme.textSecondary }}>
              <Badge variant="outline" style={{ borderColor: theme.info, color: theme.info, backgroundColor: theme.info + '1A' }}>
                {school.type}
              </Badge>
              {school.giftedProgram && (
                <Badge variant="outline" className="flex items-center gap-1" style={{ borderColor: theme.success, color: theme.success, backgroundColor: theme.success + '1A' }}>
                  <GraduationCap className="size-3" />
                  {language === 'en' ? 'Contains Gifted Program' : '包含资优项目'}
                </Badge>
              )}
              <span>•</span>
              <span>{school.grades}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{school.county}</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-gradient-to-br from-[#FFB3C6] to-[#FFC9D9] p-4 rounded-xl shadow-lg" style={{ color: '#2E2E2E' }}>
            <div className="text-3xl mb-1">{school.overallScore}</div>
            <div className="text-xs opacity-90">
              {language === 'en' ? 'Overall Score' : '综合评分'}
            </div>
          </div>
        </div>

        <p className="mb-6" style={{ color: theme.textSecondary }}>
          {school.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.info + '33' }}>
            <div className="text-sm mb-1" style={{ color: theme.info }}>
              {language === 'en' ? 'Math Proficiency' : '数学水平'}
            </div>
            <div className="text-2xl" style={{ color: theme.info }}>{school.mathProficiency}%</div>
            {school.trends.mathChange !== 0 && (
              <div className="text-sm" style={{ color: school.trends.mathChange > 0 ? theme.success : theme.error }}>
                {school.trends.mathChange > 0 ? '▲' : '▼'} {Math.abs(school.trends.mathChange)} {language === 'en' ? 'pt' : '分'}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.success + '33' }}>
            <div className="text-sm mb-1" style={{ color: theme.success }}>
              {language === 'en' ? 'ELA Proficiency' : '英语水平'}
            </div>
            <div className="text-2xl" style={{ color: theme.success }}>{school.elaProficiency}%</div>
            {school.trends.elaChange !== 0 && (
              <div className="text-sm" style={{ color: school.trends.elaChange > 0 ? theme.success : theme.error }}>
                {school.trends.elaChange > 0 ? '▲' : '▼'} {Math.abs(school.trends.elaChange)} {language === 'en' ? 'pt' : '分'}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.warning + '33' }}>
            <div className="text-sm mb-1" style={{ color: theme.warning }}>
              {language === 'en' ? 'Attendance' : '出勤率'}
            </div>
            <div className="text-2xl" style={{ color: theme.warning }}>{100 - school.chronicAbsenteeism}%</div>
            <div className="text-sm" style={{ color: theme.textMuted }}>
              {school.chronicAbsenteeism}% {language === 'en' ? 'absent' : '缺勤'}
            </div>
          </div>

          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.primary + '33' }}>
            <div className="text-sm mb-1" style={{ color: theme.primary }}>
              {language === 'en' ? 'Student-Teacher' : '师生比'}
            </div>
            <div className="text-2xl" style={{ color: theme.primary }}>1:{school.studentTeacherRatio}</div>
            <div className="flex items-center gap-1 text-sm" style={{ color: theme.textMuted }}>
              <Users className="size-3" />
              <span>{school.enrollment}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}