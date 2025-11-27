// src/App.tsx

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { GraduationCap, Menu, X } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<string>("school-detail");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>(() => {
    // Load language preference from localStorage
    const saved = localStorage.getItem('schoolberry-language');
    return (saved as 'en' | 'zh') || 'en';
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

  // Toggle language and save to localStorage
  const toggleLanguage = () => {
    setLanguage(prev => {
      const newValue = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem('schoolberry-language', newValue);
      return newValue;
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFDFC' }}>
      {/* Header - SchoolBerry Design System */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#FF5B85', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 lg:gap-6">
              {/* Mobile Menu Toggle - Only on mobile and tablet, to the left of logo */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-btn p-2"
                style={{ color: '#FFFFFF' }}
              >
                <Menu className="size-6" />
              </button>

              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2" style={{ color: '#FFFFFF' }}>
                SchoolBerry
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}>
                  BETA
                </span>
              </h1>
              <p className="mobile-only-hidden font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {language === 'en' ? 'School search that actually makes sense.' : '真正有意义的学校搜索工具'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-2xl hover:scale-110 transition-transform font-bold text-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
                title={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
              >
                {language === 'en' ? '中文' : 'EN'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer - Full Screen Slide from Left */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-btn fixed inset-0 z-50 menu-drawer-slide"
          style={{
            backgroundColor: '#FFFDFC'
          }}
        >
          {/* Close Button in Top Right */}
          <div className="flex justify-end p-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="size-7" style={{ color: '#FF5B85' }} />
            </button>
          </div>

          {/* Menu Items - Centered */}
          <div className="flex flex-col px-8 space-y-4 max-w-md mx-auto" style={{ marginTop: '15%' }}>
            <button
              onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
              className="w-full px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "dashboard" ? '#FFE7EE' : 'transparent',
                color: activeTab === "dashboard" ? '#FF5B85' : '#6B7280'
              }}
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setActiveTab("school-detail"); setMobileMenuOpen(false); }}
              className="w-full px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "school-detail" ? '#FFE7EE' : 'transparent',
                color: activeTab === "school-detail" ? '#FF5B85' : '#6B7280'
              }}
            >
              🔍 Search School
            </button>
            <button
              onClick={() => { setActiveTab("compare"); setMobileMenuOpen(false); }}
              className="w-full px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "compare" ? '#FFE7EE' : 'transparent',
                color: activeTab === "compare" ? '#FF5B85' : '#6B7280'
              }}
            >
              ⚖️ Compare
            </button>
            <button
              onClick={() => { setActiveTab("rankings"); setMobileMenuOpen(false); }}
              className="w-full px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "rankings" ? '#FFE7EE' : 'transparent',
                color: activeTab === "rankings" ? '#FF5B85' : '#6B7280'
              }}
            >
              🏆 Rankings
            </button>
            <button
              onClick={() => { setActiveTab("trends"); setMobileMenuOpen(false); }}
              className="w-full px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "trends" ? '#FFE7EE' : 'transparent',
                color: activeTab === "trends" ? '#FF5B85' : '#6B7280'
              }}
            >
              📈 Trends
            </button>
          </div>
        </div>
      )}

      {/* Tabs Bar - Desktop Only (hidden on mobile and tablet) */}
      {!loading && !error && schools.length > 0 && (
        <div className="desktop-tabs sticky z-40" style={{ top: '51px', backgroundColor: '#FFE7EE', boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)', marginTop: '-1px' }}>
          <div className="max-w-7xl mx-auto px-6">
            {/* Desktop Tabs - React Style with Underline */}
            <div className="border-b-2 pb-0" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className="px-6 py-3 font-black text-base transition-all relative"
                  style={{
                    color: activeTab === "dashboard" ? '#FF5B85' : ('#6B7280'),
                    borderBottom: activeTab === "dashboard" ? '3px solid #FF5B85' : '3px solid transparent',
                    marginBottom: '-2px',
                  }}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab("school-detail")}
                  className="px-6 py-3 font-black text-base transition-all relative"
                  style={{
                    color: activeTab === "school-detail" ? '#FF5B85' : ('#6B7280'),
                    borderBottom: activeTab === "school-detail" ? '3px solid #FF5B85' : '3px solid transparent',
                    marginBottom: '-2px',
                  }}
                >
                  Search School
                </button>
                <button
                  onClick={() => setActiveTab("compare")}
                  className="px-6 py-3 font-black text-base transition-all relative"
                  style={{
                    color: activeTab === "compare" ? '#FF5B85' : ('#6B7280'),
                    borderBottom: activeTab === "compare" ? '3px solid #FF5B85' : '3px solid transparent',
                    marginBottom: '-2px',
                  }}
                >
                  Compare
                </button>
                <button
                  onClick={() => setActiveTab("rankings")}
                  className="px-6 py-3 font-black text-base transition-all relative"
                  style={{
                    color: activeTab === "rankings" ? '#FF5B85' : ('#6B7280'),
                    borderBottom: activeTab === "rankings" ? '3px solid #FF5B85' : '3px solid transparent',
                    marginBottom: '-2px',
                  }}
                >
                  Rankings
                </button>
                <button
                  onClick={() => setActiveTab("trends")}
                  className="px-6 py-3 font-black text-base transition-all relative"
                  style={{
                    color: activeTab === "trends" ? '#FF5B85' : ('#6B7280'),
                    borderBottom: activeTab === "trends" ? '3px solid #FF5B85' : '3px solid transparent',
                    marginBottom: '-2px',
                  }}
                >
                  Trends
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar - Below tabs, only in Search School tab */}
      {schools.length > 0 && selectedSchool && activeTab === "school-detail" && (
        <div className="relative z-10" style={{ backgroundColor: '#FFFDFC', paddingTop: '16px', paddingBottom: '16px' }}>
          <div className="max-w-7xl mx-auto px-6">
            <SearchBar
              schools={schools}
              onSelectSchool={setSelectedSchool}
              selectedSchool={selectedSchool}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-0 max-w-7xl mx-auto px-6 py-8">
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
            {/* Dashboard Tab - NEW HOME PAGE */}
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard
                schools={schools}
                onSelectSchool={handleSelectSchoolFromDashboard}
              />
            </TabsContent>

            {/* School Detail Tab - Previously "Overview" */}
            <TabsContent value="school-detail" className="space-y-6">
              {selectedSchool && (
                <>
                  {/* Top: School Header Card */}
                  <OverviewCard school={selectedSchool} />

              {/* HIGHLIGHTED SECTION: Radar Chart + Asian Families */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Professional Radar Chart */}
                <RadarChartPro school={selectedSchool} />

                {/* Asian Families Spotlight */}
                <AsianFamiliesSpotlight school={selectedSchool} />
              </div>

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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-[#EFF6FF] rounded-lg">
                        <div className="text-xs text-[#6B7280] mb-1">
                          Student-Teacher Ratio
                        </div>
                        <div className="text-xl font-bold text-[#3B82F6]">
                          1:{selectedSchool.studentTeacherRatio}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-[#F0FDF4] rounded-lg">
                        <div className="text-xs text-[#6B7280] mb-1">
                          Total Enrollment
                        </div>
                        <div className="text-xl font-bold text-[#22C55E]">
                          {selectedSchool.enrollment}
                        </div>
                        <div className="text-xs text-[#9CA3AF]">students</div>
                      </div>
                      <div className="text-center p-3 bg-[#F9FAFB] rounded-lg">
                        <div className="text-xs text-[#6B7280] mb-1">
                          District
                        </div>
                        <div className="text-sm font-medium text-[#374151]">
                          {selectedSchool.district}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-[#FEF3C7] rounded-lg">
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