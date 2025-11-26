import { useMemo, useState } from "react";
import { TrendingUp, GraduationCap, Star } from "lucide-react";
import type { School } from "../types/school";
import { getSchoolLevel, type SchoolLevel } from "../utils/schoolLevel";

interface DashboardProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  darkMode?: boolean;
}

export function Dashboard({ schools, onSelectSchool, darkMode = false }: DashboardProps) {
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
    heroBg: darkMode ? '#2F2F2F' : '#FF5B85',
    cardBg: darkMode ? '#3A3A3A' : '#FFFFFF',
    bgDefault: darkMode ? '#1A1A1A' : '#FFFDFC',
    bgSoft: darkMode ? '#2F2F2F' : '#F7F4F6',
    text: darkMode ? '#F5F5F5' : '#2E2E2E',
    textSecondary: darkMode ? '#CCCCCC' : '#555555',
    textMuted: darkMode ? '#999999' : '#888888',
    success: '#4CCB71',
    warning: '#FFBD2F',
    sectionBg: {
      pink: darkMode ? '#3A2A3B' : '#FFE7EE',
      mint: darkMode ? '#2A3A35' : '#E8F7F0',
      lavender: darkMode ? '#342A3A' : '#F0EBFF',
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section - SchoolBerry Flat Style */}
      <div className="relative rounded-[32px] p-12 overflow-hidden shadow-xl mb-12" style={{ backgroundColor: colors.heroBg }}>
        {/* Simple decorative circles */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full" style={{ backgroundColor: darkMode ? 'rgba(255,79,117,0.1)' : 'rgba(255,255,255,0.1)' }} />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full" style={{ backgroundColor: darkMode ? 'rgba(78,208,168,0.2)' : 'var(--color-secondary-mint)' }} />

        <div className="relative z-10">
          <div className="mb-6 flex items-baseline gap-4 flex-wrap">
            <h2 className="text-5xl font-black text-white">
              {countyStats.countyName} County
            </h2>
            <p className="text-white/80 text-lg font-semibold">
              Education quality at a glance
            </p>
          </div>

          {/* Unified Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {/* Overall Score - Featured */}
            <div className="rounded-[24px] p-6 hover:scale-105 transition-transform duration-200 md:col-span-1" style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}>
              <div className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: colors.textMuted }}>
                Overall Score
              </div>
              <div className="flex items-end gap-2">
                <div className="text-5xl font-black" style={{ color: colors.primaryBerry }}>
                  {countyStats.averageScore || 0}
                </div>
                <div className="text-2xl mb-2 font-bold" style={{ color: colors.textMuted }}>/100</div>
              </div>
              {/* Mini Progress Bar */}
              <div className="mt-4 relative h-2 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#3A2A3B' : '#FFE7EE' }}>
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${countyStats.averageScore}%`, backgroundColor: colors.secondaryMint }}
                />
              </div>
            </div>

            {/* NJ Ranking */}
            <div className="rounded-[24px] p-6 hover:scale-105 transition-transform duration-200" style={{ backgroundColor: darkMode ? '#2A3A35' : '#E8F7F0', boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}>
              <div className="text-xs font-bold mb-2 uppercase" style={{ color: colors.textMuted }}>
                NJ Ranking
              </div>
              <div className="text-4xl font-black" style={{ color: colors.secondaryMint }}>
                Top {100 - percentileRank}%
              </div>
            </div>

            {/* Best School */}
            <div className="rounded-[24px] p-6 hover:scale-105 transition-transform duration-200" style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}>
              <div className="text-xs font-bold mb-2 uppercase" style={{ color: colors.textMuted }}>Best School</div>
              <div className="text-4xl font-black" style={{ color: colors.primaryBerry }}>{countyStats.bestScore || 0}</div>
            </div>

            {/* Total Schools */}
            <div className="rounded-[24px] p-6 hover:scale-105 transition-transform duration-200" style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}>
              <div className="text-xs font-bold mb-2 uppercase" style={{ color: colors.textMuted }}>Total Schools</div>
              <div className="text-4xl font-black" style={{ color: colors.secondaryMint }}>{countyStats.totalSchools}</div>
            </div>

            {/* Gifted Programs */}
            <div className="rounded-[24px] p-6 hover:scale-105 transition-transform duration-200" style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}>
              <div className="text-xs font-bold mb-2 uppercase" style={{ color: colors.textMuted }}>Gifted Programs</div>
              <div className="text-4xl font-black" style={{ color: colors.accentLavender }}>{countyStats.withGiftedProgram}</div>
            </div>

            {/* Avg Math */}
            <div className="rounded-[24px] p-6 hover:scale-105 transition-transform duration-200" style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}>
              <div className="text-xs font-bold mb-2 uppercase" style={{ color: colors.textMuted }}>Avg Math</div>
              <div className="text-4xl font-black" style={{ color: colors.secondaryMint }}>{countyStats.averageMath || 0}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Schools Section */}
      <div className="space-y-8 mt-16">
        {/* Filter Tabs */}
        <div className="flex gap-3 flex-wrap">
          {(["All", "Elementary", "Middle", "High"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className="px-5 py-2 rounded-full font-bold text-sm transition-all"
              style={{
                backgroundColor: levelFilter === level ? colors.primaryBerry : colors.cardBg,
                color: levelFilter === level ? '#FFFFFF' : colors.text,
                boxShadow: levelFilter === level ? '0px 4px 12px rgba(255, 91, 133, 0.3)' : '0px 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              {level === "All" ? "All Schools" : `${level} School`}
            </button>
          ))}
        </div>

        {/* Math Schools */}
        <div className="rounded-[32px] p-10 shadow-xl" style={{ backgroundColor: colors.sectionBg.pink }}>
          <div className="mb-6">
            <h3 className="text-2xl font-black mb-2" style={{ color: colors.text }}>Top Math Schools</h3>
            <p className="font-semibold" style={{ color: colors.textMuted }}>
              {levelFilter === "All" ? "Stars in mathematics" : `Best ${levelFilter.toLowerCase()} schools in math`}
            </p>
          </div>

          {/* Horizontal Bar Chart Layout */}
          <div className="space-y-4">
            {topSchoolsByMath.map((school, idx) => (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className="w-full rounded-[20px] p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 text-left group"
                style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Rank Badge */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-white"
                    style={{ backgroundColor: idx === 0 ? colors.primaryBerry : colors.secondaryMint }}
                  >
                    #{idx + 1}
                  </div>

                  {/* School Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h4 className="font-black text-base truncate" style={{ color: colors.text }}>
                        {school.name}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: darkMode ? '#3A2A3B' : '#FFE7EE', color: colors.textMuted }}>
                        {school.grades}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-8 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#3A2A3B' : '#FFE7EE' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                        style={{
                          width: `${school.mathProficiency}%`,
                          background: `linear-gradient(90deg, ${colors.primaryBerry} 0%, ${colors.accentLavender} 100%)`,
                        }}
                      >
                        <span className="text-white font-black text-sm">{school.mathProficiency}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ELA Schools */}
        <div className="rounded-[32px] p-10 shadow-xl" style={{ backgroundColor: colors.sectionBg.mint }}>
          <div className="mb-6">
            <h3 className="text-2xl font-black mb-2" style={{ color: colors.text }}>Top ELA Schools</h3>
            <p className="font-semibold" style={{ color: colors.textMuted }}>
              {levelFilter === "All" ? "Reading & writing champions" : `Best ${levelFilter.toLowerCase()} schools in ELA`}
            </p>
          </div>

          {/* Horizontal Bar Chart Layout */}
          <div className="space-y-4">
            {topSchoolsByELA.map((school, idx) => (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className="w-full rounded-[20px] p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 text-left group"
                style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Rank Badge */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-white"
                    style={{ backgroundColor: idx === 0 ? colors.secondaryMint : colors.accentLavender }}
                  >
                    #{idx + 1}
                  </div>

                  {/* School Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h4 className="font-black text-base truncate" style={{ color: colors.text }}>
                        {school.name}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: darkMode ? '#2A3A35' : '#E8F7F0', color: colors.textMuted }}>
                        {school.grades}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-8 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#2A3A35' : '#E8F7F0' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                        style={{
                          width: `${school.elaProficiency}%`,
                          background: `linear-gradient(90deg, ${colors.secondaryMint} 0%, ${colors.accentLavender} 100%)`,
                        }}
                      >
                        <span className="text-white font-black text-sm">{school.elaProficiency}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Growing Schools */}
        <div className="rounded-[32px] p-10 shadow-xl" style={{ backgroundColor: colors.sectionBg.lavender }}>
          <div className="mb-6">
            <h3 className="text-2xl font-black mb-2" style={{ color: colors.text }}>Fastest Growing</h3>
            <p className="font-semibold" style={{ color: colors.textMuted }}>
              {levelFilter === "All" ? "Rising stars on the move" : `Fastest improving ${levelFilter.toLowerCase()} schools`}
            </p>
          </div>

          {/* Horizontal Bar Chart Layout */}
          <div className="space-y-4">
            {topSchoolsByGrowth.map((school, idx) => (
              <button
                key={school.id}
                onClick={() => onSelectSchool(school)}
                className="w-full rounded-[20px] p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-200 text-left group"
                style={{ backgroundColor: colors.cardBg, boxShadow: '0px 4px 18px rgba(0, 0, 0, 0.07)' }}
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Rank Badge */}
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-black text-white"
                    style={{ backgroundColor: idx === 0 ? colors.primaryBerry : colors.accentLavender }}
                  >
                    #{idx + 1}
                  </div>

                  {/* School Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1">
                      <h4 className="font-black text-base truncate" style={{ color: colors.text }}>
                        {school.name}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1"
                        style={{ backgroundColor: darkMode ? '#342A3A' : '#F0EBFF', color: colors.textMuted }}>
                        <TrendingUp className="w-3 h-3" />
                        +{school.trends.mathChange} pts
                      </span>
                      <span className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: darkMode ? '#342A3A' : '#F0EBFF', color: colors.textMuted }}>
                        {school.grades}
                      </span>
                    </div>

                    {/* Progress Bar - showing current score */}
                    <div className="relative h-8 rounded-full overflow-hidden" style={{ backgroundColor: darkMode ? '#342A3A' : '#F0EBFF' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
                        style={{
                          width: `${school.mathProficiency}%`,
                          background: `linear-gradient(90deg, ${colors.accentLavender} 0%, ${colors.primaryBerry} 100%)`,
                        }}
                      >
                        <span className="text-white font-black text-sm">{school.mathProficiency}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Asian Families Spotlight */}
      {asianFriendlySchools.length > 0 && (
        <div className="relative rounded-[32px] p-12 overflow-hidden shadow-xl" style={{ backgroundColor: darkMode ? '#3A2A3B' : '#FFE7EE' }}>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full" style={{ backgroundColor: 'var(--color-secondary-mint)' }} />

          <div className="relative z-10">
            <div className="mb-8">
              <h3 className="text-3xl font-black mb-2" style={{ color: colors.text }}>
                Popular with Asian Families
              </h3>
              <p className="font-semibold text-lg" style={{ color: colors.textMuted }}>
                High Asian enrollment + Strong academics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {asianFriendlySchools.map((school, idx) => (
                <button
                  key={school.id}
                  onClick={() => onSelectSchool(school)}
                  className="relative rounded-[24px] p-7 hover:shadow-2xl hover:-translate-y-3 transition-all duration-200 text-left group"
                  style={{ backgroundColor: colors.cardBg }}
                >
                  {idx === 0 && (
                    <div className="absolute -top-3 -left-3 text-white text-xs font-black px-4 py-2 rounded-full flex items-center gap-1" style={{ backgroundColor: 'var(--color-primary-berry)' }}>
                      <Star className="size-3 fill-current" /> Top Pick
                    </div>
                  )}
                  <div className="mb-4">
                    <div className="text-lg font-black mb-2" style={{ color: colors.text }}>
                      {school.name}
                    </div>
                    <div className="text-xs font-semibold px-3 py-1 rounded-full inline-block" style={{ color: colors.textMuted, backgroundColor: darkMode ? '#3A2A3B' : '#FFE7EE' }}>
                      {school.grades}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: darkMode ? '#3A2A3B' : '#FFE7EE' }}>
                      <span className="text-sm font-bold" style={{ color: colors.text }}>Asian Families</span>
                      <span className="font-black" style={{ color: 'var(--color-primary-berry)' }}>
                        {school.demographics.asian.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: darkMode ? '#2A3A35' : '#DFF9E9' }}>
                      <span className="text-sm font-bold" style={{ color: colors.text }}>Math Score</span>
                      <span className="font-black" style={{ color: 'var(--color-secondary-mint)' }}>
                        {school.mathProficiency}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: darkMode ? '#342A3A' : '#EBD9FF' }}>
                      <span className="text-sm font-bold" style={{ color: colors.text }}>Overall</span>
                      <span className="font-black" style={{ color: 'var(--color-primary-berry)' }}>
                        {school.overallScore}/100
                      </span>
                    </div>
                  </div>

                  {school.giftedProgram && (
                    <div className="mt-4 pt-4" style={{ borderTop: darkMode ? '2px solid rgba(245,245,245,0.1)' : '2px solid #FFE7EE' }}>
                      <div className="text-xs font-black flex items-center gap-2" style={{ color: 'var(--color-secondary-mint)' }}>
                        <GraduationCap className="size-4" />
                        Gifted Program Available ✓
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why SchoolBerry */}
      <div className="rounded-[32px] p-10 shadow-xl" style={{ backgroundColor: 'var(--color-primary-berry)' }}>
        <div className="mb-8">
          <h4 className="text-3xl font-black text-white mb-2">
            Why SchoolBerry is Better
          </h4>
          <p className="text-white/80 font-semibold">Data-driven insights for better decisions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[24px] p-7 shadow-lg" style={{ backgroundColor: colors.cardBg }}>
            <div className="font-black mb-2 text-lg" style={{ color: colors.text }}>Trend Analysis</div>
            <div className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              See which schools are improving over time
            </div>
          </div>
          <div className="rounded-[24px] p-7 shadow-lg" style={{ backgroundColor: colors.cardBg }}>
            <div className="font-black mb-2 text-lg" style={{ color: colors.text }}>Family Insights</div>
            <div className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              Understand enrollment patterns & performance
            </div>
          </div>
          <div className="rounded-[24px] p-7 shadow-lg" style={{ backgroundColor: colors.cardBg }}>
            <div className="font-black mb-2 text-lg" style={{ color: colors.text }}>Equity Scores</div>
            <div className="text-sm font-semibold" style={{ color: colors.textMuted }}>
              Compare performance across all demographics
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
