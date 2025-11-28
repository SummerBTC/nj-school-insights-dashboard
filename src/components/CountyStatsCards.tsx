import type { School } from "../types/school";

interface CountyStatsCardsProps {
  overallScore: number;
  totalSchools: number;
  giftedPrograms: number;
  avgMath: number;
  language: 'en' | 'zh';
}

export function CountyStatsCards({
  overallScore,
  totalSchools,
  giftedPrograms,
  avgMath,
  language,
}: CountyStatsCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* 综合评分 */}
      <div
        className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        style={{ border: '1px solid #F3EAF5' }}
      >
        <div className="text-sm text-gray-600 mb-2">
          {language === 'en' ? 'Overall Score' : '综合评分'}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-pink-500">
            {overallScore || 0}
          </span>
          <span className="text-sm text-gray-500">/100</span>
        </div>
      </div>

      {/* 学校总数 */}
      <div
        className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        style={{ border: '1px solid #F3EAF5' }}
      >
        <div className="text-sm text-gray-600 mb-2">
          {language === 'en' ? 'Total Schools' : '学校总数'}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-emerald-600">
            {totalSchools}
          </span>
          <span className="text-sm text-gray-500">
            {language === 'en' ? 'schools' : '所'}
          </span>
        </div>
      </div>

      {/* 资优项目 */}
      <div
        className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        style={{ border: '1px solid #F3EAF5' }}
      >
        <div className="text-sm text-gray-600 mb-2">
          {language === 'en' ? 'Gifted Programs' : '资优项目'}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-purple-500">
            {giftedPrograms}
          </span>
          <span className="text-sm text-gray-500">
            {language === 'en' ? 'programs' : '个'}
          </span>
        </div>
      </div>

      {/* 平均数学 */}
      <div
        className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
        style={{ border: '1px solid #F3EAF5' }}
      >
        <div className="text-sm text-gray-600 mb-2">
          {language === 'en' ? 'Avg Math' : '平均数学'}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-blue-600">
            {avgMath || 0}
          </span>
          <span className="text-sm text-gray-500">%</span>
        </div>
      </div>
    </div>
  );
}
