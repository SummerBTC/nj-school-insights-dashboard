import { Users } from "lucide-react";
import type { School } from "../types/school";

interface DemographicsBarChartProps {
  school: School;
}

export function DemographicsBarChart({ school }: DemographicsBarChartProps) {
  const demographics = [
    {
      label: "Asian",
      value: school.demographics.asian,
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    },
    {
      label: "White",
      value: school.demographics.white,
      color: "#22C55E",
      bgColor: "#F0FDF4"
    },
    {
      label: "Hispanic",
      value: school.demographics.hispanic,
      color: "#F59E0B",
      bgColor: "#FFFBEB"
    },
    {
      label: "Black",
      value: school.demographics.black,
      color: "#A855F7",
      bgColor: "#F5F3FF"
    },
  ].sort((a, b) => b.value - a.value); // Sort by value descending

  const maxValue = Math.max(...demographics.map(d => d.value));

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-[#374151] font-semibold">Student Demographics</h3>
        <p className="text-sm text-[#6B7280]">Breakdown by Ethnicity</p>
      </div>

      <div className="space-y-4">
        {demographics.map((demo) => (
          <div key={demo.label} className="group">
            {/* Label and percentage */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-[#374151]">{demo.label}</span>
              <span className="text-sm font-semibold" style={{ color: demo.color }}>
                {demo.value.toFixed(2)}%
              </span>
            </div>

            {/* Horizontal bar */}
            <div className="relative h-8 rounded-lg overflow-hidden" style={{ backgroundColor: demo.bgColor }}>
              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 h-full rounded-lg transition-all duration-500 ease-out group-hover:brightness-110"
                style={{
                  width: `${(demo.value / maxValue) * 100}%`,
                  backgroundColor: demo.color
                }}
              />

              {/* Inner bar visualization */}
              <div className="absolute inset-0 flex items-center px-3">
                <div className="flex-1 flex items-center justify-end pr-2">
                  {/* Block characters for visual effect */}
                  <span className="text-white text-xs font-mono opacity-80">
                    {demo.value > 10 ? '█'.repeat(Math.min(Math.floor(demo.value / 10), 10)) : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
        <div className="text-xs text-[#6B7280]">
          <span className="font-medium">Diversity Index:</span>{' '}
          <span className="text-[#374151]">
            {(100 - Math.max(...demographics.map(d => d.value))).toFixed(0)}
          </span>
          <span className="text-[#9CA3AF]"> (100 = perfect diversity)</span>
        </div>
      </div>
    </div>
  );
}
