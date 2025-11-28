import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown, AlertCircle, Users, BarChart3 } from "lucide-react";
import type { School } from "../types/school";

interface TrendsInsightsProps {
  school: School;
  language: 'en' | 'zh';
}

export function TrendsInsights({ school, language }: TrendsInsightsProps) {
  // Generate 3-year trend data
  const currentYear = 2025;
  const mathTrendData = [
    { year: currentYear - 2, value: school.mathProficiency - school.trends.mathChange * 2 },
    { year: currentYear - 1, value: school.mathProficiency - school.trends.mathChange },
    { year: currentYear, value: school.mathProficiency },
  ];

  const elaTrendData = [
    { year: currentYear - 2, value: school.elaProficiency - school.trends.elaChange * 2 },
    { year: currentYear - 1, value: school.elaProficiency - school.trends.elaChange },
    { year: currentYear, value: school.elaProficiency },
  ];

  const absenteeismTrendData = [
    { year: currentYear - 2, value: school.chronicAbsenteeism - school.trends.absenteeismChange * 2 },
    { year: currentYear - 1, value: school.chronicAbsenteeism - school.trends.absenteeismChange },
    { year: currentYear, value: school.chronicAbsenteeism },
  ];

  const combinedTrendData = [
    { 
      year: `${currentYear - 2}`, 
      Math: school.mathProficiency - school.trends.mathChange * 2,
      ELA: school.elaProficiency - school.trends.elaChange * 2,
    },
    { 
      year: `${currentYear - 1}`, 
      Math: school.mathProficiency - school.trends.mathChange,
      ELA: school.elaProficiency - school.trends.elaChange,
    },
    { 
      year: `${currentYear}`, 
      Math: school.mathProficiency,
      ELA: school.elaProficiency,
    },
  ];

  const demographicData = [
    { demographic: "Asian", percentage: school.demographics.asian, math: school.performanceByDemographic.asian.math },
    { demographic: "White", percentage: school.demographics.white, math: school.performanceByDemographic.white.math },
    { demographic: "Hispanic", percentage: school.demographics.hispanic, math: school.performanceByDemographic.hispanic.math },
    { demographic: "Black", percentage: school.demographics.black, math: school.performanceByDemographic.black.math },
  ];

  // Root cause analysis
  const getRootCauses = () => {
    const causes = [];
    
    if (school.trends.mathChange < 0 || school.trends.elaChange < 0) {
      if (school.trends.absenteeismChange > 2) {
        causes.push({
          icon: AlertCircle,
          title: language === 'en' ? "Increasing Absenteeism" : "缺勤率上升",
          description: language === 'en'
            ? `Chronic absenteeism rose by ${school.trends.absenteeismChange}%, which correlates with declining academic performance.`
            : `长期缺勤率上升了${school.trends.absenteeismChange}%，这与学业表现下降相关。`,
          severity: "high"
        });
      }

      if (school.trends.enrollmentChange < -5) {
        causes.push({
          icon: Users,
          title: language === 'en' ? "Enrollment Decline" : "入学人数下降",
          description: language === 'en'
            ? `School enrollment decreased by ${Math.abs(school.trends.enrollmentChange)}%, potentially affecting resources and program offerings.`
            : `学校入学人数减少了${Math.abs(school.trends.enrollmentChange)}%，可能影响资源和项目提供。`,
          severity: "medium"
        });
      }

      // Check for equity gaps
      const mathPerformances = [
        school.performanceByDemographic.asian.math,
        school.performanceByDemographic.white.math,
        school.performanceByDemographic.hispanic.math,
        school.performanceByDemographic.black.math,
      ];
      const gap = Math.max(...mathPerformances) - Math.min(...mathPerformances);
      
      if (gap > 25) {
        causes.push({
          icon: BarChart3,
          title: language === 'en' ? "Achievement Gaps" : "成绩差距",
          description: language === 'en'
            ? `Significant performance gaps (${gap.toFixed(0)}%) exist between demographic groups, indicating equity concerns.`
            : `不同族裔群体之间存在显著的表现差距（${gap.toFixed(0)}%），表明存在公平性问题。`,
          severity: "high"
        });
      }
    }

    if (causes.length === 0) {
      causes.push({
        icon: TrendingDown,
        title: language === 'en' ? "Stable Performance" : "表现稳定",
        description: language === 'en'
          ? "No significant negative trends detected. School is maintaining consistent performance."
          : "未检测到显著的负面趋势。学校保持稳定的表现。",
        severity: "low"
      });
    }

    return causes;
  };

  const rootCauses = getRootCauses();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-[#EF4444] bg-[#FEF2F2]";
      case "medium":
        return "border-[#FBBF24] bg-[#FFFBEB]";
      default:
        return "border-[#22C55E] bg-[#F0FDF4]";
    }
  };

  return (
    <div className="space-y-6">
      {/* Root Cause Analysis */}
      <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
        <h3 className="mb-4 text-[#374151]">
          {language === 'en' ? 'Why Performance Changed: Root Cause Analysis' : '表现变化原因：根本原因分析'}
        </h3>
        <div className="space-y-4">
          {rootCauses.map((cause, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getSeverityColor(cause.severity)}`}
            >
              <div className="flex items-start gap-3">
                <cause.icon className="size-5 text-[#374151] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-[#111827] mb-1">{cause.title}</h4>
                  <p className="text-sm text-[#6B7280]">{cause.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Year Academic Trend */}
      <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
        <h3 className="mb-4 text-[#374151]">
          {language === 'en' ? '3-Year Academic Performance Trend' : '3年学业表现趋势'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6B7280' }}
              label={{
                value: language === 'en' ? 'Proficiency %' : '优秀率 %',
                angle: -90,
                position: 'insideLeft',
                fill: '#6B7280'
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Math" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="ELA" 
              stroke="#22C55E" 
              strokeWidth={2}
              dot={{ fill: '#22C55E', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#F9FAFB] rounded-lg">
            <div className="text-sm text-[#6B7280] mb-1">
              {language === 'en' ? 'Math Change' : '数学变化'}
            </div>
            <div className={`text-xl ${school.trends.mathChange >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange} {language === 'en' ? 'pts' : '分'}
            </div>
          </div>
          <div className="p-3 bg-[#F9FAFB] rounded-lg">
            <div className="text-sm text-[#6B7280] mb-1">
              {language === 'en' ? 'ELA Change' : '英语变化'}
            </div>
            <div className={`text-xl ${school.trends.elaChange >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange} {language === 'en' ? 'pts' : '分'}
            </div>
          </div>
        </div>
      </div>

      {/* Absenteeism Trend */}
      <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
        <h3 className="mb-4 text-[#374151]">
          {language === 'en' ? 'Chronic Absenteeism Trend' : '长期缺勤趋势'}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={absenteeismTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
              label={{
                value: language === 'en' ? 'Absenteeism %' : '缺勤率 %',
                angle: -90,
                position: 'insideLeft',
                fill: '#6B7280'
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="value" 
              fill="#FBBF24"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Demographic Shifts & Performance */}
      <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
        <h3 className="mb-4 text-[#374151]">
          {language === 'en' ? 'Demographic Distribution & Math Performance' : '人口分布与数学表现'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={demographicData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="demographic"
              tick={{ fill: '#6B7280' }}
            />
            <YAxis
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar
              dataKey="percentage"
              fill="#3B82F6"
              name={language === 'en' ? '% of Students' : '学生占比 %'}
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="math"
              fill="#22C55E"
              name={language === 'en' ? 'Math Proficiency %' : '数学水平 %'}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">
            {language === 'en'
              ? 'This chart shows the relationship between student demographics and math performance. Large gaps may indicate equity issues requiring targeted interventions.'
              : '此图表显示学生人口统计与数学表现之间的关系。较大的差距可能表明需要针对性干预的公平性问题。'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
