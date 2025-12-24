import { Trophy, TrendingUp, Users, Award, BarChart3 } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { useEffect, useRef, useState } from "react";
import type { School } from "../types/school";
import type { SortOption, GroupByOption } from "./RankingControls";

interface EnhancedSchoolRankingListProps {
  schools: School[];
  activeFilters: Set<string>;
  quickFind: string;
  sortBy: SortOption;
  groupBy: GroupByOption;
  language: 'en' | 'zh';
}

export function EnhancedSchoolRankingList({
  schools,
  activeFilters,
  quickFind,
  sortBy,
  groupBy,
  language
}: EnhancedSchoolRankingListProps) {
  const { theme } = useTheme();
  const tableRef = useRef<HTMLDivElement>(null);
  const [highlightedSchoolId, setHighlightedSchoolId] = useState<string | null>(null);

  // Apply filters
  const filteredSchools = schools.filter((school) => {
    if (activeFilters.has('gifted') && !school.giftedProgram) return false;
    if (activeFilters.has('lowAbsentee') && school.chronicAbsenteeism >= 5) return false;
    if (activeFilters.has('highMath') && school.mathProficiency < 80) return false;
    if (activeFilters.has('highELA') && school.elaProficiency < 80) return false;
    if (activeFilters.has('highAsianPerf') && school.performanceByDemographic.asian.math < 85) return false;
    if (activeFilters.has('positiveGrowth') && school.trends.mathChange <= 0) return false;
    if (activeFilters.has('smallClass') && school.studentTeacherRatio > 15) return false;
    if (activeFilters.has('largeSchool') && school.enrollment < 500) return false;
    return true;
  });

  // Apply Quick Find
  const quickFindFiltered = quickFind
    ? filteredSchools.filter((school) =>
        school.name.toLowerCase().includes(quickFind.toLowerCase()) ||
        school.district.toLowerCase().includes(quickFind.toLowerCase())
      )
    : filteredSchools;

  // Sorting logic
  const sortedSchools = [...quickFindFiltered].sort((a, b) => {
    switch (sortBy) {
      case 'math':
        return b.mathProficiency - a.mathProficiency;
      case 'ela':
        return b.elaProficiency - a.elaProficiency;
      case 'growth':
        return b.trends.mathChange - a.trends.mathChange;
      case 'stRatio':
        return a.studentTeacherRatio - b.studentTeacherRatio;
      case 'asianPercent':
        return b.demographics.asian - a.demographics.asian;
      case 'attendance':
        return (100 - a.chronicAbsenteeism) - (100 - b.chronicAbsenteeism);
      case 'overall':
      default:
        return b.overallScore - a.overallScore;
    }
  });

  // Grouping logic
  const groupedSchools: { [key: string]: School[] } = {};

  if (groupBy === 'none') {
    groupedSchools['All Schools'] = sortedSchools;
  } else if (groupBy === 'district') {
    sortedSchools.forEach((school) => {
      const key = school.district;
      if (!groupedSchools[key]) groupedSchools[key] = [];
      groupedSchools[key].push(school);
    });
  } else if (groupBy === 'gradeRange') {
    sortedSchools.forEach((school) => {
      let key = 'Other';
      const grades = school.grades.toLowerCase();
      if (grades.includes('k') || grades.includes('pk') || grades.match(/[0-5]/)) {
        key = language === 'en' ? 'Elementary (K-5)' : '小学 (K-5)';
      } else if (grades.match(/[6-8]/)) {
        key = language === 'en' ? 'Middle School (6-8)' : '初中 (6-8)';
      } else if (grades.match(/[9]/)) {
        key = language === 'en' ? 'High School (9-12)' : '高中 (9-12)';
      }
      if (!groupedSchools[key]) groupedSchools[key] = [];
      groupedSchools[key].push(school);
    });
  } else if (groupBy === 'program') {
    sortedSchools.forEach((school) => {
      const key = school.giftedProgram
        ? (language === 'en' ? 'With Gifted Program' : '含资优项目')
        : (language === 'en' ? 'No Gifted Program' : '无资优项目');
      if (!groupedSchools[key]) groupedSchools[key] = [];
      groupedSchools[key].push(school);
    });
  }

  // Quick Find highlighting and scroll
  useEffect(() => {
    if (quickFind && quickFindFiltered.length > 0) {
      const firstMatch = quickFindFiltered[0];
      setHighlightedSchoolId(firstMatch.id);

      // Scroll to first match
      setTimeout(() => {
        const element = document.getElementById(`school-row-${firstMatch.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Clear highlight after 3 seconds
      const timer = setTimeout(() => setHighlightedSchoolId(null), 3000);
      return () => clearTimeout(timer);
    } else {
      setHighlightedSchoolId(null);
    }
  }, [quickFind, quickFindFiltered]);

  // Calculate summary statistics
  const stats = {
    total: quickFindFiltered.length,
    avgMath: Math.round(quickFindFiltered.reduce((sum, s) => sum + s.mathProficiency, 0) / quickFindFiltered.length || 0),
    avgELA: Math.round(quickFindFiltered.reduce((sum, s) => sum + s.elaProficiency, 0) / quickFindFiltered.length || 0),
    topDistrict: Object.entries(
      quickFindFiltered.reduce((acc, s) => {
        acc[s.district] = (acc[s.district] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number })
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A',
    mostImproved: [...quickFindFiltered].sort((a, b) => b.trends.mathChange - a.trends.mathChange)[0]?.name || 'N/A'
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-[#FBBF24]";
    if (rank === 2) return "text-[#9CA3AF]";
    if (rank === 3) return "text-[#CD7F32]";
    return "text-[#6B7280]";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Ranking List */}
      <div className="lg:col-span-3">
        <div className="rounded-lg overflow-hidden border" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.border }}>
          {quickFindFiltered.length === 0 ? (
            <div className="p-12 text-center">
              <p style={{ color: theme.textSecondary }}>
                {quickFind
                  ? (language === 'en'
                      ? `No schools found matching "${quickFind}". Try a different search term.`
                      : `未找到匹配 "${quickFind}" 的学校。尝试其他搜索词。`)
                  : (language === 'en'
                      ? 'No schools match your filter criteria. Try removing some filters.'
                      : '没有学校符合您的筛选条件。请尝试移除一些筛选器。')
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto" ref={tableRef}>
              {Object.entries(groupedSchools).map(([groupName, groupSchools]) => (
                <div key={groupName}>
                  {groupBy !== 'none' && (
                    <div className="sticky top-0 z-10 px-4 py-3 border-b-2 flex items-center gap-2" style={{ backgroundColor: theme.primary + '15', borderColor: theme.primary }}>
                      <Award className="size-5" style={{ color: theme.primary }} />
                      <h3 className="font-bold text-lg" style={{ color: theme.primary }}>{groupName}</h3>
                      <span className="text-sm px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primary + '20', color: theme.primary }}>
                        {groupSchools.length} {language === 'en' ? 'schools' : '所学校'}
                      </span>
                    </div>
                  )}

                  <table className="w-full">
                    <thead style={{ backgroundColor: theme.backgroundHover }}>
                      <tr>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold" style={{ color: theme.text }}>
                          {language === 'en' ? 'Rank' : '排名'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold" style={{ color: theme.text }}>
                          {language === 'en' ? 'School' : '学校'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold" style={{ color: theme.text }}>
                          {language === 'en' ? 'Score' : '总分'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold hidden sm:table-cell" style={{ color: theme.text }}>
                          {language === 'en' ? 'Math' : '数学'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold hidden sm:table-cell" style={{ color: theme.text }}>
                          {language === 'en' ? 'ELA' : '英语'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text }}>
                          {language === 'en' ? 'Gifted' : '资优'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text }}>
                          {language === 'en' ? 'S-T' : '师生'}
                        </th>
                        <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold hidden md:table-cell" style={{ color: theme.text }}>
                          {language === 'en' ? 'District' : '学区'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: theme.border }}>
                      {groupSchools.map((school, index) => {
                        const rank = index + 1;
                        const isHighlighted = school.id === highlightedSchoolId;
                        return (
                          <tr
                            key={school.id}
                            id={`school-row-${school.id}`}
                            className="hover:bg-opacity-50 transition-all duration-300"
                            style={{
                              backgroundColor: isHighlighted
                                ? theme.warning + '40'
                                : rank <= 3
                                ? theme.primaryGlow
                                : 'transparent',
                              borderLeft: isHighlighted ? `4px solid ${theme.warning}` : '4px solid transparent'
                            }}
                            onMouseEnter={(e) => {
                              if (!isHighlighted) e.currentTarget.style.backgroundColor = theme.backgroundHover;
                            }}
                            onMouseLeave={(e) => {
                              if (!isHighlighted) e.currentTarget.style.backgroundColor = rank <= 3 ? theme.primaryGlow : 'transparent';
                            }}
                          >
                            {/* Rank */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <div
                                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                style={
                                  rank === 1 ? { background: 'linear-gradient(to bottom right, #FBBF24, #F59E0B)', color: '#FFFFFF' } :
                                  rank === 2 ? { background: 'linear-gradient(to bottom right, #94A3B8, #64748B)', color: '#FFFFFF' } :
                                  rank === 3 ? { background: 'linear-gradient(to bottom right, #D97706, #B45309)', color: '#FFFFFF' } :
                                  { backgroundColor: theme.backgroundHover, color: theme.textSecondary }
                                }
                              >
                                {rank <= 3 ? (
                                  <Trophy className="size-4 sm:size-5" />
                                ) : (
                                  <span className="text-xs sm:text-sm font-semibold">{rank}</span>
                                )}
                              </div>
                            </td>

                            {/* School Name */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3">
                              <div className="font-medium text-sm sm:text-base" style={{ color: theme.text }}>{school.name}</div>
                              <div className="text-xs hidden sm:block" style={{ color: theme.textSecondary }}>{school.grades} • {school.county}</div>
                            </td>

                            {/* Overall Score */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center">
                              <div className="text-base sm:text-lg font-bold" style={{ color: theme.primary }}>{school.overallScore}</div>
                            </td>

                            {/* Math */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center hidden sm:table-cell">
                              <div className="font-semibold text-sm" style={{ color: theme.text }}>{school.mathProficiency}%</div>
                              {school.trends.mathChange !== 0 && (
                                <div className="flex items-center justify-center gap-1 text-xs" style={{ color: school.trends.mathChange > 0 ? theme.success : theme.error }}>
                                  <TrendingUp className={`size-3 ${school.trends.mathChange < 0 ? 'rotate-180' : ''}`} />
                                  {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange}
                                </div>
                              )}
                            </td>

                            {/* ELA */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center font-semibold text-sm hidden sm:table-cell" style={{ color: theme.text }}>
                              {school.elaProficiency}%
                            </td>

                            {/* Gifted */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center hidden lg:table-cell">
                              {school.giftedProgram ? (
                                <span style={{ color: theme.success }}>✓</span>
                              ) : (
                                <span style={{ color: theme.textMuted }}>-</span>
                              )}
                            </td>

                            {/* Student-Teacher Ratio */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm hidden lg:table-cell" style={{ color: theme.text }}>
                              1:{school.studentTeacherRatio}
                            </td>

                            {/* District */}
                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell" style={{ color: theme.textSecondary }}>
                              {school.district}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Insights Panel */}
      <div className="space-y-4">
        <div className="rounded-xl p-5 border-2 shadow-lg" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.primary + '33' }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="size-5" style={{ color: theme.primary }} />
            <h3 className="font-bold" style={{ color: theme.text }}>
              {language === 'en' ? 'Insights' : '统计'}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Total Schools */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: theme.info + '15' }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Total Schools' : '学校总数'}
              </div>
              <div className="text-2xl font-bold" style={{ color: theme.info }}>{stats.total}</div>
            </div>

            {/* Average Math */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: theme.success + '15' }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Avg Math' : '平均数学'}
              </div>
              <div className="text-2xl font-bold" style={{ color: theme.success }}>{stats.avgMath}%</div>
            </div>

            {/* Average ELA */}
            <div className="p-3 rounded-lg" style={{ backgroundColor: theme.warning + '15' }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Avg ELA' : '平均英语'}
              </div>
              <div className="text-2xl font-bold" style={{ color: theme.warning }}>{stats.avgELA}%</div>
            </div>

            {/* Top District */}
            <div className="p-3 rounded-lg border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Top District' : '最多学区'}
              </div>
              <div className="text-sm font-semibold truncate" style={{ color: theme.text }}>{stats.topDistrict}</div>
            </div>

            {/* Most Improved */}
            <div className="p-3 rounded-lg border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Most Improved' : '进步最大'}
              </div>
              <div className="text-sm font-semibold truncate" style={{ color: theme.text }}>{stats.mostImproved}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
