import { Badge } from "./ui/badge";
import { MapPin, Users, GraduationCap } from "lucide-react";
import type { School } from "../types/school";

interface OverviewCardProps {
  school: School;
}

export function OverviewCard({ school }: OverviewCardProps) {
  return (
    <div className="bg-gradient-to-br from-white via-white to-[#EFF6FF] rounded-xl p-8 border-2 border-[#3B82F6]/20 shadow-lg relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#3B82F6]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#22C55E]/5 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-[#111827] mb-2">{school.name}</h2>
            <div className="flex items-center gap-3 text-[#6B7280]">
              <Badge variant="outline" className="border-[#3B82F6] text-[#3B82F6] bg-[#EFF6FF]">
                {school.type}
              </Badge>
              <span>•</span>
              <span>{school.grades}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                <span>{school.county}</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-4 rounded-xl text-white shadow-lg">
            <div className="text-3xl mb-1">{school.overallScore}</div>
            <div className="text-xs opacity-90">Overall Score</div>
          </div>
        </div>

        <p className="text-[#6B7280] mb-6 italic border-l-4 border-gradient-to-b from-[#3B82F6] to-[#22C55E] bg-gradient-to-r from-[#EFF6FF] to-transparent pl-4 py-2 rounded-r">
          "{school.description}"
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="bg-gradient-to-br from-[#DBEAFE] to-[#EFF6FF] p-4 rounded-xl border border-[#3B82F6]/20">
            <div className="text-sm text-[#1E40AF] mb-1">Math Proficiency</div>
            <div className="text-2xl text-[#1E40AF]">{school.mathProficiency}%</div>
            {school.trends.mathChange !== 0 && (
              <div className={`text-sm ${school.trends.mathChange > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {school.trends.mathChange > 0 ? '▲' : '▼'} {Math.abs(school.trends.mathChange)} pt
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#D1FAE5] to-[#DCFCE7] p-4 rounded-xl border border-[#22C55E]/20">
            <div className="text-sm text-[#15803D] mb-1">ELA Proficiency</div>
            <div className="text-2xl text-[#15803D]">{school.elaProficiency}%</div>
            {school.trends.elaChange !== 0 && (
              <div className={`text-sm ${school.trends.elaChange > 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {school.trends.elaChange > 0 ? '▲' : '▼'} {Math.abs(school.trends.elaChange)} pt
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FEF9C3] p-4 rounded-xl border border-[#FBBF24]/20">
            <div className="text-sm text-[#92400E] mb-1">Attendance</div>
            <div className="text-2xl text-[#92400E]">{100 - school.chronicAbsenteeism}%</div>
            <div className="text-sm text-[#92400E]/70">{school.chronicAbsenteeism}% absent</div>
          </div>

          <div className="bg-gradient-to-br from-[#E9D5FF] to-[#F3E8FF] p-4 rounded-xl border border-[#A855F7]/20">
            <div className="text-sm text-[#6B21A8] mb-1">Student-Teacher</div>
            <div className="text-2xl text-[#6B21A8]">1:{school.studentTeacherRatio}</div>
            <div className="flex items-center gap-1 text-sm text-[#6B21A8]/70">
              <Users className="size-3" />
              <span>{school.enrollment}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#FBCFE8] to-[#FCE7F3] p-4 rounded-xl border border-[#EC4899]/20">
            <div className="text-sm text-[#9F1239] mb-1">Gifted Program</div>
            <div className="text-2xl text-[#9F1239]">{school.giftedProgram ? "Yes" : "No"}</div>
            {school.giftedProgram && (
              <div className="flex items-center gap-1 text-sm text-[#22C55E]">
                <GraduationCap className="size-3" />
                <span>Available</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}