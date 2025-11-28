import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import type { School } from "../types/school";

interface DemographicsBarChartProps {
  school: School;
  language: 'en' | 'zh';
}

export function DemographicsBarChart({ school, language }: DemographicsBarChartProps) {
  const demographics = [
    {
      name: "Asian",
      value: school.demographics.asian,
      color: "#3B82F6"
    },
    {
      name: "White",
      value: school.demographics.white,
      color: "#22C55E"
    },
    {
      name: "Hispanic",
      value: school.demographics.hispanic,
      color: "#F59E0B"
    },
    {
      name: "Black",
      value: school.demographics.black,
      color: "#A855F7"
    },
  ].filter(d => d.value > 0); // Only show groups with students

  // Custom label to show percentage on pie slices
  const renderLabel = (entry: any) => {
    return `${entry.value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
      <div className="mb-6">
        <h3 className="text-[#374151] font-semibold">
          {language === 'en' ? 'Student Demographics' : '学生人口统计'}
        </h3>
        <p className="text-sm text-[#6B7280]">
          {language === 'en' ? 'Breakdown by Ethnicity' : '按族裔分类'}
        </p>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={demographics}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {demographics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value.toFixed(2)}%`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px'
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: '#374151', fontSize: '14px' }}>
                  {value} ({entry.payload.value.toFixed(1)}%)
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
        <div className="text-xs text-[#6B7280]">
          <span className="font-medium">
            {language === 'en' ? 'Diversity Index:' : '多样性指数：'}
          </span>{' '}
          <span className="text-[#374151]">
            {(100 - Math.max(...demographics.map(d => d.value))).toFixed(0)}
          </span>
          <span className="text-[#9CA3AF]">
            {language === 'en' ? ' (100 = perfect diversity)' : ' (100 = 完美多样性)'}
          </span>
        </div>
      </div>
    </div>
  );
}
