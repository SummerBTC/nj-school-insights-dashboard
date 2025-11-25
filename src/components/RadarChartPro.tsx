import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { School } from "../types/school";
import { BarChart3 } from "lucide-react";

interface RadarChartProProps {
  school: School;
}

export function RadarChartPro({ school }: RadarChartProProps) {
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
    <div className="bg-white rounded-xl p-6 border-2 border-[#3C6EFF]/10 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-gradient-to-r from-[#3C6EFF] to-[#2952CC] p-2.5 rounded-lg shadow-md">
          <BarChart3 className="size-5 text-white" />
        </div>
        <div>
          <h3 className="text-[#1F2937] font-semibold text-lg">Performance Radar</h3>
          <p className="text-sm text-[#6B7280]">
            Five-dimension analysis • 0-100 scale
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={380}>
        <RechartsRadar data={metrics}>
          {/* Grid with professional styling */}
          <PolarGrid
            stroke="#D1D5DB"
            strokeWidth={1.5}
            gridType="polygon"
          />

          {/* Angle axis (metric names) */}
          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fill: '#374151',
              fontSize: 13,
              fontWeight: 600
            }}
          />

          {/* Radius axis (scale: 0, 25, 50, 75, 100) */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{
              fill: '#6B7280',
              fontSize: 11,
              fontWeight: 500
            }}
            tickCount={5}
            stroke="#9CA3AF"
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
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              border: '2px solid #3C6EFF',
              borderRadius: '12px',
              padding: '12px 16px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}
            labelStyle={{
              color: '#1F2937',
              fontWeight: 600,
              marginBottom: '4px'
            }}
            formatter={(value: number) => [
              <span className="font-semibold text-[#3C6EFF]">{value.toFixed(1)}</span>,
              'Score'
            ]}
          />
        </RechartsRadar>
      </ResponsiveContainer>

      {/* Metric values grid */}
      <div className="mt-6 pt-5 border-t-2 border-[#E5E7EB]">
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m, idx) => (
            <div
              key={m.metric}
              className="flex flex-col items-center p-3 rounded-lg border border-[#E5E7EB] hover:border-[#3C6EFF] hover:bg-[#F0F5FF] transition-all cursor-default"
            >
              <div className="text-xs text-[#6B7280] mb-1">{m.metric}</div>
              <div className="text-xl font-bold text-[#3C6EFF]">
                {m.displayValue.toFixed(0)}
              </div>
              <div className="text-[10px] text-[#9CA3AF]">/ 100</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-4 px-3 py-2 bg-[#F0F5FF] rounded-lg border border-[#3C6EFF]/20">
        <p className="text-xs text-[#6B7280] text-center">
          <span className="font-medium text-[#3C6EFF]">●</span> Larger area = stronger overall performance •
          All metrics normalized to 100-point scale
        </p>
      </div>
    </div>
  );
}
