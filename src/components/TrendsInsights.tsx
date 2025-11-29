import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown, AlertCircle, Users, BarChart3 } from "lucide-react";
import type { School } from "../types/school";
import { useTheme } from "../theme/ThemeContext";

interface TrendsInsightsProps {
  school: School;
  language: 'en' | 'zh';
}

export function TrendsInsights({ school, language }: TrendsInsightsProps) {
  const { theme } = useTheme();
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
        return { borderColor: theme.error, backgroundColor: theme.backgroundHover };
      case "medium":
        return { borderColor: theme.warning, backgroundColor: theme.backgroundHover };
      default:
        return { borderColor: theme.success, backgroundColor: theme.backgroundHover };
    }
  };

  return (
    <div className="space-y-6">
      {/* Root Cause Analysis */}
      <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
        <h3 className="mb-4" style={{ color: theme.text }}>
          {language === 'en' ? 'Why Performance Changed: Root Cause Analysis' : '表现变化原因：根本原因分析'}
        </h3>
        <div className="space-y-4">
          {rootCauses.map((cause, index) => {
            const colors = getSeverityColor(cause.severity);
            return (
              <div
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{ borderLeftColor: colors.borderColor, backgroundColor: colors.backgroundColor }}
              >
                <div className="flex items-start gap-3">
                  <cause.icon className="size-5 mt-0.5 flex-shrink-0" style={{ color: theme.text }} />
                  <div>
                    <h4 className="mb-1" style={{ color: theme.text }}>{cause.title}</h4>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>{cause.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3-Year Academic Trend */}
      <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
        <h3 className="mb-4" style={{ color: theme.text }}>
          {language === 'en' ? '3-Year Academic Performance Trend' : '3年学业表现趋势'}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={combinedTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis
              dataKey="year"
              tick={{ fill: theme.textSecondary }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: theme.textSecondary }}
              label={{
                value: language === 'en' ? 'Proficiency %' : '优秀率 %',
                angle: -90,
                position: 'insideLeft',
                fill: theme.textSecondary
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.backgroundElevated,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Math"
              stroke={theme.info}
              strokeWidth={2}
              dot={{ fill: theme.info, r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="ELA"
              stroke={theme.success}
              strokeWidth={2}
              dot={{ fill: theme.success, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="text-sm mb-1" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'Math Change' : '数学变化'}
            </div>
            <div className="text-xl" style={{ color: school.trends.mathChange >= 0 ? theme.success : theme.error }}>
              {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange} {language === 'en' ? 'pts' : '分'}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="text-sm mb-1" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'ELA Change' : '英语变化'}
            </div>
            <div className="text-xl" style={{ color: school.trends.elaChange >= 0 ? theme.success : theme.error }}>
              {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange} {language === 'en' ? 'pts' : '分'}
            </div>
          </div>
        </div>
      </div>

      {/* Absenteeism Trend */}
      <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
        <h3 className="mb-4" style={{ color: theme.text }}>
          {language === 'en' ? 'Chronic Absenteeism Trend' : '长期缺勤趋势'}
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={absenteeismTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} />
            <XAxis
              dataKey="year"
              tick={{ fill: theme.textSecondary }}
            />
            <YAxis
              tick={{ fill: theme.textSecondary }}
              label={{
                value: language === 'en' ? 'Absenteeism %' : '缺勤率 %',
                angle: -90,
                position: 'insideLeft',
                fill: theme.textSecondary
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.backgroundElevated,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={theme.warning}
              strokeWidth={2}
              dot={{ fill: theme.warning, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
          <div className="text-sm mb-1" style={{ color: theme.textSecondary }}>
            {language === 'en' ? 'Absenteeism Change' : '缺勤率变化'}
          </div>
          <div className="text-xl" style={{ color: school.trends.absenteeismChange <= 0 ? theme.success : theme.error }}>
            {school.trends.absenteeismChange > 0 ? '+' : ''}{school.trends.absenteeismChange} {language === 'en' ? 'pts' : '分'}
          </div>
        </div>
      </div>
    </div>
  );
}
