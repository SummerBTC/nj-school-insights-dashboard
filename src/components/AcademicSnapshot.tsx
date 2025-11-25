import { TrendingUp, TrendingDown, BookOpen, Calculator } from "lucide-react";
import type { School } from "../types/school";

interface AcademicSnapshotProps {
  school: School;
}

export function AcademicSnapshot({ school }: AcademicSnapshotProps) {
  return (
    <div className="bg-white rounded-xl p-6 border-2 border-[#E5E7EB] shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-gradient-to-r from-[#3B82F6] to-[#A855F7] p-2 rounded-lg">
          <BookOpen className="size-5 text-white" />
        </div>
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
            
            <div className="mb-4">
              <div className="text-4xl text-white mb-1">{school.mathProficiency}%</div>
              <div className="text-sm text-white/80">Proficiency Rate</div>
            </div>

            {school.trends.mathChange !== 0 && (
              <div className={`flex items-center gap-2 ${school.trends.mathChange > 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                {school.trends.mathChange > 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                <span className="text-sm">
                  {school.trends.mathChange > 0 ? '+' : ''}{school.trends.mathChange} pts vs last year
                </span>
              </div>
            )}

            {/* Performance by Demographics */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-xs text-white/80 mb-2">Performance by Group</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Asian</span>
                  <span className="text-white">{school.performanceByDemographic.asian.math}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">White</span>
                  <span className="text-white">{school.performanceByDemographic.white.math}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Hispanic</span>
                  <span className="text-white">{school.performanceByDemographic.hispanic.math}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Black</span>
                  <span className="text-white">{school.performanceByDemographic.black.math}%</span>
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
            
            <div className="mb-4">
              <div className="text-4xl text-white mb-1">{school.elaProficiency}%</div>
              <div className="text-sm text-white/80">Proficiency Rate</div>
            </div>

            {school.trends.elaChange !== 0 && (
              <div className={`flex items-center gap-2 ${school.trends.elaChange > 0 ? 'text-[#FEF3C7]' : 'text-[#FCA5A5]'}`}>
                {school.trends.elaChange > 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}
                <span className="text-sm">
                  {school.trends.elaChange > 0 ? '+' : ''}{school.trends.elaChange} pts vs last year
                </span>
              </div>
            )}

            {/* Performance by Demographics */}
            <div className="mt-4 pt-4 border-t border-white/20">
              <div className="text-xs text-white/80 mb-2">Performance by Group</div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Asian</span>
                  <span className="text-white">{school.performanceByDemographic.asian.ela}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">White</span>
                  <span className="text-white">{school.performanceByDemographic.white.ela}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Hispanic</span>
                  <span className="text-white">{school.performanceByDemographic.hispanic.ela}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/80">Black</span>
                  <span className="text-white">{school.performanceByDemographic.black.ela}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}