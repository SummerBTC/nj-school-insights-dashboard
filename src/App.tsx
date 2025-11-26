// src/App.tsx

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { Dashboard } from "./components/Dashboard";
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
import  fetchNjSchools  from "./data/fetchNjSchools";
import type { School } from "./types/school";

export default function App() {
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Load dark mode preference from localStorage
    const saved = localStorage.getItem('schoolberry-dark-mode');
    return saved ? JSON.parse(saved) : false;
  });

  // 从 Supabase 拉取真实数据
  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNjSchools();
        setSchools(data);
        setSelectedSchool(data[0] ?? null);
      } catch (e) {
        console.error("❌ Failed to load schools", e);
        setError("Failed to load NJ school data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Handle school selection from Dashboard
  const handleSelectSchoolFromDashboard = (school: School) => {
    setSelectedSchool(school);
    setActiveTab("school-detail");
  };

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('schoolberry-dark-mode', JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: darkMode ? '#1A1A1A' : '#FFFDFC' }}>
      {/* Header - SchoolBerry Design System */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: darkMode ? '#2F2F2F' : '#FF5B85', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-black tracking-tight flex items-center gap-3" style={{ color: darkMode ? '#FF5B85' : '#FFFFFF' }}>
                  SchoolBerry
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: darkMode ? '#3A3A3A' : 'rgba(255,255,255,0.2)', color: darkMode ? '#64D7A5' : '#FFFFFF' }}>
                    BETA
                  </span>
                </h1>
                <p className="font-bold" style={{ color: darkMode ? '#64D7A5' : '#FFFFFF' }}>
                  Find your perfect school
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="px-4 py-2 rounded-2xl hover:scale-110 transition-transform font-bold text-sm"
                style={{ backgroundColor: darkMode ? '#3A3A3A' : 'rgba(255,255,255,0.2)', color: darkMode ? '#64D7A5' : '#FFFFFF' }}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          {/* 只有在School Detail tab才显示搜索框 */}
          {schools.length > 0 && selectedSchool && activeTab === "school-detail" && (
            <div className="mt-4">
              <SearchBar
                schools={schools}
                onSelectSchool={setSelectedSchool}
                selectedSchool={selectedSchool}
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* 加载中 / 报错 提示 */}
        {loading && (
          <div className="text-center text-sm text-slate-500 py-16">
            Loading NJ schools…
          </div>
        )}

        {error && !loading && (
          <div className="text-center text-sm text-red-500 py-16">
            {error}
          </div>
        )}

        {!loading && !error && schools.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8 p-2 rounded-2xl" style={{ backgroundColor: darkMode ? '#2F2F2F' : '#FFFFFF', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <TabsTrigger value="dashboard" className="rounded-xl font-black transition-all">
                Home
              </TabsTrigger>
              <TabsTrigger value="school-detail" className="rounded-xl font-black transition-all">
                School Detail
              </TabsTrigger>
              <TabsTrigger value="compare" className="rounded-xl font-black transition-all">
                Compare
              </TabsTrigger>
              <TabsTrigger value="rankings" className="rounded-xl font-black transition-all">
                Rankings
              </TabsTrigger>
              <TabsTrigger value="trends" className="rounded-xl font-black transition-all">
                Trends
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab - NEW HOME PAGE */}
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard
                schools={schools}
                onSelectSchool={handleSelectSchoolFromDashboard}
                darkMode={darkMode}
              />
            </TabsContent>

            {/* School Detail Tab - Previously "Overview" */}
            <TabsContent value="school-detail" className="space-y-6">
              {selectedSchool && (
                <>
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
                          Gifted & Talented Program
                        </h3>
                        <p className="text-white/90 text-sm">
                          {selectedSchool.giftedProgram
                            ? "This school offers a Gifted & Talented program"
                            : "No G&T program reported at this school"}
                        </p>
                      </div>
                      <div className="text-white font-black text-2xl">
                        {selectedSchool.giftedProgram ? "Available" : "N/A"}
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
                    <h3 className="text-[#374151] font-semibold mb-4">
                      School Details
                    </h3>
                    <div className="space-y-4">
                      <div className="pb-3 border-b border-[#E5E7EB]">
                        <div className="text-xs text-[#6B7280] mb-1">
                          Student-Teacher Ratio
                        </div>
                        <div className="text-2xl font-bold text-[#3B82F6]">
                          1:{selectedSchool.studentTeacherRatio}
                        </div>
                      </div>
                      <div className="pb-3 border-b border-[#E5E7EB]">
                        <div className="text-xs text-[#6B7280] mb-1">
                          Total Enrollment
                        </div>
                        <div className="text-2xl font-bold text-[#22C55E]">
                          {selectedSchool.enrollment}
                        </div>
                        <div className="text-xs text-[#9CA3AF]">students</div>
                      </div>
                      <div className="pb-3 border-b border-[#E5E7EB]">
                        <div className="text-xs text-[#6B7280] mb-1">
                          District
                        </div>
                        <div className="text-sm font-medium text-[#374151]">
                          {selectedSchool.district}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] mb-1">
                          Grade Span
                        </div>
                        <div className="text-sm font-medium text-[#374151]">
                          {selectedSchool.gradeSpan || "K-12"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Climate & Safety Mini Card */}
                  <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 border border-[#059669] shadow-md">
                    <div className="text-white/90 text-xs mb-2">
                      Climate & Safety
                    </div>
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
                </>
              )}
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare">
              {selectedSchool && (
                <CompareSchools
                  schools={schools}
                  defaultSchool={selectedSchool}
                />
              )}
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
              <GiftedFilters
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
              />
              <SchoolRankingList
                schools={schools}
                activeFilters={activeFilters}
              />
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends">
              {selectedSchool && (
                <TrendsInsights school={selectedSchool} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}