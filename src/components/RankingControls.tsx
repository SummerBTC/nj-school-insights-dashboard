import { useTheme } from "../theme/ThemeContext";
import { Search, X, Check, SlidersHorizontal, ArrowUpDown, RotateCcw } from "lucide-react";
import { useState } from "react";

export interface RankingFilters {
  // Academic
  minMath: number;
  minELA: number;
  positiveGrowth: boolean;
  gifted: boolean;
  highAsianPerformance: boolean;

  // Demographic
  minAsianPercent: number;
  minWhitePercent: number;
  minHispanicPercent: number;
  minBlackPercent: number;

  // Operational
  maxStudentTeacherRatio: number;
  minEnrollment: number;
  maxEnrollment: number;
  lowAbsentee: boolean;
}

export type SortOption = 'overall' | 'math' | 'ela' | 'growth' | 'stRatio' | 'asianPercent' | 'attendance';
export type GroupByOption = 'none' | 'district' | 'gradeRange' | 'program';

interface RankingControlsProps {
  quickFind: string;
  onQuickFindChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  groupBy: GroupByOption;
  onGroupByChange: (value: GroupByOption) => void;
  activeFilters: Set<string>;
  onFilterToggle: (filterId: string) => void;
  onClearFilters: () => void;
  language: 'en' | 'zh';
}

export function RankingControls({
  quickFind,
  onQuickFindChange,
  sortBy,
  onSortChange,
  groupBy,
  onGroupByChange,
  activeFilters,
  onFilterToggle,
  onClearFilters,
  language
}: RankingControlsProps) {
  const { theme } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const academicFilters = [
    { id: 'highMath', label: language === 'en' ? 'High Math (>80%)' : '高数学 (>80%)', shortLabel: language === 'en' ? 'High Math' : '高数学' },
    { id: 'highELA', label: language === 'en' ? 'High ELA (>80%)' : '高英语 (>80%)', shortLabel: language === 'en' ? 'High ELA' : '高英语' },
    { id: 'gifted', label: language === 'en' ? 'Gifted Program' : '资优项目', shortLabel: language === 'en' ? 'Gifted' : '资优' },
    { id: 'positiveGrowth', label: language === 'en' ? 'Positive Growth' : '正增长', shortLabel: language === 'en' ? '+ Growth' : '正增长' },
    { id: 'highAsianPerf', label: language === 'en' ? 'High Asian (>85%)' : '亚裔高分 (>85%)', shortLabel: language === 'en' ? 'Asian >85%' : '亚裔>85%' },
  ];

  const operationalFilters = [
    { id: 'lowAbsentee', label: language === 'en' ? 'Low Absentee (<5%)' : '低缺勤 (<5%)', shortLabel: language === 'en' ? 'Low Absent' : '低缺勤' },
    { id: 'smallClass', label: language === 'en' ? 'Small Class (≤15:1)' : '小班 (≤15:1)', shortLabel: language === 'en' ? '≤15:1' : '≤15:1' },
    { id: 'largeSchool', label: language === 'en' ? 'Large School (>500)' : '大校 (>500)', shortLabel: language === 'en' ? 'Large' : '大校' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'overall', label: language === 'en' ? 'Overall Score' : '综合评分' },
    { value: 'math', label: language === 'en' ? 'Math' : '数学' },
    { value: 'ela', label: language === 'en' ? 'ELA' : '英语' },
    { value: 'growth', label: language === 'en' ? 'Growth Rate' : '增长率' },
    { value: 'stRatio', label: language === 'en' ? 'S-T Ratio' : '师生比' },
    { value: 'asianPercent', label: language === 'en' ? 'Asian %' : '亚裔比例' },
    { value: 'attendance', label: language === 'en' ? 'Attendance' : '出勤率' },
  ];

  const groupByOptions: { value: GroupByOption; label: string }[] = [
    { value: 'none', label: language === 'en' ? 'No Grouping' : '不分组' },
    { value: 'district', label: language === 'en' ? 'By District' : '按学区' },
    { value: 'gradeRange', label: language === 'en' ? 'By Grade Range' : '按年级' },
    { value: 'program', label: language === 'en' ? 'By Program' : '按项目' },
  ];

  const handleReset = () => {
    onQuickFindChange('');
    onSortChange('overall');
    onGroupByChange('none');
    onClearFilters();
  };

  return (
    <div className="rounded-xl p-6 border-2 shadow-lg mb-6 relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.warning + '33' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#FBBF24]/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-[#3B82F6]/10 to-transparent rounded-full blur-2xl" />

      <div className="relative z-10 space-y-4">
        {/* Header Row: Title + Quick Find + Clear All */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg font-bold" style={{ color: theme.text }}>
              {language === 'en' ? 'Ranking Controls' : '排名控制'}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Find Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4" style={{ color: theme.textSecondary }} />
              <input
                type="text"
                placeholder={language === 'en' ? 'Quick Find (within list)...' : '快速查找（列表内）...'}
                value={quickFind}
                onChange={(e) => onQuickFindChange(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-lg text-sm border-2 transition-all w-64"
                style={{
                  backgroundColor: theme.backgroundElevated,
                  borderColor: quickFind ? theme.info : theme.border,
                  color: theme.text
                }}
              />
              {quickFind && (
                <button
                  onClick={() => onQuickFindChange('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-opacity-80 transition-colors"
                  style={{ backgroundColor: theme.error + '20', color: theme.error }}
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              style={{
                backgroundColor: theme.backgroundHover,
                color: theme.textSecondary,
                border: `1px solid ${theme.border}`
              }}
            >
              <RotateCcw className="size-4" />
              {language === 'en' ? 'Reset' : '重置'}
            </button>
          </div>
        </div>

        {/* Sort & Group By Row */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="size-4" style={{ color: theme.textSecondary }} />
            <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'Sort by:' : '排序：'}
            </span>
            <div className="flex flex-wrap gap-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                  style={
                    sortBy === option.value
                      ? {
                          backgroundColor: theme.primary,
                          color: '#FFFFFF',
                          borderColor: theme.primary
                        }
                      : {
                          backgroundColor: theme.backgroundElevated,
                          borderColor: theme.border,
                          color: theme.textSecondary
                        }
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Group By Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="size-4" style={{ color: theme.textSecondary }} />
          <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
            {language === 'en' ? 'Group by:' : '分组：'}
          </span>
          <div className="flex flex-wrap gap-1">
            {groupByOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onGroupByChange(option.value)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                style={
                  groupBy === option.value
                    ? {
                        backgroundColor: theme.success,
                        color: '#FFFFFF',
                        borderColor: theme.success
                      }
                    : {
                        backgroundColor: theme.backgroundElevated,
                        borderColor: theme.border,
                        color: theme.textSecondary
                      }
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm font-semibold flex items-center gap-2 mb-3"
            style={{ color: theme.primary }}
          >
            <SlidersHorizontal className="size-4" />
            {language === 'en' ? 'Advanced Filters' : '高级筛选'}
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.primary + '20' }}>
              {showAdvanced ? '−' : '+'}
            </span>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Academic Filters */}
              <div>
                <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: theme.info }}>
                  {language === 'en' ? '📚 Academic' : '📚 学术'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {academicFilters.map((filter) => {
                    const isActive = activeFilters.has(filter.id);
                    return (
                      <button
                        key={filter.id}
                        onClick={() => onFilterToggle(filter.id)}
                        className="px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap border-2"
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
              </div>

              {/* Operational Filters */}
              <div>
                <h4 className="text-xs font-bold mb-2 uppercase" style={{ color: theme.warning }}>
                  {language === 'en' ? '⚙️ Operational' : '⚙️ 运营'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {operationalFilters.map((filter) => {
                    const isActive = activeFilters.has(filter.id);
                    return (
                      <button
                        key={filter.id}
                        onClick={() => onFilterToggle(filter.id)}
                        className="px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap border-2"
                        style={
                          isActive
                            ? {
                                backgroundColor: theme.warning,
                                color: '#FFFFFF',
                                borderColor: theme.warning,
                                boxShadow: `0px 2px 8px ${theme.warning}33`
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
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Count */}
        {activeFilters.size > 0 && (
          <div className="pt-3 border-t" style={{ borderColor: theme.border }}>
            <p className="text-sm flex items-center gap-2" style={{ color: theme.textSecondary }}>
              <span className="px-2 py-1 rounded-full font-bold" style={{ backgroundColor: theme.primary + '20', color: theme.primary }}>
                {activeFilters.size}
              </span>
              {language === 'en'
                ? `filter${activeFilters.size !== 1 ? 's' : ''} active`
                : `个筛选条件`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
