import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import type { School } from "../types/school";
import { getSchoolLevel, type SchoolLevel } from "../utils/schoolLevel";
import { CountyStatsCards } from "./CountyStatsCards";
import { useTheme } from "../theme/ThemeContext";

interface DashboardProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  language: 'en' | 'zh';
}

export function Dashboard({ schools, onSelectSchool, language }: DashboardProps) {
  const { theme } = useTheme();
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

  // Schools with high Asian enrollment (using filtered schools)
  const asianFriendlySchools = useMemo(
    () =>
      [...filteredSchools]
        .filter((s) => s.demographics.asian > 15)
        .sort((a, b) => b.demographics.asian - a.demographics.asian)
        .slice(0, 3),
    [filteredSchools]
  );

  // Calculate percentile rank (simplified)
  const percentileRank = Math.round((countyStats.averageScore / 100) * 100);

  // Map theme colors for easier access
  const colors = {
    primaryBerry: theme.primary,
    secondaryMint: theme.success,
    accentLavender: theme.accent,
    cardBg: theme.backgroundElevated,
    text: theme.text,
    textMuted: theme.textSecondary,
    sectionBg: {
      pink: theme.primaryGlow,
      mint: theme.primaryGlow,
      lavender: theme.primaryGlow,
    }
  };

  return (
    <div className="space-y-8">
      {/* County Overview Summary - Duolingo/Notion Style */}
      <section className="max-w-6xl mx-auto mt-4 mb-8">
        {/* 标题行 */}
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
              {countyStats.countyName} {language === 'en' ? 'County' : '县'}
            </h2>
            <div className="shrink-0 px-3 py-1.5 rounded-full text-sm font-medium flex items-center" style={{ backgroundColor: theme.primaryGlow, color: theme.primary }}>
              {language === 'en' ? `Top ${100 - percentileRank}% in NJ` : `新泽西州前${100 - percentileRank}%`}
            </div>
          </div>
          <p className="text-sm mt-1" style={{ color: theme.textSecondary }}>
            {language === 'en' ? 'Education quality at a glance' : '教育质量一览'}
          </p>
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
                  backgroundColor: levelFilter === level ? theme.primary : theme.backgroundElevated,
                  color: levelFilter === level ? theme.textInverse : theme.text,
                  boxShadow: levelFilter === level ? `0px 4px 12px ${theme.primaryGlow}` : `0px 2px 8px ${theme.shadow}`,
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
                  style={{ backgroundColor: theme.backgroundHover }}
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
                    <div className="relative h-2 rounded-full" style={{ backgroundColor: theme.borderLight }}>
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
            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
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
                  style={{ backgroundColor: theme.backgroundHover }}
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
                    <div className="relative h-2 rounded-full" style={{ backgroundColor: theme.borderLight }}>
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
            <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border }}>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                📊 排名基于英语成绩 — 分数越高，排名越靠前
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Asian Families Spotlight */}
      {asianFriendlySchools.length > 0 && (
        <div className="relative rounded-[32px] p-12 overflow-hidden shadow-xl" style={{ backgroundColor: theme.primaryGlow }}>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-30" style={{ backgroundColor: theme.primary }} />

          <div className="relative z-10">
            <div className="mb-8">
              <h3 className="text-3xl font-black mb-2" style={{ color: theme.text }}>
                {language === 'en' ? 'Top 3 Schools - Popular with Asian Families' : '亚裔家庭热门学校 Top 3'}
              </h3>
              <p className="font-semibold text-lg" style={{ color: theme.textSecondary }}>
                {language === 'en' ? 'Ranked by Asian enrollment · Info tiles display' : '按亚裔入学率排名 · 信息块展示'}
              </p>
            </div>

            {/* Meta Tiles - Info Block Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {asianFriendlySchools.map((school, idx) => (
                <button
                  key={school.id}
                  onClick={() => onSelectSchool(school)}
                  className="text-left hover:scale-105 transition-transform rounded-2xl p-6"
                  style={{ backgroundColor: theme.backgroundElevated, boxShadow: `0px 8px 24px ${theme.shadow}`, border: `2px solid ${theme.border}` }}
                >
                  {/* School Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: `2px solid ${theme.border}` }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg"
                      style={{ backgroundColor: theme.primary }}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-base leading-tight" style={{ color: theme.text }}>
                        {school.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
                          {school.grades}
                        </span>
                        {school.giftedProgram && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ backgroundColor: theme.primaryGlow, color: theme.primary }}>
                            <GraduationCap className="w-3 h-3" />
                            Gifted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meta Info Tiles - No Bars, Just Numbers */}
                  <div className="space-y-3">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                        {language === 'en' ? 'Overall Score' : '综合评分'}
                      </span>
                      <span className="text-2xl font-black" style={{ color: theme.primary }}>
                        {school.overallScore}
                      </span>
                    </div>

                    {/* Asian Enrollment Rate */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                        {language === 'en' ? 'Asian Enrollment' : '亚裔入学率'}
                      </span>
                      <span className="text-2xl font-black" style={{ color: theme.primary }}>
                        {school.demographics.asian.toFixed(1)}%
                      </span>
                    </div>

                    {/* Math Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                        {language === 'en' ? 'Math Score' : '数学成绩'}
                      </span>
                      <span className="text-2xl font-black" style={{ color: theme.primary }}>
                        {school.mathProficiency}%
                      </span>
                    </div>

                    {/* ELA Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>
                        {language === 'en' ? 'ELA Score' : '英语成绩'}
                      </span>
                      <span className="text-2xl font-black" style={{ color: theme.primary }}>
                        {school.elaProficiency}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
