import { TrendingUp, TrendingDown } from "lucide-react";
import type { School } from "../types/school";

interface SchoolResultCardProps {
  school: School;
  onSelect: (school: School) => void;
}

export function SchoolResultCard({ school, onSelect }: SchoolResultCardProps) {
  return (
    <article
      onClick={() => onSelect(school)}
      className="rounded-2xl bg-white shadow-sm border border-pink-50 p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
      {/* Top row: School name + Score */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-3">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">
            {school.name}
          </h2>
          <p className="text-[11px] text-gray-500 mt-1">
            {school.type} · {school.grades} · {school.county}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide">Score</div>
          <div className="text-xl font-bold text-pink-500">{school.overallScore}</div>
        </div>
      </div>

      {/* Metrics pills */}
      <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
        {/* Math */}
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium flex items-center gap-1">
          Math {school.mathProficiency}
          {school.trends.mathChange !== 0 && (
            <span className={school.trends.mathChange > 0 ? 'text-green-600' : 'text-red-600'}>
              {school.trends.mathChange > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(school.trends.mathChange)}
            </span>
          )}
        </span>

        {/* ELA */}
        <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium flex items-center gap-1">
          ELA {school.elaProficiency}
          {school.trends.elaChange !== 0 && (
            <span className={school.trends.elaChange > 0 ? 'text-green-600' : 'text-red-600'}>
              {school.trends.elaChange > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {Math.abs(school.trends.elaChange)}
            </span>
          )}
        </span>

        {/* Attendance */}
        <span className="px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-700 font-medium">
          Att {(100 - school.chronicAbsenteeism).toFixed(0)}
        </span>

        {/* Student-Teacher Ratio */}
        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-medium">
          Class {school.studentTeacherRatio}:1
        </span>

        {/* Optional: Gifted badge */}
        {school.giftedTalentedProgram && (
          <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 font-medium">
            ⭐ Gifted
          </span>
        )}
      </div>
    </article>
  );
}
