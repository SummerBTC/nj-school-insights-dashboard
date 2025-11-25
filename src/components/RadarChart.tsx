import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { School } from "../types/school";
import { BarChart3 } from "lucide-react";

interface RadarChartProps {
  school: School;
}

export function RadarChart({ school }: RadarChartProps) {
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

  const data = [
    {
      metric: "Math",
      value: school.mathProficiency,
      fullMark: 100,
    },
    {
      metric: "ELA",
      value: school.elaProficiency,
      fullMark: 100,
    },
    {
      metric: "Attendance",
      value: 100 - school.chronicAbsenteeism,
      fullMark: 100,
    },
    {
      metric: "Class Size",
      value: normalizeStudentTeacherRatio(school.studentTeacherRatio),
      fullMark: 100,
    },
    {
      metric: "Equity",
      value: calculateEquityScore(),
      fullMark: 100,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-[#F0FDF4] rounded-xl p-6 border-2 border-[#22C55E]/20 shadow-lg relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#22C55E]/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] p-2 rounded-lg">
            <BarChart3 className="size-5 text-white" />
          </div>
          <h3 className="text-[#374151]">School Performance Radar</h3>
        </div>
        <p className="text-sm text-[#6B7280] mb-6">
          Five-dimension performance overview normalized to 0-100 scale
        </p>
      
        <ResponsiveContainer width="100%" height={350}>
          <RechartsRadar data={data}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fill: '#6B7280', fontSize: 10 }}
            />
            <Radar
              name="Performance"
              dataKey="value"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
              formatter={(value: number) => [`${value.toFixed(0)}`, 'Score']}
            />
          </RechartsRadar>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-[#22C55E]/20">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between p-2 bg-[#EFF6FF] rounded-lg">
              <span className="text-[#6B7280]">Math:</span>
              <span className="text-[#3B82F6]">{school.mathProficiency}%</span>
            </div>
            <div className="flex justify-between p-2 bg-[#F0FDF4] rounded-lg">
              <span className="text-[#6B7280]">ELA:</span>
              <span className="text-[#22C55E]">{school.elaProficiency}%</span>
            </div>
            <div className="flex justify-between p-2 bg-[#FFFBEB] rounded-lg">
              <span className="text-[#6B7280]">Attendance:</span>
              <span className="text-[#F59E0B]">{100 - school.chronicAbsenteeism}%</span>
            </div>
            <div className="flex justify-between p-2 bg-[#F5F3FF] rounded-lg">
              <span className="text-[#6B7280]">Class Size:</span>
              <span className="text-[#A855F7]">{normalizeStudentTeacherRatio(school.studentTeacherRatio).toFixed(0)}/100</span>
            </div>
            <div className="flex justify-between col-span-2 p-2 bg-[#FFF1F2] rounded-lg">
              <span className="text-[#6B7280]">Equity (lower gap):</span>
              <span className="text-[#EC4899]">{calculateEquityScore().toFixed(0)}/100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}