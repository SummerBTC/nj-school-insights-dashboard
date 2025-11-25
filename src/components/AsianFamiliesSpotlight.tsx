import { TrendingUp, TrendingDown, Users, Calculator, BookOpen, BarChart3 } from "lucide-react";
import type { School } from "../types/school";

interface AsianFamiliesSpotlightProps {
  school: School;
}

export function AsianFamiliesSpotlight({ school }: AsianFamiliesSpotlightProps) {
  const asianMath = school.performanceByDemographic.asian.math;
  const asianELA = school.performanceByDemographic.asian.ela;
  const asianPopulation = school.demographics.asian;
  
  // Calculate gaps
  const mathGap = asianMath - school.mathProficiency;
  const elaGap = asianELA - school.elaProficiency;
  
  // Simulate Asian year-over-year trend based on overall trend
  const asianMathTrend = school.trends.mathChange;
  const asianELATrend = school.trends.elaChange;

  return (
    <div className="bg-gradient-to-br from-[#A855F7] to-[#9333EA] rounded-xl p-6 border-2 border-[#7E22CE] shadow-xl relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
              <Users className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-white">Asian Families Spotlight</h3>
              <p className="text-white/80 text-sm">Targeted performance insights</p>
            </div>
          </div>
          
          {/* Population Badge */}
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
            <div className="text-white/80 text-xs mb-0.5">Population</div>
            <div className="text-white text-xl">{asianPopulation}%</div>
          </div>
        </div>

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Math Performance */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="size-5 text-white" />
              <span className="text-white/90 text-sm">Math</span>
            </div>
            <div className="text-3xl text-white mb-1">{asianMath}%</div>
            
            {asianMathTrend !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${asianMathTrend > 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                {asianMathTrend > 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                <span>{asianMathTrend > 0 ? '+' : ''}{asianMathTrend}% vs last year</span>
              </div>
            )}
            
            {/* Gap indicator */}
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">vs School Avg</span>
                <span className={`${mathGap > 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                  {mathGap > 0 ? '+' : ''}{mathGap.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* ELA Performance */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="size-5 text-white" />
              <span className="text-white/90 text-sm">ELA</span>
            </div>
            <div className="text-3xl text-white mb-1">{asianELA}%</div>
            
            {asianELATrend !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${asianELATrend > 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                {asianELATrend > 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                <span>{asianELATrend > 0 ? '+' : ''}{asianELATrend}% vs last year</span>
              </div>
            )}
            
            {/* Gap indicator */}
            <div className="mt-2 pt-2 border-t border-white/20">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/80">vs School Avg</span>
                <span className={`${elaGap > 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                  {elaGap > 0 ? '+' : ''}{elaGap.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Gap Analysis */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="size-5 text-white" />
            <span className="text-white text-sm">Performance vs Schoolwide</span>
          </div>
          
          <div className="space-y-3">
            {/* Math Gap Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-white/90 mb-1">
                <span>Math Gap</span>
                <span>{mathGap > 0 ? '+' : ''}{mathGap.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 h-full transition-all ${mathGap > 0 ? 'bg-[#86EFAC] left-1/2' : 'bg-[#FCA5A5] right-1/2'}`}
                  style={{ width: `${Math.min(Math.abs(mathGap) * 2, 50)}%` }}
                />
              </div>
            </div>

            {/* ELA Gap Bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-white/90 mb-1">
                <span>ELA Gap</span>
                <span>{elaGap > 0 ? '+' : ''}{elaGap.toFixed(1)}%</span>
              </div>
              <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 h-full transition-all ${elaGap > 0 ? 'bg-[#86EFAC] left-1/2' : 'bg-[#FCA5A5] right-1/2'}`}
                  style={{ width: `${Math.min(Math.abs(elaGap) * 2, 50)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Year-over-Year Trend Summary */}
        <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="text-white/80 text-xs mb-2">📊 Year-over-Year Trend</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-white/90 text-sm">Math Trend</span>
              <span className={`text-sm ${asianMathTrend >= 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                {asianMathTrend > 0 ? '↗' : asianMathTrend < 0 ? '↘' : '→'} {asianMathTrend > 0 ? '+' : ''}{asianMathTrend}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/90 text-sm">ELA Trend</span>
              <span className={`text-sm ${asianELATrend >= 0 ? 'text-[#86EFAC]' : 'text-[#FCA5A5]'}`}>
                {asianELATrend > 0 ? '↗' : asianELATrend < 0 ? '↘' : '→'} {asianELATrend > 0 ? '+' : ''}{asianELATrend}%
              </span>
            </div>
          </div>
        </div>

        {/* Insight Box */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/70">
            {mathGap > 5 || elaGap > 5 
              ? `💡 Asian students are performing above school average by ${Math.max(mathGap, elaGap).toFixed(1)}% in ${mathGap > elaGap ? 'Math' : 'ELA'}`
              : mathGap < -5 || elaGap < -5
              ? `⚠️ Performance gap indicates need for targeted support programs`
              : `✓ Performance is aligned with school average across subjects`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
