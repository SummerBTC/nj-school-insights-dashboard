import { Trophy, TrendingUp, Users, GraduationCap } from "lucide-react";
import { Badge } from "./ui/badge";
import type { School } from "../types/school";

interface SchoolRankingListProps {
  schools: School[];
  activeFilters: string[];
}

export function SchoolRankingList({ schools, activeFilters }: SchoolRankingListProps) {
  // Apply filters
  const filteredSchools = schools.filter((school) => {
    if (activeFilters.includes("gifted") && !school.giftedProgram) return false;
    if (activeFilters.includes("lowAbsentee") && school.chronicAbsenteeism >= 5) return false;
    if (activeFilters.includes("highMath") && school.mathProficiency < 80) return false;
    if (activeFilters.includes("highAsianPerformance") && school.performanceByDemographic.asian.math < 85) return false;
    return true;
  });

  // Sort by math proficiency
  const rankedSchools = [...filteredSchools].sort((a, b) => b.mathProficiency - a.mathProficiency);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-[#FBBF24]";
    if (rank === 2) return "text-[#9CA3AF]";
    if (rank === 3) return "text-[#CD7F32]";
    return "text-[#6B7280]";
  };

  return (
    <div className="space-y-4">
      {rankedSchools.length === 0 ? (
        <div className="bg-white rounded-lg p-12 border border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No schools match your filter criteria. Try removing some filters.</p>
        </div>
      ) : (
        rankedSchools.map((school, index) => {
          const rank = index + 1;
          return (
            <div
              key={school.id}
              className="bg-gradient-to-r from-white via-white to-[#FFFBEB] rounded-xl p-6 border-2 border-[#E5E7EB] hover:border-[#FBBF24] transition-all hover:shadow-xl relative overflow-hidden"
            >
              {/* Decorative element for top 3 */}
              {rank <= 3 && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FBBF24]/10 to-transparent rounded-full blur-2xl" />
              )}
              
              <div className="flex items-start gap-4 relative z-10">
                {/* Rank Number */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  rank === 1 ? 'bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] text-white shadow-lg' :
                  rank === 2 ? 'bg-gradient-to-br from-[#94A3B8] to-[#64748B] text-white shadow-lg' :
                  rank === 3 ? 'bg-gradient-to-br from-[#D97706] to-[#B45309] text-white shadow-lg' :
                  'bg-[#F9FAFB] text-[#6B7280]'
                }`}>
                  {rank <= 3 ? (
                    <Trophy className="size-6" />
                  ) : (
                    <span className="text-xl">{rank}</span>
                  )}
                </div>

                {/* School Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-[#111827] mb-1">{school.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <span>{school.district}</span>
                        <span>•</span>
                        <span>{school.county}</span>
                        <span>•</span>
                        <Badge variant="outline" className="border-[#3B82F6] text-[#3B82F6]">
                          {school.grades}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl text-[#3B82F6]">{school.overallScore}</div>
                      <div className="text-xs text-[#6B7280]">Overall</div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">Math Proficiency</div>
                      <div className="text-xl text-[#3B82F6]">{school.mathProficiency}%</div>
                      {school.trends.mathChange > 0 && (
                        <div className="flex items-center gap-1 text-xs text-[#22C55E]">
                          <TrendingUp className="size-3" />
                          +{school.trends.mathChange} pts
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">Gifted Program</div>
                      <div className={`flex items-center gap-2 ${school.giftedProgram ? 'text-[#22C55E]' : 'text-[#6B7280]'}`}>
                        <GraduationCap className="size-5" />
                        <span>{school.giftedProgram ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">Student-Teacher</div>
                      <div className="flex items-center gap-2 text-[#374151]">
                        <Users className="size-5" />
                        <span>1:{school.studentTeacherRatio}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#F9FAFB] rounded-lg">
                      <div className="text-sm text-[#6B7280] mb-1">Asian Math</div>
                      <div className="text-xl text-[#374151]">
                        {school.performanceByDemographic.asian.math}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}