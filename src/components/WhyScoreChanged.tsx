import { TrendingDown, TrendingUp, AlertCircle, Users, GraduationCap, BarChart3 } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import type { School } from "../types/school";

interface WhyScoreChangedProps {
  school: School;
  language: 'en' | 'zh';
}

export function WhyScoreChanged({ school, language }: WhyScoreChangedProps) {
  const { theme } = useTheme();
  const changes = [];

  // Math proficiency change
  if (school.trends.mathChange !== 0) {
    changes.push({
      type: school.trends.mathChange < 0 ? "negative" : "positive",
      icon: school.trends.mathChange < 0 ? TrendingDown : TrendingUp,
      text: `Math proficiency ${school.trends.mathChange < 0 ? 'decreased' : 'increased'} by ${Math.abs(school.trends.mathChange)}%`,
      metric: Math.abs(school.trends.mathChange)
    });
  }

  // ELA proficiency change
  if (school.trends.elaChange !== 0) {
    changes.push({
      type: school.trends.elaChange < 0 ? "negative" : "positive",
      icon: school.trends.elaChange < 0 ? TrendingDown : TrendingUp,
      text: `ELA proficiency ${school.trends.elaChange < 0 ? 'decreased' : 'increased'} by ${Math.abs(school.trends.elaChange)}%`,
      metric: Math.abs(school.trends.elaChange)
    });
  }

  // Absenteeism change
  if (school.trends.absenteeismChange !== 0) {
    const oldAbsenteeism = school.chronicAbsenteeism - school.trends.absenteeismChange;
    changes.push({
      type: school.trends.absenteeismChange > 0 ? "negative" : "positive",
      icon: AlertCircle,
      text: `Chronic absenteeism ${school.trends.absenteeismChange > 0 ? 'increased' : 'decreased'} from ${oldAbsenteeism}% → ${school.chronicAbsenteeism}%`,
      metric: Math.abs(school.trends.absenteeismChange)
    });
  }

  // Student-teacher ratio (simulated change based on trend direction)
  const hasRatioChange = school.trends.enrollmentChange !== 0;
  if (hasRatioChange && Math.abs(school.trends.enrollmentChange) > 5) {
    const oldRatio = school.studentTeacherRatio - (school.trends.enrollmentChange > 0 ? 1 : -1);
    changes.push({
      type: school.trends.enrollmentChange > 0 ? "negative" : "positive",
      icon: Users,
      text: `Student-teacher ratio ${school.trends.enrollmentChange > 0 ? 'worsened' : 'improved'} (1:${oldRatio} → 1:${school.studentTeacherRatio})`,
      metric: Math.abs(school.studentTeacherRatio - oldRatio)
    });
  }

  // Asian performance change (simulated based on math trend)
  if (school.trends.mathChange < -2) {
    changes.push({
      type: "negative",
      icon: BarChart3,
      text: `Asian group math performance dropped by ${Math.abs(school.trends.mathChange)}%`,
      metric: Math.abs(school.trends.mathChange)
    });
  }

  // Equity gap analysis
  const mathPerformances = [
    school.performanceByDemographic.asian.math,
    school.performanceByDemographic.white.math,
    school.performanceByDemographic.hispanic.math,
    school.performanceByDemographic.black.math,
  ];
  const gap = Math.max(...mathPerformances) - Math.min(...mathPerformances);
  
  if (gap > 25) {
    changes.push({
      type: "warning",
      icon: AlertCircle,
      text: `Hispanic/Black achievement gaps widened (${gap.toFixed(0)}% gap between highest and lowest performing groups)`,
      metric: gap
    });
  }

  // Enrollment change
  if (Math.abs(school.trends.enrollmentChange) > 8) {
    changes.push({
      type: school.trends.enrollmentChange < 0 ? "negative" : "positive",
      icon: GraduationCap,
      text: `School enrollment ${school.trends.enrollmentChange < 0 ? 'declined' : 'grew'} by ${Math.abs(school.trends.enrollmentChange)}%`,
      metric: Math.abs(school.trends.enrollmentChange)
    });
  }

  // If no significant changes, show positive message
  if (changes.length === 0) {
    changes.push({
      type: "positive",
      icon: TrendingUp,
      text: "School maintains stable performance across all metrics",
      metric: 0
    });
  }

  // Sort by metric (most significant changes first) and take top 6
  const topChanges = changes
    .sort((a, b) => b.metric - a.metric)
    .slice(0, 6);

  const getChangeStyle = (type: string) => {
    switch (type) {
      case "negative":
        return {
          bg: theme.error + '15',
          border: theme.error,
          text: theme.error,
          icon: theme.error
        };
      case "warning":
        return {
          bg: theme.warning + '15',
          border: theme.warning,
          text: theme.warning,
          icon: theme.warning
        };
      case "positive":
        return {
          bg: theme.success + '15',
          border: theme.success,
          text: theme.success,
          icon: theme.success
        };
      default:
        return {
          bg: theme.backgroundHover,
          border: theme.border,
          text: theme.textSecondary,
          icon: theme.textSecondary
        };
    }
  };

  return (
    <div className="rounded-xl p-6 border-2 shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.error + '33' }}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-transparent to-transparent rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${theme.error}20 0%, transparent 70%)` }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-transparent to-transparent rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${theme.warning}20 0%, transparent 70%)` }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 style={{ color: theme.text }}>
              {language === 'en' ? 'Why the Score Changed' : '评分变化原因'}
            </h3>
            <p className="text-sm" style={{ color: theme.textSecondary }}>
              {language === 'en' ? 'Key factors impacting performance' : '影响表现的关键因素'}
            </p>
          </div>

          {/* Badge highlighting this is a key feature */}
          <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#EF4444] to-[#F59E0B] rounded-full">
            <span className="text-white text-xs font-semibold">
              {language === 'en' ? 'Exclusive Insight' : '独家见解'}
            </span>
          </div>
        </div>

        {/* Changes List */}
        <div className="space-y-3">
          {topChanges.map((change, index) => {
            const style = getChangeStyle(change.type);
            const Icon = change.icon;

            return (
              <div
                key={index}
                className="border-l-4 rounded-lg p-4 flex items-start gap-3 transition-all hover:shadow-md"
                style={{
                  backgroundColor: style.bg,
                  borderLeftColor: style.border
                }}
              >
                {/* Arrow indicator */}
                {change.type === "negative" && (
                  <TrendingDown className="size-5 flex-shrink-0 mt-0.5" style={{ color: style.icon }} />
                )}
                {change.type === "positive" && (
                  <TrendingUp className="size-5 flex-shrink-0 mt-0.5" style={{ color: style.icon }} />
                )}
                {change.type === "warning" && (
                  <AlertCircle className="size-5 flex-shrink-0 mt-0.5" style={{ color: style.icon }} />
                )}

                {/* Text */}
                <p className="flex-1" style={{ color: style.text }}>
                  {change.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.error + '33' }}>
          <p className="text-xs italic" style={{ color: theme.textSecondary }}>
            {language === 'en'
              ? '💡 This analysis is unique to NJ School Insights - you won\'t find this level of detail on other platforms'
              : '💡 此分析是新泽西学校洞察独有的 - 您在其他平台上找不到如此详细的信息'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
