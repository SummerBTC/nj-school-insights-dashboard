import { TrendingUp, TrendingDown, BookOpen, Calculator } from "lucide-react";
import type { School } from "../types/school";

interface AcademicSnapshotProps {
  school: School;
  language: 'en' | 'zh';
}

export function AcademicSnapshot({ school, language }: AcademicSnapshotProps) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-[#E5E7EB] shadow-lg">
      <div className="mb-4">
        <h3 className="text-[#374151]">
          {language === 'en' ? 'Academic Performance' : '学业表现'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Math Card - Lavender Blue */}
        <div className="rounded-xl p-6 border-2 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #A7B7FF, #91A5FF)', borderColor: '#8899FF' }}>
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="size-5 text-[#2C3A66]" />
              <span className="text-[#2C3A66] font-semibold">
                {language === 'en' ? 'Math' : '数学'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left: Main Score */}
              <div>
                <div className="text-4xl text-[#2C3A66] font-bold mb-1">{school.mathProficiency}%</div>
                <div className="text-sm text-[#2C3A66]/70 mb-3">
                  {language === 'en' ? 'Proficiency Rate' : '优秀率'}
                </div>

                {school.trends.mathChange !== 0 && (
                  <div className={`flex items-center gap-2 ${school.trends.mathChange > 0 ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                    {school.trends.mathChange > 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange} {language === 'en' ? 'pts' : '分'}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Performance by Group with Bar Charts */}
              <div>
                <div className="text-xs text-[#2C3A66]/70 mb-2">
                  {language === 'en' ? 'Performance by Group' : '各族裔表现'}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Asian', value: school.performanceByDemographic.asian.math, color: 'bg-[#059669]' },
                    { label: 'White', value: school.performanceByDemographic.white.math, color: 'bg-[#FCD34D]' },
                    { label: 'Hispanic', value: school.performanceByDemographic.hispanic.math, color: 'bg-[#FB923C]' },
                    { label: 'Black', value: school.performanceByDemographic.black.math, color: 'bg-[#F87171]' }
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[#2C3A66]/70">{label}</span>
                        <span className="text-[#2C3A66] font-semibold">{value}%</span>
                      </div>
                      <div className="h-1.5 bg-[#2C3A66]/10 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ELA Card - Mint Green */}
        <div className="rounded-xl p-6 border-2 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #B4F1D8, #88E3C4)', borderColor: '#6FD9B8' }}>
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-5 text-[#2C4A3F]" />
              <span className="text-[#2C4A3F] font-semibold">
                {language === 'en' ? 'ELA' : '英语'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left: Main Score */}
              <div>
                <div className="text-4xl text-[#2C4A3F] font-bold mb-1">{school.elaProficiency}%</div>
                <div className="text-sm text-[#2C4A3F]/70 mb-3">
                  {language === 'en' ? 'Proficiency Rate' : '优秀率'}
                </div>

                {school.trends.elaChange !== 0 && (
                  <div className={`flex items-center gap-2 ${school.trends.elaChange > 0 ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                    {school.trends.elaChange > 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    <span className="text-sm font-semibold">
                      {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange} {language === 'en' ? 'pts' : '分'}
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Performance by Group with Bar Charts */}
              <div>
                <div className="text-xs text-[#2C4A3F]/70 mb-2">
                  {language === 'en' ? 'Performance by Group' : '各族裔表现'}
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Asian', value: school.performanceByDemographic.asian.ela, color: 'bg-[#059669]' },
                    { label: 'White', value: school.performanceByDemographic.white.ela, color: 'bg-[#FCD34D]' },
                    { label: 'Hispanic', value: school.performanceByDemographic.hispanic.ela, color: 'bg-[#FB923C]' },
                    { label: 'Black', value: school.performanceByDemographic.black.ela, color: 'bg-[#F87171]' }
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-[#2C4A3F]/70">{label}</span>
                        <span className="text-[#2C4A3F] font-semibold">{value}%</span>
                      </div>
                      <div className="h-1.5 bg-[#2C4A3F]/10 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}