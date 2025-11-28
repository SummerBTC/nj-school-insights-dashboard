import { useMemo, useState } from "react";
import { TrendingUp, GraduationCap, Star } from "lucide-react";
import type { School } from "../types/school";
import { getSchoolLevel, type SchoolLevel } from "../utils/schoolLevel";
import { CountyStatsCards } from "./CountyStatsCards";

interface DashboardProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  language: 'en' | 'zh';
}

export function Dashboard({ schools, onSelectSchool, language }: DashboardProps) {
  // School level filter state
  const [levelFilter, setLevelFilter] = useState<SchoolLevel | "All">("All");

  // Filter schools by level
  const filteredSchools = useMemo(() => {
    if (levelFilter === "All") return schools;
    return schools.filter(school => getSchoolLevel(school.grades) === levelFilter);
  }, [schools, levelFilter]);

  // Calculate county statistics
  const countyStats = useMemo(() => {
    if (schools.length === 0) {
      return {
        averageScore: 0,
        bestScore: 0,
        worstScore: 0,
        totalSchools: 0,
        withGiftedProgram: 0,
        averageMath: 0,
        averageELA: 0,
        countyName: "Bergen",
      };
    }

    const scores = schools.map((s) => s.overallScore).filter(s => !isNaN(s));
    const mathScores = schools.map((s) => s.mathProficiency).filter(s => !isNaN(s));
    const elaScores = schools.map((s) => s.elaProficiency).filter(s => !isNaN(s));

    return {
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      worstScore: scores.length > 0 ? Math.min(...scores) : 0,
      totalSchools: schools.length,
      withGiftedProgram: schools.filter((s) => s.giftedProgram).length,
      averageMath: mathScores.length > 0 ? Math.round(mathScores.reduce((a, b) => a + b, 0) / mathScores.length) : 0,
      averageELA: elaScores.length > 0 ? Math.round(elaScores.reduce((a, b) => a + b, 0) / elaScores.length) : 0,
      countyName: schools[0]?.county || "Bergen",
    };
  }, [schools]);

  // Get top schools by different metrics (using filtered schools)
  const topSchoolsByMath = useMemo(
    () => [...filteredSchools].sort((a, b) => b.mathProficiency - a.mathProficiency).slice(0, 5),
    [filteredSchools]
  );

  const topSchoolsByELA = useMemo(
    () => [...filteredSchools].sort((a, b) => b.elaProficiency - a.elaProficiency).slice(0, 5),
    [filteredSchools]
  );

  const topSchoolsByGrowth = useMemo(
    () =>
      [...filteredSchools]
        .sort((a, b) => b.trends.mathChange - a.trends.mathChange)
        .slice(0, 5),
    [filteredSchools]
  );

  // Schools with high Asian enrollment
  const asianFriendlySchools = useMemo(
    () =>
      [...schools]
        .filter((s) => s.demographics.asian > 15)
        .sort((a, b) => b.demographics.asian - a.demographics.asian)
        .slice(0, 3),
    [schools]
  );

  // Calculate percentile rank (simplified)
  const percentileRank = Math.round((countyStats.averageScore / 100) * 100);

  // SchoolBerry Design System Colors
  const colors = {
    primaryBerry: '#FF5B85',
    secondaryMint: '#64D7A5',
    accentLavender: '#C9B6FF',
    heroBg: '#FFE7EE',
    cardBg: '#FFFFFF',
    bgDefault: '#FFFDFC',
    bgSoft: '#F7F4F6',
    text: '#2E2E2E',
    textSecondary: '#555555',
    textMuted: '#888888',
    success: '#4CCB71',
    warning: '#FFBD2F',
    sectionBg: {
      pink: '#FFE7EE',
      mint: '#E8F7F0',
      lavender: '#F0EBFF',
    }
  };

  return (
    <div className="space-y-8">
      {/* County Overview Summary - Duolingo/Notion Style */}
      <section className="max-w-6xl mx-auto mt-4 mb-8">
        {/* 标题行 */}
        <div className="flex items-baseline justify-between gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {countyStats.countyName} {language === 'en' ? 'County' : '县'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Education quality at a glance' : '教育质量一览'}
            </p>
          </div>
          <div className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium">
            {language === 'en' ? `Top ${100 - percentileRank}% in NJ` : `新泽西州前${100 - percentileRank}%`}
          </div>
        </div>

        {/* Stats Cards */}
        <CountyStatsCards
          overallScore={countyStats.averageScore}
          totalSchools={countyStats.totalSchools}
          giftedPrograms={countyStats.withGiftedProgram}
          avgMath={countyStats.averageMath}
          language={language}
        />
      </section>

      {/* Top Schools Section */}
      <div className="space-y-8">
        {/* Filter Tabs */}
        <div className="flex gap-4 flex-wrap">
          {(["All", "Elementary", "Middle", "High"] as const).map((level) => {
            const getLevelLabel = (lvl: typeof level) => {
              if (language === 'en') {
                return lvl === "All" ? "All Schools" : `${lvl} School`;
              } else {
                const labels = { All: "所有学校", Elementary: "小学", Middle: "中学", High: "高中" };
                return labels[lvl];
              }
            };

            return (
              <button
                key={level}
                onClick={() => setLevelFilter(level)}
                className="px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap"
                style={{
                  backgroundColor: levelFilter === level ? colors.primaryBerry : colors.cardBg,
                  color: levelFilter === level ? '#FFFFFF' : colors.text,
                  boxShadow: levelFilter === level ? '0px 4px 12px rgba(255, 91, 133, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.06)',
                  minWidth: 'fit-content',
                }}
              >
                {getLevelLabel(level)}
              </button>
            );
          })}
        </div>

        {/* Math & ELA Schools - Side by Side on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Math Schools */}
          <div className="rounded-[24px] p-6 shadow-xl" style={{ backgroundColor: colors.cardBg }}>
            <div className="mb-4">
              <h3 className="text-xl font-black mb-1" style={{ color: colors.text }}>
                {language === 'en' ? 'Top Math Schools' : '数学顶尖学校'}
              </h3>
              <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
                {language === 'en'
                  ? (levelFilter === "All" ? "Stars in mathematics" : `Best ${levelFilter.toLowerCase()} schools in math`)
                  : (levelFilter === "All" ? "数学之星" : `最佳${levelFilter === 'Elementary' ? '小学' : levelFilter === 'Middle' ? '中学' : levelFilter === 'High' ? '高中' : ''}数学成绩`)
                }
              </p>
            </div>

            {/* Compact Bar Chart */}
            <div className="space-y-2">
              {topSchoolsByMath.map((school, idx) => (
                <button
                  key={school.id}
                  onClick={() => onSelectSchool(school)}
                  className="w-full text-left hover:opacity-80 transition-all rounded-xl p-3"
                  style={{ backgroundColor: '#FFE7EE20' }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {/* Rank Number */}
                    <div className="w-5 flex-shrink-0">
                      <span className="text-lg font-black" style={{ color: colors.textMuted }}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* School Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate" style={{ color: colors.text }}>
                        {school.name}
                      </h4>
                    </div>

                    {/* Score - Compact */}
                    <div className="flex-shrink-0">
                      <span className="text-lg font-black" style={{ color: colors.primaryBerry }}>
                        {school.mathProficiency}%
                      </span>
                    </div>
                  </div>

                  {/* Bar Visualization */}
                  <div className="ml-7">
                    <div className="relative h-2 rounded-full" style={{ backgroundColor: '#FFE7EE' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${school.mathProficiency}%`,
                          backgroundColor: colors.primaryBerry,
                          minWidth: '8px',
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F7F4F6' }}>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                📊 排名基于数学成绩 — 分数越高，排名越靠前
              </p>
            </div>
          </div>

          {/* ELA Schools */}
          <div className="rounded-[24px] p-6 shadow-xl" style={{ backgroundColor: colors.cardBg }}>
            <div className="mb-4">
              <h3 className="text-xl font-black mb-1" style={{ color: colors.text }}>
                {language === 'en' ? 'Top ELA Schools' : '英语顶尖学校'}
              </h3>
              <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
                {language === 'en'
                  ? (levelFilter === "All" ? "Reading & writing champions" : `Best ${levelFilter.toLowerCase()} schools in ELA`)
                  : (levelFilter === "All" ? "阅读写作冠军" : `最佳${levelFilter === 'Elementary' ? '小学' : levelFilter === 'Middle' ? '中学' : levelFilter === 'High' ? '高中' : ''}英语成绩`)
                }
              </p>
            </div>

            {/* Compact Bar Chart */}
            <div className="space-y-2">
              {topSchoolsByELA.map((school, idx) => (
                <button
                  key={school.id}
                  onClick={() => onSelectSchool(school)}
                  className="w-full text-left hover:opacity-80 transition-all rounded-xl p-3"
                  style={{ backgroundColor: '#E8F7F020' }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {/* Rank Number */}
                    <div className="w-5 flex-shrink-0">
                      <span className="text-lg font-black" style={{ color: colors.textMuted }}>
                        {idx + 1}
                      </span>
                    </div>

                    {/* School Name */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate" style={{ color: colors.text }}>
                        {school.name}
                      </h4>
                    </div>

                    {/* Score - Compact */}
                    <div className="flex-shrink-0">
                      <span className="text-lg font-black" style={{ color: colors.secondaryMint }}>
                        {school.elaProficiency}%
                      </span>
                    </div>
                  </div>

                  {/* Bar Visualization */}
                  <div className="ml-7">
                    <div className="relative h-2 rounded-full" style={{ backgroundColor: '#E8F7F0' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full"
                        style={{
                          width: `${school.elaProficiency}%`,
                          backgroundColor: colors.secondaryMint,
                          minWidth: '8px',
                        }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F7F4F6' }}>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                📊 排名基于英语成绩 — 分数越高，排名越靠前
              </p>
            </div>
          </div>
        </div>

        {/* Growing Schools */}
        <div className="rounded-[24px] p-6 shadow-xl" style={{ backgroundColor: colors.cardBg }}>
          <div className="mb-4">
            <h3 className="text-xl font-black mb-1" style={{ color: colors.text }}>
              {language === 'en' ? 'Fastest Growing' : '进步最快'}
            </h3>
            <p className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              {language === 'en'
                ? (levelFilter === "All" ? "Rising stars on the move" : `Fastest improving ${levelFilter.toLowerCase()} schools`)
                : (levelFilter === "All" ? "进步之星" : `进步最快的${levelFilter === 'Elementary' ? '小学' : levelFilter === 'Middle' ? '中学' : levelFilter === 'High' ? '高中' : ''}`)
              }
            </p>
          </div>

          {/* Compact Bar Chart */}
          <div className="space-y-2">
            {topSchoolsByGrowth.map((school, idx) => (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className="w-full text-left hover:opacity-80 transition-all rounded-xl p-3"
                style={{ backgroundColor: '#F0EBFF20' }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {/* Rank Number */}
                  <div className="w-5 flex-shrink-0">
                    <span className="text-lg font-black" style={{ color: colors.textMuted }}>
                      {idx + 1}
                    </span>
                  </div>

                  {/* School Name */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate" style={{ color: colors.text }}>
                      {school.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                        style={{ backgroundColor: '#F0EBFF', color: colors.textMuted }}>
                        <TrendingUp className="w-3 h-3" />
                        +{school.trends.mathChange} pts
                      </span>
                      <span className="text-xs font-semibold"
                        style={{ color: colors.textMuted }}>
                        {school.grades}
                      </span>
                    </div>
                  </div>

                  {/* Score - Compact */}
                  <div className="flex-shrink-0">
                    <span className="text-lg font-black" style={{ color: colors.accentLavender }}>
                      {school.mathProficiency}%
                    </span>
                  </div>
                </div>

                {/* Bar Visualization */}
                <div className="ml-7">
                  <div className="relative h-2 rounded-full" style={{ backgroundColor: '#F0EBFF' }}>
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${school.mathProficiency}%`,
                        backgroundColor: colors.accentLavender,
                        minWidth: '8px',
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#F7F4F6' }}>
            <p className="text-xs" style={{ color: colors.textMuted }}>
              📊 排名基于成绩增长 — 进步越大，排名越靠前
            </p>
          </div>
        </div>
      </div>

      {/* Asian Families Spotlight */}
      {asianFriendlySchools.length > 0 && (
        <div className="relative rounded-[32px] p-12 overflow-hidden shadow-xl" style={{ backgroundColor: '#FFE7EE' }}>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full" style={{ backgroundColor: 'var(--color-secondary-mint)' }} />

          <div className="relative z-10">
            <div className="mb-8">
              <h3 className="text-3xl font-black mb-2" style={{ color: colors.text }}>
                {language === 'en' ? 'Top 3 Schools - Popular with Asian Families' : '亚裔家庭热门学校 Top 3'}
              </h3>
              <p className="font-semibold text-lg" style={{ color: colors.textMuted }}>
                {language === 'en' ? 'Ranked by Asian enrollment · Multi-dimensional comparison' : '按亚裔入学率排名 · 多维度对比'}
              </p>
            </div>

            {/* Schools Comparison with Multi-dimensional Bars */}
            <div className="space-y-6">
              {asianFriendlySchools.map((school, idx) => (
                <button
                  key={school.id}
                  onClick={() => onSelectSchool(school)}
                  className="w-full text-left hover:opacity-90 transition-all rounded-[24px] p-6"
                  style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}
                >
                  {/* School Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-sm"
                      style={{ backgroundColor: idx === 0 ? colors.primaryBerry : colors.secondaryMint }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg" style={{ color: colors.text }}>
                        {school.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold" style={{ color: colors.textMuted }}>
                          {school.grades}
                        </span>
                        {school.giftedProgram && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: '#E8F7F0', color: colors.secondaryMint }}>
                            <GraduationCap className="w-3 h-3" />
                            Gifted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Multi-dimensional Comparison Bars */}
                  <div className="space-y-3">
                    {/* Asian Enrollment */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold" style={{ color: colors.textMuted }}>亚裔入学率</span>
                        <span className="text-sm font-black" style={{ color: colors.primaryBerry }}>
                          {school.demographics.asian.toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full" style={{ backgroundColor: '#FFE7EE' }}>
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${Math.min(school.demographics.asian, 100)}%`, backgroundColor: colors.primaryBerry, minWidth: '8px' }} />
                      </div>
                    </div>

                    {/* Math */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold" style={{ color: colors.textMuted }}>数学成绩</span>
                        <span className="text-sm font-black" style={{ color: colors.secondaryMint }}>
                          {school.mathProficiency}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full" style={{ backgroundColor: '#E8F7F0' }}>
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${school.mathProficiency}%`, backgroundColor: colors.secondaryMint, minWidth: '8px' }} />
                      </div>
                    </div>

                    {/* ELA */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold" style={{ color: colors.textMuted }}>英语成绩</span>
                        <span className="text-sm font-black" style={{ color: colors.accentLavender }}>
                          {school.elaProficiency}%
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full" style={{ backgroundColor: '#F0EBFF' }}>
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${school.elaProficiency}%`, backgroundColor: colors.accentLavender, minWidth: '8px' }} />
                      </div>
                    </div>

                    {/* Overall Score */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold" style={{ color: colors.textMuted }}>综合评分</span>
                        <span className="text-sm font-black" style={{ color: colors.text }}>
                          {school.overallScore}/100
                        </span>
                      </div>
                      <div className="relative h-2 rounded-full" style={{ backgroundColor: '#F7F4F6' }}>
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${school.overallScore}%`, backgroundColor: colors.text, minWidth: '8px' }} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why SchoolBerry */}
      <div className="rounded-[32px] shadow-xl" style={{ backgroundColor: colors.cardBg, marginTop: '48px', padding: '48px' }}>
        <div className="mb-8">
          <h4 className="text-3xl font-black mb-2" style={{ color: colors.text }}>
            {language === 'en' ? 'Why SchoolBerry is Better' : '为什么选择 SchoolBerry'}
          </h4>
          <p className="font-semibold" style={{ color: colors.textMuted }}>
            {language === 'en' ? 'Data-driven insights for better decisions' : '数据驱动的洞察，助力更好的决策'}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ gap: '32px' }}>
          <div className="rounded-[24px] p-7 shadow-lg" style={{ backgroundColor: '#F7F4F6' }}>
            <div className="font-black mb-2 text-lg" style={{ color: colors.text }}>
              {language === 'en' ? 'Trend Analysis' : '趋势分析'}
            </div>
            <div className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              {language === 'en' ? 'See which schools are improving over time' : '查看学校随时间的进步趋势'}
            </div>
          </div>
          <div className="rounded-[24px] p-7 shadow-lg" style={{ backgroundColor: '#F7F4F6' }}>
            <div className="font-black mb-2 text-lg" style={{ color: colors.text }}>
              {language === 'en' ? 'Family Insights' : '家庭洞察'}
            </div>
            <div className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              {language === 'en' ? 'Understand enrollment patterns & performance' : '了解入学模式和学业表现'}
            </div>
          </div>
          <div className="rounded-[24px] p-7 shadow-lg" style={{ backgroundColor: '#F7F4F6' }}>
            <div className="font-black mb-2 text-lg" style={{ color: colors.text }}>
              {language === 'en' ? 'Equity Scores' : '公平评分'}
            </div>
            <div className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              {language === 'en' ? 'Compare performance across all demographics' : '对比所有人口群体的表现'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
