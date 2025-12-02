// src/App.tsx

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { GraduationCap, Menu, X, Moon, Sun, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./components/ui/tooltip";
import { SearchBar } from "./components/SearchBar";
import { Dashboard } from "./components/Dashboard";
import { OverviewCard } from "./components/OverviewCard";
import { BerryEmptyState } from "./components/BerryEmptyState";
import { RadarChartPro } from "./components/RadarChartPro";
import { DemographicsBarChart } from "./components/DemographicsBarChart";
import { AcademicSnapshot } from "./components/AcademicSnapshot";
import { AttendanceSafety } from "./components/AttendanceSafety";
import { WhyScoreChanged } from "./components/WhyScoreChanged";
import { AsianFamiliesSpotlight } from "./components/AsianFamiliesSpotlight";
import { RankingControls, type SortOption, type GroupByOption } from "./components/RankingControls";
import { EnhancedSchoolRankingList } from "./components/EnhancedSchoolRankingList";
import { CompareSchools } from "./components/CompareSchools";
import { EnhancedTrendsInsights } from "./components/EnhancedTrendsInsights";
import  fetchNjSchools  from "./data/fetchNjSchools";
import type { School } from "./types/school";
import { useTheme } from "./theme/ThemeContext";

export default function App() {
  const { theme, mode, toggleTheme } = useTheme();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [quickFind, setQuickFind] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('overall');
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overall");
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
        // DO NOT auto-select first school - let user search and choose
        setSelectedSchool(null);
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
    setActiveTab("school-details");
  };

  // Toggle language and save to localStorage
  const toggleLanguage = () => {
    setLanguage(prev => {
      const newValue = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem('schoolberry-language', newValue);
      return newValue;
    });
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background }}>
      {/* Fixed Header - Contains banner, tabs, and search bar */}
      <header className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: theme.backgroundElevated, boxShadow: `0px 2px 8px ${theme.shadow}` }}>
        {/* Banner - SchoolBerry Design System with Search */}
        <div style={{ backgroundColor: theme.bannerPurple }}>
          <div className="max-w-7xl mx-auto px-6 py-3">
            {/* Top Row: Logo and Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 lg:gap-6">
                {/* Mobile Menu Toggle - Only on mobile and tablet, to the left of logo */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="mobile-menu-btn p-2"
                  style={{ color: '#FFFFFF' }}
                >
                  <Menu className="size-6" />
                </button>

                <h1 className="text-lg font-bold tracking-wide flex items-center gap-2" style={{ color: '#FFFFFF', fontFamily: "'Fredoka', 'Comic Sans MS', 'Trebuchet MS', cursive", letterSpacing: '0.02em' }}>
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
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-2xl hover:scale-110 transition-transform"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
                  title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                  {mode === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
                </button>
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

            {/* Search Bar - Always visible in banner */}
            {schools.length > 0 && (
              <SearchBar
                schools={schools}
                onSelectSchool={(school) => {
                  setSelectedSchool(school);
                  // Only navigate to school-details if not already on a page that shows school data
                  if (activeTab !== "school-details" && activeTab !== "trends" && activeTab !== "compare") {
                    setActiveTab("school-details");
                  }
                }}
                selectedSchool={selectedSchool}
                language={language}
              />
            )}
          </div>
        </div>

        {/* Tabs Bar - Desktop Only (hidden on mobile and tablet) */}
        {!loading && !error && schools.length > 0 && (
          <div className="desktop-tabs m-0" style={{ backgroundColor: theme.primaryGlow }}>
            <div className="max-w-7xl mx-auto px-6">
              {/* Desktop Tabs - React Style with Underline */}
              <div className="border-b-2 pb-0 m-0" style={{ borderColor: theme.border }}>
                <div className="flex gap-2 m-0">
                  <button
                    onClick={() => setActiveTab("overall")}
                    className="px-6 py-3 font-black text-base transition-all relative"
                    style={{
                      color: activeTab === "overall" ? theme.primary : theme.textSecondary,
                      borderBottom: activeTab === "overall" ? `3px solid ${theme.primary}` : '3px solid transparent',
                      marginBottom: '-2px',
                    }}
                  >
                    {language === 'en' ? 'County Overview' : '县区概览'}
                  </button>
                  <button
                    onClick={() => setActiveTab("school-details")}
                    className="px-6 py-3 font-black text-base transition-all relative"
                    style={{
                      color: activeTab === "school-details" ? theme.primary : theme.textSecondary,
                      borderBottom: activeTab === "school-details" ? `3px solid ${theme.primary}` : '3px solid transparent',
                      marginBottom: '-2px',
                    }}
                  >
                    {language === 'en' ? 'School Details' : '学校详情'}
                  </button>
                  <button
                    onClick={() => setActiveTab("compare")}
                    className="px-6 py-3 font-black text-base transition-all relative"
                    style={{
                      color: activeTab === "compare" ? theme.primary : theme.textSecondary,
                      borderBottom: activeTab === "compare" ? `3px solid ${theme.primary}` : '3px solid transparent',
                      marginBottom: '-2px',
                    }}
                  >
                    {language === 'en' ? 'Compare' : '对比'}
                  </button>
                  <button
                    onClick={() => setActiveTab("rankings")}
                    className="px-6 py-3 font-black text-base transition-all relative"
                    style={{
                      color: activeTab === "rankings" ? theme.primary : theme.textSecondary,
                      borderBottom: activeTab === "rankings" ? `3px solid ${theme.primary}` : '3px solid transparent',
                      marginBottom: '-2px',
                    }}
                  >
                    {language === 'en' ? 'Rankings' : '排名'}
                  </button>
                  <button
                    onClick={() => setActiveTab("trends")}
                    className="px-6 py-3 font-black text-base transition-all relative"
                    style={{
                      color: activeTab === "trends" ? theme.primary : theme.textSecondary,
                      borderBottom: activeTab === "trends" ? `3px solid ${theme.primary}` : '3px solid transparent',
                      marginBottom: '-2px',
                    }}
                  >
                    {language === 'en' ? 'Trends' : '趋势'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-btn fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: theme.backgroundElevated }}>
          {/* Top Row: Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: theme.border }}>
            <span className="text-xl font-black" style={{ color: theme.primary }}>Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl transition-colors"
              style={{ backgroundColor: theme.backgroundHover }}
            >
              <X className="size-7" style={{ color: theme.primary }} />
            </button>
          </div>

          {/* Middle: Scrollable Menu Items */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-4 py-8 px-6">
            <button
              onClick={() => { setActiveTab("overall"); setMobileMenuOpen(false); }}
              className="w-full max-w-sm px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "overall" ? theme.primaryGlow : theme.backgroundHover,
                color: activeTab === "overall" ? theme.primary : theme.textSecondary
              }}
            >
              {language === 'en' ? '🏠 County Overview' : '🏠 县区概览'}
            </button>
            <button
              onClick={() => { setActiveTab("school-details"); setMobileMenuOpen(false); }}
              className="w-full max-w-sm px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "school-details" ? theme.primaryGlow : theme.backgroundHover,
                color: activeTab === "school-details" ? theme.primary : theme.textSecondary
              }}
            >
              {language === 'en' ? '🔍 School Details' : '🔍 学校详情'}
            </button>
            <button
              onClick={() => { setActiveTab("compare"); setMobileMenuOpen(false); }}
              className="w-full max-w-sm px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "compare" ? theme.primaryGlow : theme.backgroundHover,
                color: activeTab === "compare" ? theme.primary : theme.textSecondary
              }}
            >
              {language === 'en' ? '⚖️ Compare' : '⚖️ 对比'}
            </button>
            <button
              onClick={() => { setActiveTab("rankings"); setMobileMenuOpen(false); }}
              className="w-full max-w-sm px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "rankings" ? theme.primaryGlow : theme.backgroundHover,
                color: activeTab === "rankings" ? theme.primary : theme.textSecondary
              }}
            >
              {language === 'en' ? '🏆 Rankings' : '🏆 排名'}
            </button>
            <button
              onClick={() => { setActiveTab("trends"); setMobileMenuOpen(false); }}
              className="w-full max-w-sm px-8 py-5 text-center font-black rounded-2xl transition-all text-xl"
              style={{
                backgroundColor: activeTab === "trends" ? theme.primaryGlow : theme.backgroundHover,
                color: activeTab === "trends" ? theme.primary : theme.textSecondary
              }}
            >
              {language === 'en' ? '📈 Trends' : '📈 趋势'}
            </button>
          </div>

          {/* Bottom: Optional Search or CTA Area */}
          <div className="px-6 pb-8 pt-4 border-t border-gray-200">
            <div className="text-center text-sm" style={{ color: '#6B7280' }}>
              {language === 'en' ? 'Swipe down to close' : '向下滑动关闭'}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-0 max-w-7xl mx-auto px-6 pb-8 min-h-screen pt-[180px]" style={{ backgroundColor: theme.background }}>
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
            {/* County Overall Tab */}
            <TabsContent value="overall" className="space-y-6">
              <Dashboard
                schools={schools}
                onSelectSchool={handleSelectSchoolFromDashboard}
                language={language}
              />
            </TabsContent>

            {/* School Details Tab */}
            <TabsContent value="school-details" className={selectedSchool ? "space-y-6" : "flex items-center justify-center min-h-[calc(100vh-250px)] mt-10"}>
              {selectedSchool ? (
                <>
                  {/* Top: School Header Card */}
                  <OverviewCard school={selectedSchool} language={language} />

              {/* HIGHLIGHTED SECTION: Radar Chart + Asian Families */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Professional Radar Chart */}
                <RadarChartPro school={selectedSchool} language={language} />

                {/* Asian Families Spotlight */}
                <AsianFamiliesSpotlight school={selectedSchool} language={language} />
              </div>

              {/* Why Score Changed - Core Differentiator */}
              <WhyScoreChanged school={selectedSchool} language={language} />

              {/* TWO-COLUMN LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN (2/3 width) - Main Indicators */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Math & ELA Cards */}
                  <AcademicSnapshot school={selectedSchool} language={language} />

                  {/* Attendance */}
                  <AttendanceSafety school={selectedSchool} language={language} />

                  {/* Demographics Summary - Horizontal Bars */}
                  <DemographicsBarChart school={selectedSchool} language={language} />
                </div>

                {/* RIGHT COLUMN (1/3 width) - Details & Supplementary */}
                <div className="space-y-6">
                  {/* School Details Card */}
                  <div className="rounded-xl p-6 border shadow-sm" style={{ backgroundColor: theme.backgroundElevated, borderColor: theme.border }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text }}>
                      {language === 'en' ? 'School Details' : '学校详情'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.info + '1A' }}>
                        <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                          {language === 'en' ? 'Student-Teacher Ratio' : '师生比'}
                        </div>
                        <div className="text-xl font-bold" style={{ color: theme.info }}>
                          1:{selectedSchool.studentTeacherRatio}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.success + '1A' }}>
                        <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                          {language === 'en' ? 'Total Enrollment' : '总入学人数'}
                        </div>
                        <div className="text-xl font-bold" style={{ color: theme.success }}>
                          {selectedSchool.enrollment}
                        </div>
                        <div className="text-xs" style={{ color: theme.textMuted }}>
                          {language === 'en' ? 'students' : '学生'}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.backgroundHover }}>
                        <div className="text-xs mb-1" style={{ color: theme.textSecondary }}>
                          {language === 'en' ? 'District' : '学区'}
                        </div>
                        <div className="text-sm font-medium" style={{ color: theme.text }}>
                          {selectedSchool.district}
                        </div>
                      </div>
                      <div className="text-center p-3 rounded-lg" style={{ backgroundColor: theme.warning + '1A' }}>
                        <div className="text-xs mb-1 flex items-center justify-center gap-1" style={{ color: theme.textSecondary }}>
                          <span>{language === 'en' ? 'Grade Span' : '年级范围'}</span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="inline-flex items-center">
                                <Info className="size-3.5 opacity-60 hover:opacity-100 transition-opacity" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="max-w-xs p-3"
                              style={{
                                backgroundColor: theme.backgroundElevated,
                                color: theme.text,
                                border: `1px solid ${theme.border}`,
                                boxShadow: `0px 4px 12px ${theme.shadow}`
                              }}
                            >
                              {language === 'en' ? (
                                <div className="space-y-1.5 text-xs">
                                  <p className="font-semibold">US School System:</p>
                                  <p><strong>Elementary:</strong> K-5 (ages 5-11)</p>
                                  <p><strong>Middle School:</strong> 6-8 (ages 11-14)</p>
                                  <p><strong>High School:</strong> 9-12 (ages 14-18)</p>
                                  <p className="text-[10px] opacity-70 mt-2">K = Kindergarten</p>
                                </div>
                              ) : (
                                <div className="space-y-1.5 text-xs">
                                  <p className="font-semibold">美国学校系统：</p>
                                  <p><strong>小学 Elementary:</strong> K-5 (5-11岁)</p>
                                  <p><strong>初中 Middle:</strong> 6-8 (11-14岁)</p>
                                  <p><strong>高中 High:</strong> 9-12 (14-18岁)</p>
                                  <p className="text-[10px] opacity-70 mt-2">K = 幼儿园 Kindergarten</p>
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="text-sm font-medium" style={{ color: theme.text }}>
                          {selectedSchool.gradeSpan || "K-12"}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
                </>
              ) : (
                <BerryEmptyState language={language} variant="school-details" />
              )}
            </TabsContent>

            {/* Compare Tab */}
            <TabsContent value="compare">
              <CompareSchools
                schools={schools}
                defaultSchool={selectedSchool}
                language={language}
              />
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings">
              <RankingControls
                quickFind={quickFind}
                onQuickFindChange={setQuickFind}
                sortBy={sortBy}
                onSortChange={setSortBy}
                groupBy={groupBy}
                onGroupByChange={setGroupBy}
                activeFilters={activeFilters}
                onFilterToggle={(filterId) => {
                  const newFilters = new Set(activeFilters);
                  if (newFilters.has(filterId)) {
                    newFilters.delete(filterId);
                  } else {
                    newFilters.add(filterId);
                  }
                  setActiveFilters(newFilters);
                }}
                onClearFilters={() => setActiveFilters(new Set())}
                language={language}
              />
              <EnhancedSchoolRankingList
                schools={schools}
                activeFilters={activeFilters}
                quickFind={quickFind}
                sortBy={sortBy}
                groupBy={groupBy}
                language={language}
              />
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="flex items-center justify-center min-h-[calc(100vh-250px)]">
              {selectedSchool ? (
                <EnhancedTrendsInsights
                  school={selectedSchool}
                  language={language}
                  onReset={() => setSelectedSchool(null)}
                />
              ) : (
                <BerryEmptyState language={language} variant="trends" />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}