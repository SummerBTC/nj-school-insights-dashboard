import { TrendingUp, TrendingDown, BookOpen, Calculator } from "lucide-react";
import type { School } from "../types/school";

interface AcademicSnapshotProps {
  school: School;
}

export function AcademicSnapshot({ school }: AcademicSnapshotProps) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-[#E5E7EB] shadow-lg">
      <div className="mb-4">
        <h3 className="text-[#374151]">Academic Performance</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Math Card */}
        <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-xl p-6 border-2 border-[#1E40AF] shadow-xl relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="size-5 text-white" />
              <span className="text-white">Math</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left: Main Score */}
              <div>
                <div className="text-4xl text-white mb-1">{school.mathProficiency}%</div>
                <div className="text-sm text-white/80 mb-3">Proficiency Rate</div>

                {school.trends.mathChange !== 0 && (
                  <div className={`flex items-center gap-2 ${school.trends.mathChange > 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                    {school.trends.mathChange > 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    <span className="text-sm">
                      {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange} pts
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Performance by Group with Bar Charts */}
              <div>
                <div className="text-xs text-white/80 mb-2">Performance by Group</div>
                <div className="space-y-2">
                  {[
                    { label: 'Asian', value: school.performanceByDemographic.asian.math, color: 'bg-[#86EFAC]' },
                    { label: 'White', value: school.performanceByDemographic.white.math, color: 'bg-[#FEF3C7]' },
                    { label: 'Hispanic', value: school.performanceByDemographic.hispanic.math, color: 'bg-[#FED7AA]' },
                    { label: 'Black', value: school.performanceByDemographic.black.math, color: 'bg-[#FCA5A5]' }
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-white/80">{label}</span>
                        <span className="text-white font-semibold">{value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ELA Card */}
        <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl p-6 border-2 border-[#15803D] shadow-xl relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-5 text-white" />
              <span className="text-white">ELA</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left: Main Score */}
              <div>
                <div className="text-4xl text-white mb-1">{school.elaProficiency}%</div>
                <div className="text-sm text-white/80 mb-3">Proficiency Rate</div>

                {school.trends.elaChange !== 0 && (
                  <div className={`flex items-center gap-2 ${school.trends.elaChange > 0 ? 'text-[#FEF3C7]' : 'text-[#FCA5A5]'}`}>
                    {school.trends.elaChange > 0 ? (
                      <TrendingUp className="size-4" />
                    ) : (
                      <TrendingDown className="size-4" />
                    )}
                    <span className="text-sm">
                      {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange} pts
                    </span>
                  </div>
                )}
              </div>

              {/* Right: Performance by Group with Bar Charts */}
              <div>
                <div className="text-xs text-white/80 mb-2">Performance by Group</div>
                <div className="space-y-2">
                  {[
                    { label: 'Asian', value: school.performanceByDemographic.asian.ela, color: 'bg-[#86EFAC]' },
                    { label: 'White', value: school.performanceByDemographic.white.ela, color: 'bg-[#FEF3C7]' },
                    { label: 'Hispanic', value: school.performanceByDemographic.hispanic.ela, color: 'bg-[#FED7AA]' },
                    { label: 'Black', value: school.performanceByDemographic.black.ela, color: 'bg-[#FCA5A5]' }
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="text-white/80">{label}</span>
                        <span className="text-white font-semibold">{value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
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