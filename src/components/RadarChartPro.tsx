import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../theme/ThemeContext";
import type { School } from "../types/school";
import { BarChart3 } from "lucide-react";

interface RadarChartProProps {
  school: School;
  language: 'en' | 'zh';
}

export function RadarChartPro({ school, language }: RadarChartProProps) {
  const { theme } = useTheme();
  // Normalize metrics to 0-100 scale
  const normalizeStudentTeacherRatio = (ratio: number) => {
    // Lower is better, so invert: ideal ratio ~10, max considered ~25
    return Math.max(0, Math.min(100, ((25 - ratio) / 15) * 100));
  };

  // Calculate equity score based on demographic performance gaps
  const calculateEquityScore = () => {
    const performances = [
      school.performanceByDemographic.asian.math,
      school.performanceByDemographic.white.math,
      school.performanceByDemographic.hispanic.math,
      school.performanceByDemographic.black.math,
    ];
    const max = Math.max(...performances);
    const min = Math.min(...performances);
    const gap = max - min;
    // Smaller gap = higher equity score
    return Math.max(0, 100 - gap);
  };

  const metrics = [
    {
      metric: "Math",
      value: school.mathProficiency,
      fullMark: 100,
      displayValue: school.mathProficiency,
    },
    {
      metric: "ELA",
      value: school.elaProficiency,
      fullMark: 100,
      displayValue: school.elaProficiency,
    },
    {
      metric: "Attendance",
      value: 100 - school.chronicAbsenteeism,
      fullMark: 100,
      displayValue: 100 - school.chronicAbsenteeism,
    },
    {
      metric: "Class Size",
      value: normalizeStudentTeacherRatio(school.studentTeacherRatio),
      fullMark: 100,
      displayValue: normalizeStudentTeacherRatio(school.studentTeacherRatio),
    },
    {
      metric: "Equity",
      value: calculateEquityScore(),
      fullMark: 100,
      displayValue: calculateEquityScore(),
    },
  ];

  // Custom label component to show values
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const value = payload.value.toFixed(0);

    return (
      <text
        x={x}
        y={y}
        fill="#3C6EFF"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="rounded-xl p-6 border-2 shadow-lg hover:shadow-xl transition-shadow" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.primary + '1A' }}>
      <div className="mb-2">
        <h3 className="font-semibold text-lg" style={{ color: theme.text }}>
          {language === 'en' ? 'Performance Radar' : '表现雷达图'}
        </h3>
        <p className="text-sm" style={{ color: theme.textSecondary }}>
          {language === 'en' ? 'Five-dimension analysis • 0-100 scale' : '五维分析 • 0-100分制'}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <RechartsRadar data={metrics}>
          {/* Grid with professional styling */}
          <PolarGrid
            stroke={theme.border}
            strokeWidth={1.5}
            gridType="polygon"
          />

          {/* Angle axis (metric names) */}
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: theme.text,
              fontSize: 13,
              fontWeight: 600
            }}
          />

          {/* Radius axis (scale: 0, 25, 50, 75, 100) */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: theme.textSecondary,
              fontSize: 11,
              fontWeight: 500
            }}
            tickCount={5}
            stroke={theme.border}
            strokeWidth={1}
          />

          {/* Main radar area - Professional blue */}
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#3C6EFF"
            fill="rgba(60, 110, 255, 0.18)"
            fillOpacity={1}
            strokeWidth={3}
            dot={{
              fill: '#3C6EFF',
              stroke: '#fff',
              strokeWidth: 2,
              r: 5
            }}
            activeDot={{
              fill: '#2952CC',
              stroke: '#fff',
              strokeWidth: 2,
              r: 7
            }}
          />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: theme.backgroundElevated,
              border: `2px solid ${theme.primary}`,
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: `0 10px 25px ${theme.shadow}`
            }}
            labelStyle={{
              color: theme.text,
              fontWeight: 600,
              marginBottom: '4px'
            }}
            formatter={(value: number) => [
              <span className="font-semibold" style={{ color: theme.primary }}>{value.toFixed(1)}</span>,
              language === 'en' ? 'Score' : '分数'
            ]}
          />
        </RechartsRadar>
      </ResponsiveContainer>

      {/* Metric values grid */}
      <div className="mt-4 pt-4 border-t-2" style={{ borderColor: theme.border }}>
        <div className="flex flex-wrap justify-center gap-2">
          {metrics.map((m, idx) => (
            <div
              key={m.metric}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border transition-all cursor-default"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.backgroundHover
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = theme.primary;
                e.currentTarget.style.backgroundColor = theme.primaryGlow;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = theme.border;
                e.currentTarget.style.backgroundColor = theme.backgroundHover;
              }}
            >
              <div className="text-xs" style={{ color: theme.textSecondary }}>{m.metric}</div>
              <div className="text-lg font-bold" style={{ color: theme.primary }}>
                {m.displayValue.toFixed(0)}
              </div>
              <div className="text-[10px]" style={{ color: theme.textMuted }}>/ 100</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-4 px-3 py-2 rounded-lg border" style={{ backgroundColor: theme.primaryGlow, borderColor: theme.primary + '33' }}>
        <p className="text-xs text-center" style={{ color: theme.textSecondary }}>
          {language === 'en' ? (
            <>
              <span className="font-medium" style={{ color: theme.primary }}>●</span> Larger area = stronger overall performance •
              All metrics normalized to 100-point scale
            </>
          ) : (
            <>
              <span className="font-medium" style={{ color: theme.primary }}>●</span> 面积越大 = 综合表现越强 •
              所有指标标准化为100分制
            </>
          )}
        </p>
      </div>
    </div>
  );
}
