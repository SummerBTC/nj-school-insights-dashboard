import { Calendar, Shield, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";
import { Badge } from "./ui/badge";
import type { School } from "../types/school";

interface AttendanceSafetyProps {
  school: School;
  language: 'en' | 'zh';
}

export function AttendanceSafety({ school, language }: AttendanceSafetyProps) {
  const { theme } = useTheme();
  const getClimateColor = (climate: string) => {
    switch (climate) {
      case "Safe":
        return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20";
      case "Moderate":
        return "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/20";
      case "Needs Improvement":
        return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
      default:
        return "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20";
    }
  };

  const getBullyingColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20";
      case "Medium":
        return "bg-[#FBBF24]/10 text-[#FBBF24] border-[#FBBF24]/20";
      case "High":
        return "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20";
      default:
        return "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20";
    }
  };

  return (
    <div className="rounded-xl p-6 border-2 shadow-lg relative overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.warning + '33' }}>
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl" style={{ background: `radial-gradient(circle, ${theme.warning}20 0%, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="mb-4">
          <h3 style={{ color: theme.text }}>
            {language === 'en' ? 'Attendance & Safety' : '出勤与安全'}
          </h3>
        </div>

        {/* Three metrics in horizontal layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Chronic Absenteeism */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4" style={{ color: theme.info }} />
              <span className="text-sm font-medium" style={{ color: theme.text }}>Chronic Absenteeism</span>
            </div>
            <div className="text-3xl font-bold mb-2" style={{
              color: school.chronicAbsenteeism < 5 ? theme.success : school.chronicAbsenteeism < 10 ? theme.warning : theme.error
            }}>
              {school.chronicAbsenteeism}%
            </div>

            {/* Progress bar */}
            <div className="relative h-1.5 rounded-full overflow-hidden mb-2" style={{ backgroundColor: theme.border }}>
              <div
                className="absolute top-0 left-0 h-full transition-all"
                style={{
                  width: `${Math.min(school.chronicAbsenteeism * 2, 100)}%`,
                  backgroundColor: school.chronicAbsenteeism < 5 ? theme.success : school.chronicAbsenteeism < 10 ? theme.warning : theme.error
                }}
              />
            </div>

            <div className="text-xs" style={{ color: theme.textSecondary }}>
              Attendance: {100 - school.chronicAbsenteeism}%
            </div>
          </div>

          {/* School Climate */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-4" style={{ color: theme.info }} />
              <span className="text-sm font-medium" style={{ color: theme.text }}>School Climate</span>
            </div>
            <Badge className={`${getClimateColor(school.schoolClimate)} text-lg px-3 py-1`}>
              {school.schoolClimate}
            </Badge>
          </div>

          {/* Bullying Reports */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4" style={{ color: theme.info }} />
              <span className="text-sm font-medium" style={{ color: theme.text }}>Bullying Reports</span>
            </div>
            <Badge className={`${getBullyingColor(school.bullyingReports)} text-lg px-3 py-1`}>
              {school.bullyingReports}
            </Badge>
          </div>
        </div>

        {/* Insight Box */}
        {school.chronicAbsenteeism > 10 && (
          <div className="mt-4 p-3 border rounded-lg" style={{ backgroundColor: theme.error + '15', borderColor: theme.error + '33' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 mt-0.5 flex-shrink-0" style={{ color: theme.error }} />
              <div className="text-sm" style={{ color: theme.error }}>
                High absenteeism may impact student performance and school culture. Consider investigating root causes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}