import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { OverviewCard } from "./components/OverviewCard";
import { RadarChartPro } from "./components/RadarChartPro";
import { DemographicsBarChart } from "./components/DemographicsBarChart";
import { AcademicSnapshot } from "./components/AcademicSnapshot";
import { AttendanceSafety } from "./components/AttendanceSafety";
import { WhyScoreChanged } from "./components/WhyScoreChanged";
import { AsianFamiliesSpotlight } from "./components/AsianFamiliesSpotlight";
import { GiftedFilters } from "./components/GiftedFilters";
import { SchoolRankingList } from "./components/SchoolRankingList";
import { CompareSchools } from "./components/CompareSchools";
import { TrendsInsights } from "./components/TrendsInsights";
import { mockSchools } from "./data/mockData";
import type { School } from "./types/school";

export default function App() {
  const [selectedSchool, setSelectedSchool] = useState<School>(mockSchools[0]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFF6FF] via-[#F9FAFB] to-[#F0FDF4]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] border-b border-[#1E40AF] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <GraduationCap className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-white">
                  NJ School Insights
                </h1>
                <p className="text-[#BFDBFE] text-sm">Transparent Data • Better Decisions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <span className="text-white text-sm">🚀 Better than GreatSchools</span>
              </div>
            </div>
          </div>
          <SearchBar 
            schools={mockSchools}
            onSelectSchool={setSelectedSchool}
            selectedSchool={selectedSchool}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8 bg-white shadow-md border border-[#E5E7EB] p-1.5">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#3B82F6] data-[state=active]:to-[#2563EB] data-[state=active]:text-white">
              🏫 School Overview
            </TabsTrigger>
            <TabsTrigger value="compare" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#22C55E] data-[state=active]:to-[#16A34A] data-[state=active]:text-white">
              ⚖️ Compare Schools
            </TabsTrigger>
            <TabsTrigger value="rankings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#FBBF24] data-[state=active]:to-[#F59E0B] data-[state=active]:text-white">
              🏆 Best Math Schools
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#A855F7] data-[state=active]:to-[#9333EA] data-[state=active]:text-white">
              📈 Trends & Insights
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - NEW TWO-COLUMN LAYOUT */}
          <TabsContent value="overview" className="space-y-6">
            {/* Top: School Header Card */}
            <OverviewCard school={selectedSchool} />

            {/* Why Score Changed - Core Differentiator */}
            <WhyScoreChanged school={selectedSchool} />

            {/* TWO-COLUMN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN (2/3 width) - Main Indicators */}
              <div className="lg:col-span-2 space-y-6">
                {/* Math & ELA Cards */}
                <AcademicSnapshot school={selectedSchool} />

                {/* Attendance */}
                <AttendanceSafety school={selectedSchool} />

                {/* Gifted Program Highlight */}
                <div className="bg-gradient-to-br from-[#FBBF24] to-[#F59E0B] rounded-xl p-6 border-2 border-[#F59E0B] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        🎯 Gifted & Talented Program
                      </h3>
                      <p className="text-white/90 text-sm">
                        {selectedSchool.giftedProgram
                          ? "This school offers a Gifted & Talented program"
                          : "No G&T program reported at this school"
                        }
                      </p>
                    </div>
                    <div className="text-5xl">
                      {selectedSchool.giftedProgram ? "✅" : "❌"}
                    </div>
                  </div>
                </div>

                {/* Demographics Summary - Horizontal Bars */}
                <DemographicsBarChart school={selectedSchool} />
              </div>

              {/* RIGHT COLUMN (1/3 width) - Details & Supplementary */}
              <div className="space-y-6">
                {/* School Details Card */}
                <div className="bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm">
                  <h3 className="text-[#374151] font-semibold mb-4">📋 School Details</h3>
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">Student-Teacher Ratio</div>
                      <div className="text-2xl font-bold text-[#3B82F6]">1:{selectedSchool.studentTeacherRatio}</div>
                    </div>
                    <div className="pb-3 border-b border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">Total Enrollment</div>
                      <div className="text-2xl font-bold text-[#22C55E]">{selectedSchool.enrollment}</div>
                      <div className="text-xs text-[#9CA3AF]">students</div>
                    </div>
                    <div className="pb-3 border-b border-[#E5E7EB]">
                      <div className="text-xs text-[#6B7280] mb-1">District</div>
                      <div className="text-sm font-medium text-[#374151]">{selectedSchool.district}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#6B7280] mb-1">Grade Span</div>
                      <div className="text-sm font-medium text-[#374151]">
                        {selectedSchool.gradeSpan || "K-12"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Climate & Safety Mini Card */}
                <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 border border-[#059669] shadow-md">
                  <div className="text-white/90 text-xs mb-2">🛡️ Climate & Safety</div>
                  <div className="text-3xl font-bold text-white mb-1">
                    {(100 - selectedSchool.chronicAbsenteeism).toFixed(0)}
                  </div>
                  <div className="text-white/80 text-sm">Safety Index</div>
                  <div className="mt-3 pt-3 border-t border-white/20">
                    <div className="text-xs text-white/70">
                      Based on attendance and incident data
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FULL WIDTH SECTION: Radar Chart + Asian Families */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Professional Radar Chart */}
              <RadarChartPro school={selectedSchool} />

              {/* Asian Families Spotlight */}
              <AsianFamiliesSpotlight school={selectedSchool} />
            </div>

            {/* FULL WIDTH: Trends (if needed later) */}
            {/* This section can be expanded with trend charts */}
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare">
            <CompareSchools schools={mockSchools} defaultSchool={selectedSchool} />
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings">
            <GiftedFilters 
              activeFilters={activeFilters}
              onFilterChange={setActiveFilters}
            />
            <SchoolRankingList 
              schools={mockSchools}
              activeFilters={activeFilters}
            />
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <TrendsInsights school={selectedSchool} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}