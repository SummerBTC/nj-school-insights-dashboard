import { Calendar, Shield, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "./ui/badge";
import type { School } from "../types/school";

interface AttendanceSafetyProps {
  school: School;
}

export function AttendanceSafety({ school }: AttendanceSafetyProps) {
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
    <div className="bg-gradient-to-br from-white to-[#FFFBEB] rounded-xl p-6 border-2 border-[#FBBF24]/20 shadow-lg relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#FBBF24]/10 to-transparent rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-r from-[#FBBF24] to-[#F59E0B] p-2 rounded-lg">
            <Shield className="size-5 text-white" />
          </div>
          <h3 className="text-[#374151]">Attendance & Safety</h3>
        </div>

        {/* Chronic Absenteeism */}
        <div className="mb-6 p-4 bg-[#F9FAFB] rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-[#3B82F6]" />
              <span className="text-[#374151]">Chronic Absenteeism</span>
            </div>
            <div className={`text-2xl ${school.chronicAbsenteeism < 5 ? 'text-[#22C55E]' : school.chronicAbsenteeism < 10 ? 'text-[#FBBF24]' : 'text-[#EF4444]'}`}>
              {school.chronicAbsenteeism}%
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="relative h-2 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
            <div 
              className={`absolute top-0 left-0 h-full transition-all ${
                school.chronicAbsenteeism < 5 
                  ? 'bg-[#22C55E]' 
                  : school.chronicAbsenteeism < 10 
                  ? 'bg-[#FBBF24]' 
                  : 'bg-[#EF4444]'
              }`}
              style={{ width: `${Math.min(school.chronicAbsenteeism * 2, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Attendance Rate: {100 - school.chronicAbsenteeism}%</span>
            {school.trends.absenteeismChange !== 0 && (
              <span className={`flex items-center gap-1 ${school.trends.absenteeismChange < 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {school.trends.absenteeismChange < 0 ? (
                  <TrendingDown className="size-3" />
                ) : (
                  <TrendingUp className="size-3" />
                )}
                {school.trends.absenteeismChange > 0 ? '+' : ''}{school.trends.absenteeismChange}% vs last year
              </span>
            )}
          </div>
        </div>

        {/* School Climate */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-[#3B82F6]" />
              <span className="text-[#374151]">School Climate</span>
            </div>
            <Badge className={getClimateColor(school.schoolClimate)}>
              {school.schoolClimate}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-[#3B82F6]" />
              <span className="text-[#374151]">Bullying Reports</span>
            </div>
            <Badge className={getBullyingColor(school.bullyingReports)}>
              {school.bullyingReports}
            </Badge>
          </div>
        </div>

        {/* Insight Box */}
        {school.chronicAbsenteeism > 10 && (
          <div className="mt-4 p-3 bg-[#FEF2F2] border border-[#EF4444]/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-[#EF4444] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#EF4444]">
                High absenteeism may impact student performance and school culture. Consider investigating root causes.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}