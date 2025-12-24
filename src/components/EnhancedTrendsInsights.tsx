import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, Users, BarChart3, Award, Calendar, Target, RotateCcw } from "lucide-react";
import type { School } from "../types/school";
import { useTheme } from "../theme/ThemeContext";
import { useState } from "react";

interface EnhancedTrendsInsightsProps {
  school: School;
  language: 'en' | 'zh';
  onReset: () => void;
}

type ComparisonType = 'county' | 'state' | 'district' | 'none';

export function EnhancedTrendsInsights({ school, language, onReset }: EnhancedTrendsInsightsProps) {
  const { theme } = useTheme();
  const [comparisonType, setComparisonType] = useState<ComparisonType>('county');

  const handleReset = () => {
    onReset();
  };

  // Generate 3-year trend data
  const currentYear = 2025;
  const years = [currentYear - 2, currentYear - 1, currentYear];

  // Mock county and state averages (in real app, these would come from data)
  const countyAvgMath = 72;
  const countyAvgELA = 68;
  const stateAvgMath = 65;
  const stateAvgELA = 62;

  const combinedTrendData = years.map((year, index) => {
    const yearsAgo = 2 - index;
    return {
      year: `${year}`,
      schoolMath: school.mathProficiency - school.trends.mathChange * yearsAgo,
      schoolELA: school.elaProficiency - school.trends.elaChange * yearsAgo,
      countyMath: countyAvgMath + (Math.random() * 4 - 2), // Slight variation
      countyELA: countyAvgELA + (Math.random() * 4 - 2),
      stateMath: stateAvgMath + (Math.random() * 3 - 1.5),
      stateELA: stateAvgELA + (Math.random() * 3 - 1.5),
    };
  });

  // Milestones for context
  const milestones = [
    { year: 2023, event: language === 'en' ? 'New curriculum adopted' : '采用新课程' },
    { year: 2024, event: language === 'en' ? 'Math intervention program' : '数学干预项目' },
    { year: 2025, event: school.giftedProgram ? (language === 'en' ? 'Gifted program expanded' : '资优项目扩展') : (language === 'en' ? 'Current year' : '本年度') },
  ];

  // Generate comprehensive summary insights
  const generateSummaryInsights = () => {
    const insights = [];

    // Math trend analysis
    if (school.trends.mathChange > 3) {
      insights.push({
        type: 'positive',
        icon: TrendingUp,
        title: language === 'en' ? 'Strong Math Improvement' : '数学显著进步',
        description: language === 'en'
          ? `Math proficiency improved +${school.trends.mathChange} pts over 3 years, outperforming county average (+2 pts).`
          : `数学水平在3年内提高了 +${school.trends.mathChange} 分，超过县平均水平（+2分）。`
      });
    } else if (school.trends.mathChange < -2) {
      insights.push({
        type: 'negative',
        icon: TrendingDown,
        title: language === 'en' ? 'Math Decline' : '数学下降',
        description: language === 'en'
          ? `Math proficiency dropped ${school.trends.mathChange} pts, falling behind county trend.`
          : `数学水平下降了 ${school.trends.mathChange} 分，落后于县趋势。`
      });
    } else {
      insights.push({
        type: 'neutral',
        icon: Target,
        title: language === 'en' ? 'Stable Math Performance' : '数学表现稳定',
        description: language === 'en'
          ? `Math proficiency remained relatively stable (${school.trends.mathChange > 0 ? '+' : ''}${school.trends.mathChange} pts).`
          : `数学水平保持相对稳定（${school.trends.mathChange > 0 ? '+' : ''}${school.trends.mathChange} 分）。`
      });
    }

    // ELA trend analysis
    if (school.trends.elaChange > 2) {
      insights.push({
        type: 'positive',
        icon: TrendingUp,
        title: language === 'en' ? 'ELA Improvement' : '英语进步',
        description: language === 'en'
          ? `ELA proficiency improved +${school.trends.elaChange} pts, exceeding state average (+1 pt).`
          : `英语水平提高了 +${school.trends.elaChange} 分，超过州平均水平（+1分）。`
      });
    } else if (school.trends.elaChange < -1) {
      insights.push({
        type: 'negative',
        icon: TrendingDown,
        title: language === 'en' ? 'ELA Needs Attention' : '英语需要关注',
        description: language === 'en'
          ? `ELA proficiency dropped ${school.trends.elaChange} pt, falling behind state trend (+1 pt).`
          : `英语水平下降了 ${school.trends.elaChange} 分，落后于州趋势（+1分）。`
      });
    }

    // Attendance analysis
    if (school.chronicAbsenteeism > 8) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: language === 'en' ? 'High Absenteeism' : '高缺勤率',
        description: language === 'en'
          ? `Chronic absenteeism (${school.chronicAbsenteeism}%) is above state average and may impact long-term outcomes.`
          : `长期缺勤率（${school.chronicAbsenteeism}%）高于州平均水平，可能影响长期成果。`
      });
    } else {
      insights.push({
        type: 'positive',
        icon: Users,
        title: language === 'en' ? 'Good Attendance' : '良好出勤',
        description: language === 'en'
          ? `Attendance remains strong with only ${school.chronicAbsenteeism}% chronic absenteeism.`
          : `出勤率保持良好，长期缺勤率仅为 ${school.chronicAbsenteeism}%。`
      });
    }

    // Enrollment trend
    if (school.trends.enrollmentChange > 5) {
      insights.push({
        type: 'positive',
        icon: Users,
        title: language === 'en' ? 'Growing Enrollment' : '入学人数增长',
        description: language === 'en'
          ? `Enrollment increased ${school.trends.enrollmentChange}%, indicating growing community confidence.`
          : `入学人数增加了 ${school.trends.enrollmentChange}%，表明社区信心增强。`
      });
    } else if (school.trends.enrollmentChange < -5) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: language === 'en' ? 'Declining Enrollment' : '入学人数下降',
        description: language === 'en'
          ? `Enrollment decreased ${Math.abs(school.trends.enrollmentChange)}%, potentially affecting resources.`
          : `入学人数减少了 ${Math.abs(school.trends.enrollmentChange)}%，可能影响资源。`
      });
    }

    return insights;
  };

  const summaryInsights = generateSummaryInsights();

  // Calculate 3-year ranking change (mock data)
  const rankingChanges = {
    math: school.trends.mathChange > 0 ? Math.floor(school.trends.mathChange * 3) : Math.ceil(school.trends.mathChange * 2),
    ela: school.trends.elaChange > 0 ? Math.floor(school.trends.elaChange * 2.5) : Math.ceil(school.trends.elaChange * 2),
    overall: Math.floor((school.trends.mathChange + school.trends.elaChange) * 2)
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return { bg: theme.success + '15', border: theme.success, icon: theme.success };
      case 'negative':
        return { bg: theme.error + '15', border: theme.error, icon: theme.error };
      case 'warning':
        return { bg: theme.warning + '15', border: theme.warning, icon: theme.warning };
      default:
        return { bg: theme.info + '15', border: theme.info, icon: theme.info };
    }
  };

  const comparisonOptions = [
    { value: 'county' as ComparisonType, label: language === 'en' ? 'County Average' : '县平均' },
    { value: 'state' as ComparisonType, label: language === 'en' ? 'State Average' : '州平均' },
    { value: 'district' as ComparisonType, label: language === 'en' ? 'District Average' : '学区平均' },
    { value: 'none' as ComparisonType, label: language === 'en' ? 'School Only' : '仅学校' },
  ];

  return (
    <div className="space-y-6">
      {/* Multi-Line Trend Chart with Comparisons */}
      <div className="rounded-xl p-4 md:p-6 border shadow-lg" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.border }}>
        <h3 className="text-base md:text-lg font-bold mb-4" style={{ color: theme.text }}>
          {language === 'en' ? 'Academic Performance Trends' : '学业表现趋势'}
        </h3>

        <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedTrendData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
              <XAxis
                dataKey="year"
                tick={{ fill: theme.textSecondary, fontSize: 12 }}
                label={{
                  value: language === 'en' ? 'Year' : '年份',
                  position: 'insideBottom',
                  offset: -10,
                  fill: theme.textSecondary,
                  fontSize: 12
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: theme.textSecondary, fontSize: 11 }}
                label={{
                  value: language === 'en' ? 'Proficiency %' : '优秀率 %',
                  angle: -90,
                  position: 'insideLeft',
                  fill: theme.textSecondary,
                  fontSize: 11
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.backgroundElevated,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  color: theme.text,
                  padding: '8px 12px',
                  fontSize: '13px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} iconType="line" />

            {/* School Lines - Bold */}
            <Line
              type="monotone"
              dataKey="schoolMath"
              name={language === 'en' ? `${school.name} Math` : `${school.name} 数学`}
              stroke={theme.info}
              strokeWidth={3}
              dot={{ fill: theme.info, r: 6, strokeWidth: 2, stroke: '#FFFFFF' }}
            />
            <Line
              type="monotone"
              dataKey="schoolELA"
              name={language === 'en' ? `${school.name} ELA` : `${school.name} 英语`}
              stroke={theme.success}
              strokeWidth={3}
              dot={{ fill: theme.success, r: 6, strokeWidth: 2, stroke: '#FFFFFF' }}
            />

            {/* Comparison Lines - Dashed */}
            {comparisonType === 'county' && (
              <>
                <Line
                  type="monotone"
                  dataKey="countyMath"
                  name={language === 'en' ? 'County Avg Math' : '县平均数学'}
                  stroke={theme.warning}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: theme.warning, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="countyELA"
                  name={language === 'en' ? 'County Avg ELA' : '县平均英语'}
                  stroke={theme.primary}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: theme.primary, r: 4 }}
                />
              </>
            )}

            {comparisonType === 'state' && (
              <>
                <Line
                  type="monotone"
                  dataKey="stateMath"
                  name={language === 'en' ? 'State Avg Math' : '州平均数学'}
                  stroke={theme.error}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: theme.error, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="stateELA"
                  name={language === 'en' ? 'State Avg ELA' : '州平均英语'}
                  stroke="#9333EA"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#9333EA", r: 4 }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
        </div>

        {/* Milestones Timeline */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.border }}>
          <h4 className="text-sm font-semibold mb-3" style={{ color: theme.textSecondary }}>
            {language === 'en' ? 'Key Events & Milestones' : '关键事件与里程碑'}
          </h4>
          <div className="grid grid-cols-3 gap-3">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                <div>
                  <div className="text-xs font-bold" style={{ color: theme.text }}>{milestone.year}</div>
                  <div className="text-xs" style={{ color: theme.textSecondary }}>{milestone.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Header Card - Duolingo Style */}
      <div className="rounded-xl p-8 border-2 shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.primary + '40' }}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#A78BFA]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#3B82F6]/10 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-5" style={{ color: theme.primary }} />
                <span className="text-sm font-semibold" style={{ color: theme.textSecondary }}>
                  {language === 'en' ? '3-Year Performance Analysis' : '3年表现分析'}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
                    {school.name}
                  </h1>
                  <p className="text-lg" style={{ color: theme.textSecondary }}>
                    {language === 'en'
                      ? `Academic trends from ${currentYear - 2} to ${currentYear}`
                      : `${currentYear - 2} 至 ${currentYear} 年学术趋势`}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105"
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

            {/* Comparison Selector */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Compare against:' : '对比：'}
              </span>
              <div className="inline-flex rounded-full p-1 gap-0 overflow-x-auto" style={{ backgroundColor: theme.backgroundHover, border: `1px solid ${theme.border}` }}>
                {comparisonOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setComparisonType(option.value)}
                    className="px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all"
                    style={
                      comparisonType === option.value
                        ? {
                            backgroundColor: theme.primary,
                            color: '#FFFFFF',
                            fontWeight: 700,
                            boxShadow: `0 2px 4px ${theme.shadow}`
                          }
                        : {
                            backgroundColor: 'transparent',
                            color: theme.textSecondary,
                            fontWeight: 500
                          }
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Current Overall Score' : '当前综合评分'}
              </div>
              <div className="text-2xl font-bold" style={{ color: theme.primary }}>{school.overallScore}</div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Math Trend' : '数学趋势'}
              </div>
              <div className="text-2xl font-bold flex items-center gap-1" style={{ color: school.trends.mathChange >= 0 ? theme.success : theme.error }}>
                {school.trends.mathChange > 0 ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
              <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'ELA Trend' : '英语趋势'}
              </div>
              <div className="text-2xl font-bold flex items-center gap-1" style={{ color: school.trends.elaChange >= 0 ? theme.success : theme.error }}>
                {school.trends.elaChange > 0 ? <TrendingUp className="size-5" /> : <TrendingDown className="size-5" />}
                {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Insights - Premium Card */}
      <div className="rounded-xl p-6 border-2 shadow-lg" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.info + '40' }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="size-6" style={{ color: theme.info }} />
          <h3 className="text-xl font-bold" style={{ color: theme.text }}>
            {language === 'en' ? 'Summary Insights' : '总结洞察'}
          </h3>
        </div>

        <div className="space-y-3">
          {summaryInsights.map((insight, index) => {
            const colors = getInsightColor(insight.type);
            return (
              <div
                key={index}
                className="p-4 rounded-xl border-l-4 transition-all hover:scale-[1.01]"
                style={{
                  borderLeftColor: colors.border,
                  backgroundColor: colors.bg
                }}
              >
                <div className="flex items-start gap-3">
                  <insight.icon className="size-5 mt-0.5 flex-shrink-0" style={{ color: colors.icon }} />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" style={{ color: theme.text }}>{insight.title}</h4>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-Year Ranking Change */}
      <div className="rounded-xl p-6 border shadow-lg" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.border }}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="size-5" style={{ color: theme.primary }} />
          <h3 className="text-lg font-bold" style={{ color: theme.text }}>
            {language === 'en' ? '3-Year Ranking Change' : '3年排名变化'}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'Math' : '数学'}
            </div>
            <div className="text-2xl font-bold flex items-center gap-1" style={{ color: rankingChanges.math >= 0 ? theme.success : theme.error }}>
              {rankingChanges.math > 0 ? <TrendingUp className="size-5" /> : rankingChanges.math < 0 ? <TrendingDown className="size-5" /> : null}
              {rankingChanges.math > 0 ? '+' : ''}{rankingChanges.math} {language === 'en' ? 'positions' : '位'}
            </div>
          </div>

          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'ELA' : '英语'}
            </div>
            <div className="text-2xl font-bold flex items-center gap-1" style={{ color: rankingChanges.ela >= 0 ? theme.success : theme.error }}>
              {rankingChanges.ela > 0 ? <TrendingUp className="size-5" /> : rankingChanges.ela < 0 ? <TrendingDown className="size-5" /> : null}
              {rankingChanges.ela > 0 ? '+' : ''}{rankingChanges.ela} {language === 'en' ? 'positions' : '位'}
            </div>
          </div>

          <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.backgroundHover, borderColor: theme.border }}>
            <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'Overall' : '总体'}
            </div>
            <div className="text-2xl font-bold flex items-center gap-1" style={{ color: rankingChanges.overall >= 0 ? theme.success : theme.error }}>
              {rankingChanges.overall > 0 ? <TrendingUp className="size-5" /> : rankingChanges.overall < 0 ? <TrendingDown className="size-5" /> : null}
              {rankingChanges.overall > 0 ? '+' : ''}{rankingChanges.overall} {language === 'en' ? 'positions' : '位'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
