import { Trophy, TrendingUp, Users, GraduationCap } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { Badge } from "./ui/badge";
import type { School } from "../types/school";

interface SchoolRankingListProps {
  schools: School[];
  activeFilters: string[];
  language: 'en' | 'zh';
}

export function SchoolRankingList({ schools, activeFilters, language }: SchoolRankingListProps) {
  const { theme } = useTheme();

  // Apply filters
  const filteredSchools = schools.filter((school) => {
    if (activeFilters.includes("gifted") && !school.giftedProgram) return false;
    if (activeFilters.includes("lowAbsentee") && school.chronicAbsenteeism >= 5) return false;
    if (activeFilters.includes("highMath") && school.mathProficiency < 80) return false;
    if (activeFilters.includes("highAsianPerformance") && school.performanceByDemographic.asian.math < 85) return false;
    return true;
  });

  // Sort by math proficiency
  const rankedSchools = [...filteredSchools].sort((a, b) => b.mathProficiency - a.mathProficiency);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-[#FBBF24]";
    if (rank === 2) return "text-[#9CA3AF]";
    if (rank === 3) return "text-[#CD7F32]";
    return "text-[#6B7280]";
  };

  return (
    <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.border }}>
      {rankedSchools.length === 0 ? (
        <div className="p-12 text-center">
          <p style={{ color: theme.textSecondary }}>
            {language === 'en'
              ? 'No schools match your filter criteria. Try removing some filters.'
              : '没有学校符合您的筛选条件。请尝试移除一些筛选器。'
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: theme.backgroundHover }}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'Rank' : '排名'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'School Name' : '学校名称'}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'District' : '学区'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'Overall' : '总分'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'Math' : '数学'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'ELA' : '英语'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'Gifted' : '资优'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'S-T Ratio' : '师生比'}
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold" style={{ color: theme.text }}>
                  {language === 'en' ? 'Asian Math' : '亚裔数学'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.border }}>
              {rankedSchools.map((school, index) => {
                const rank = index + 1;
                return (
                  <tr
                    key={school.id}
                    className="hover:bg-opacity-50 transition-colors"
                    style={{
                      backgroundColor: rank <= 3 ? theme.primaryGlow : 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.backgroundHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = rank <= 3 ? theme.primaryGlow : 'transparent';
                    }}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full"
                        style={
                          rank === 1 ? { background: 'linear-gradient(to bottom right, #FBBF24, #F59E0B)', color: '#FFFFFF' } :
                          rank === 2 ? { background: 'linear-gradient(to bottom right, #94A3B8, #64748B)', color: '#FFFFFF' } :
                          rank === 3 ? { background: 'linear-gradient(to bottom right, #D97706, #B45309)', color: '#FFFFFF' } :
                          { backgroundColor: theme.backgroundHover, color: theme.textSecondary }
                        }
                      >
                        {rank <= 3 ? (
                          <Trophy className="size-5" />
                        ) : (
                          <span className="text-sm font-semibold">{rank}</span>
                        )}
                      </div>
                    </td>

                    {/* School Name */}
                    <td className="px-4 py-3">
                      <div className="font-medium" style={{ color: theme.text }}>{school.name}</div>
                      <div className="text-xs" style={{ color: theme.textSecondary }}>{school.grades} • {school.county}</div>
                    </td>

                    {/* District */}
                    <td className="px-4 py-3 text-sm" style={{ color: theme.textSecondary }}>
                      {school.district}
                    </td>

                    {/* Overall Score */}
                    <td className="px-4 py-3 text-center">
                      <div className="text-lg font-bold" style={{ color: theme.primary }}>{school.overallScore}</div>
                    </td>

                    {/* Math */}
                    <td className="px-4 py-3 text-center">
                      <div className="font-semibold" style={{ color: theme.text }}>{school.mathProficiency}%</div>
                      {school.trends.mathChange !== 0 && (
                        <div className="flex items-center justify-center gap-1 text-xs" style={{ color: school.trends.mathChange > 0 ? theme.success : theme.error }}>
                          <TrendingUp className={`size-3 ${school.trends.mathChange < 0 ? 'rotate-180' : ''}`} />
                          {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange}
                        </div>
                      )}
                    </td>

                    {/* ELA */}
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: theme.text }}>
                      {school.elaProficiency}%
                    </td>

                    {/* Gifted */}
                    <td className="px-4 py-3 text-center">
                      {school.giftedProgram ? (
                        <span style={{ color: theme.success }}>✓</span>
                      ) : (
                        <span style={{ color: theme.textMuted }}>-</span>
                      )}
                    </td>

                    {/* Student-Teacher Ratio */}
                    <td className="px-4 py-3 text-center text-sm" style={{ color: theme.text }}>
                      1:{school.studentTeacherRatio}
                    </td>

                    {/* Asian Math */}
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: theme.text }}>
                      {school.performanceByDemographic.asian.math}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}