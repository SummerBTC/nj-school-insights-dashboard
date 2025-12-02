import { useState, useMemo } from "react";
import { Switch } from "./ui/switch";
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { ArrowRight, TrendingUp, TrendingDown, Minus, RotateCcw } from "lucide-react";
import type { School } from "../types/school";
import { areSameLevel, getSchoolLevelLabel } from "../utils/schoolLevel";
import { SchoolCombobox } from "./SchoolCombobox";
import { useTheme } from "../theme/ThemeContext";

interface CompareSchoolsProps {
  schools: School[];
  defaultSchool?: School | null;
  language: 'en' | 'zh';
}

export function CompareSchools({ schools, defaultSchool, language }: CompareSchoolsProps) {
  const { theme } = useTheme();
  const [school1, setSchool1] = useState<School | null>(defaultSchool || null);
  const [school2, setSchool2] = useState<School | null>(null);
  const [onlySimilarSchools, setOnlySimilarSchools] = useState<boolean>(true);

  // Filter schools for School 2 dropdown based on toggle
  const availableSchools = useMemo(() => {
    if (!onlySimilarSchools || !school1) {
      return schools;
    }

    // Filter to only show schools at the same level as School 1
    return schools.filter(school =>
      areSameLevel(school1.gradeSpan || school1.grades, school.gradeSpan || school.grades)
    );
  }, [schools, school1, onlySimilarSchools]);

  // Auto-update school2 if current selection is filtered out
  useMemo(() => {
    if (school1 && school2 && onlySimilarSchools && !availableSchools.find(s => s.id === school2.id)) {
      const newSchool2 = availableSchools.find(s => s.id !== school1.id);
      if (newSchool2) {
        setSchool2(newSchool2);
      }
    }
  }, [availableSchools, onlySimilarSchools, school1, school2]);

  const normalizeStudentTeacherRatio = (ratio: number) => {
    return Math.max(0, Math.min(100, ((25 - ratio) / 15) * 100));
  };

  const calculateEquityScore = (school: School) => {
    const performances = [
      school.performanceByDemographic.asian.math,
      school.performanceByDemographic.white.math,
      school.performanceByDemographic.hispanic.math,
      school.performanceByDemographic.black.math,
    ];
    const max = Math.max(...performances);
    const min = Math.min(...performances);
    const gap = max - min;
    return Math.max(0, 100 - gap);
  };

  const radarData = school1 && school2 ? [
    {
      metric: "Math",
      [school1.name]: school1.mathProficiency,
      [school2.name]: school2.mathProficiency,
    },
    {
      metric: "ELA",
      [school1.name]: school1.elaProficiency,
      [school2.name]: school2.elaProficiency,
    },
    {
      metric: "Attendance",
      [school1.name]: 100 - school1.chronicAbsenteeism,
      [school2.name]: 100 - school2.chronicAbsenteeism,
    },
    {
      metric: "Class Size",
      [school1.name]: normalizeStudentTeacherRatio(school1.studentTeacherRatio),
      [school2.name]: normalizeStudentTeacherRatio(school2.studentTeacherRatio),
    },
    {
      metric: "Equity",
      [school1.name]: calculateEquityScore(school1),
      [school2.name]: calculateEquityScore(school2),
    },
  ] : [];

  const getDifference = (val1: number, val2: number) => {
    const diff = val1 - val2;
    return { diff, isPositive: diff > 0, isNeutral: diff === 0 };
  };

  const DifferenceIndicator = ({ val1, val2 }: { val1: number; val2: number }) => {
    const { diff, isPositive, isNeutral } = getDifference(val1, val2);

    if (isNeutral) {
      return (
        <div className="flex items-center gap-1" style={{ color: theme.textSecondary }}>
          <Minus className="size-4" />
          <span className="text-sm">{language === 'en' ? 'Equal' : '相同'}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1" style={{ color: isPositive ? theme.success : theme.error }}>
        {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
        <span className="text-sm">{Math.abs(diff).toFixed(1)}</span>
      </div>
    );
  };

  const handleReset = () => {
    setSchool1(null);
    setSchool2(null);
    setOnlySimilarSchools(true);
  };

  return (
    <div className="space-y-6">
      {/* Filter Toggle with Reset Button */}
      <div className="flex gap-4 flex-wrap">
        <div className="rounded-lg p-4 flex items-center justify-between flex-1 min-w-[300px]" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
          <div>
            <div className="text-sm font-medium" style={{ color: theme.text }}>
              {language === 'en' ? 'Only show similar schools' : '仅显示相似学校'}
            </div>
            <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
              {onlySimilarSchools && school1
                ? language === 'en'
                  ? `Comparing ${getSchoolLevelLabel(school1.gradeSpan || school1.grades)} only (${availableSchools.length} schools)`
                  : `仅对比${getSchoolLevelLabel(school1.gradeSpan || school1.grades)} (${availableSchools.length}所学校)`
                : language === 'en'
                  ? `Showing all schools (${schools.length} schools)`
                  : `显示所有学校 (${schools.length}所)`
              }
            </div>
          </div>
          <Switch
            checked={onlySimilarSchools}
            onCheckedChange={setOnlySimilarSchools}
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-4 rounded-lg text-sm font-semibold transition-all hover:scale-105"
          style={{
            backgroundColor: theme.backgroundElevated,
            color: theme.textSecondary,
            border: `1px solid ${theme.border}`
          }}
        >
          <RotateCcw className="size-4" />
          {language === 'en' ? 'Reset' : '重置'}
        </button>
      </div>

      {/* School Selectors */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <div className="rounded-lg p-5 flex items-center gap-4 min-w-[320px]" style={{ backgroundColor: theme.backgroundElevated, border: `2px solid ${theme.info}` }}>
          <label className="text-lg font-bold whitespace-nowrap" style={{ color: theme.info }}>
            {language === 'en' ? 'School 1' : '学校 1'}
          </label>
          <SchoolCombobox
            schools={schools}
            value={school1?.id || ""}
            onValueChange={(id) => setSchool1(schools.find(s => s.id === id) || null)}
            disabledSchoolId={school2?.id}
            placeholder={language === 'en' ? 'Select school...' : '选择学校...'}
            searchPlaceholder={language === 'en' ? 'Search school...' : '搜索学校...'}
            emptyText={language === 'en' ? 'No school found.' : '未找到学校。'}
            className="text-base flex-1"
          />
        </div>

        <ArrowRight className="size-8 flex-shrink-0" style={{ color: theme.textSecondary }} />

        <div className="rounded-lg p-5 flex items-center gap-4 min-w-[320px]" style={{ backgroundColor: theme.backgroundElevated, border: `2px solid ${theme.success}` }}>
          <label className="text-lg font-bold whitespace-nowrap" style={{ color: theme.success }}>
            {language === 'en' ? 'School 2' : '学校 2'}
          </label>
          <SchoolCombobox
            schools={availableSchools}
            value={school2?.id || ""}
            onValueChange={(id) => setSchool2(availableSchools.find(s => s.id === id) || null)}
            disabledSchoolId={school1?.id}
            placeholder={language === 'en' ? 'Select school...' : '选择学校...'}
            searchPlaceholder={language === 'en' ? 'Search school...' : '搜索学校...'}
            emptyText={language === 'en' ? 'No school found.' : '未找到学校。'}
            className="text-base flex-1"
          />
        </div>
      </div>

      {/* Only show comparison content if both schools are selected */}
      {school1 && school2 && (
        <>
          {/* Radar Chart Comparison */}
          <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
            <h3 className="mb-4" style={{ color: theme.text }}>
              {language === 'en' ? 'Performance Overlay' : '表现对比图'}
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <RechartsRadar data={radarData}>
                <PolarGrid stroke={theme.border} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: theme.textSecondary, fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: theme.textSecondary, fontSize: 10 }} />
                <Radar
                  name={school1.name}
                  dataKey={school1.name}
                  stroke={theme.info}
                  fill={theme.info}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name={school2.name}
                  dataKey={school2.name}
                  stroke={theme.success}
                  fill={theme.success}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend />
              </RechartsRadar>
            </ResponsiveContainer>
          </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgroundHover, border: `1px solid ${theme.info}` }}>
          <h4 className="mb-3" style={{ color: theme.info }}>
            {school1.name} {language === 'en' ? 'Strengths' : '优势'}
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: theme.text }}>
            {school1.mathProficiency > school2.mathProficiency && (
              <li>
                • {language === 'en'
                  ? `Stronger math performance (+${(school1.mathProficiency - school2.mathProficiency).toFixed(1)}%)`
                  : `数学表现更强 (+${(school1.mathProficiency - school2.mathProficiency).toFixed(1)}%)`
                }
              </li>
            )}
            {school1.elaProficiency > school2.elaProficiency && (
              <li>
                • {language === 'en'
                  ? `Better ELA proficiency (+${(school1.elaProficiency - school2.elaProficiency).toFixed(1)}%)`
                  : `英语水平更高 (+${(school1.elaProficiency - school2.elaProficiency).toFixed(1)}%)`
                }
              </li>
            )}
            {school1.chronicAbsenteeism < school2.chronicAbsenteeism && (
              <li>
                • {language === 'en'
                  ? `Lower absenteeism (-${(school2.chronicAbsenteeism - school1.chronicAbsenteeism).toFixed(1)}%)`
                  : `缺勤率更低 (-${(school2.chronicAbsenteeism - school1.chronicAbsenteeism).toFixed(1)}%)`
                }
              </li>
            )}
            {school1.studentTeacherRatio < school2.studentTeacherRatio && (
              <li>
                • {language === 'en'
                  ? `Better student-teacher ratio (1:${school1.studentTeacherRatio} vs 1:${school2.studentTeacherRatio})`
                  : `师生比更优 (1:${school1.studentTeacherRatio} vs 1:${school2.studentTeacherRatio})`
                }
              </li>
            )}
            {school1.giftedProgram && !school2.giftedProgram && (
              <li>• {language === 'en' ? 'Offers gifted program' : '提供资优项目'}</li>
            )}
          </ul>
        </div>

        <div className="rounded-lg p-6" style={{ backgroundColor: theme.backgroundHover, border: `1px solid ${theme.success}` }}>
          <h4 className="mb-3" style={{ color: theme.success }}>
            {school2.name} {language === 'en' ? 'Strengths' : '优势'}
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: theme.text }}>
            {school2.mathProficiency > school1.mathProficiency && (
              <li>
                • {language === 'en'
                  ? `Stronger math performance (+${(school2.mathProficiency - school1.mathProficiency).toFixed(1)}%)`
                  : `数学表现更强 (+${(school2.mathProficiency - school1.mathProficiency).toFixed(1)}%)`
                }
              </li>
            )}
            {school2.elaProficiency > school1.elaProficiency && (
              <li>
                • {language === 'en'
                  ? `Better ELA proficiency (+${(school2.elaProficiency - school1.elaProficiency).toFixed(1)}%)`
                  : `英语水平更高 (+${(school2.elaProficiency - school1.elaProficiency).toFixed(1)}%)`
                }
              </li>
            )}
            {school2.chronicAbsenteeism < school1.chronicAbsenteeism && (
              <li>
                • {language === 'en'
                  ? `Lower absenteeism (-${(school1.chronicAbsenteeism - school2.chronicAbsenteeism).toFixed(1)}%)`
                  : `缺勤率更低 (-${(school1.chronicAbsenteeism - school2.chronicAbsenteeism).toFixed(1)}%)`
                }
              </li>
            )}
            {school2.studentTeacherRatio < school1.studentTeacherRatio && (
              <li>
                • {language === 'en'
                  ? `Better student-teacher ratio (1:${school2.studentTeacherRatio} vs 1:${school1.studentTeacherRatio})`
                  : `师生比更优 (1:${school2.studentTeacherRatio} vs 1:${school1.studentTeacherRatio})`
                }
              </li>
            )}
            {school2.giftedProgram && !school1.giftedProgram && (
              <li>• {language === 'en' ? 'Offers gifted program' : '提供资优项目'}</li>
            )}
          </ul>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="rounded-lg overflow-hidden" style={{ backgroundColor: theme.backgroundElevated, border: `1px solid ${theme.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ backgroundColor: theme.backgroundHover }}>
              <tr>
                <th className="px-6 py-4 text-left" style={{ color: theme.text }}>
                  {language === 'en' ? 'Metric' : '指标'}
                </th>
                <th className="px-6 py-4 text-center" style={{ color: theme.info }}>{school1.name}</th>
                <th className="px-6 py-4 text-center" style={{ color: theme.textSecondary }}>
                  {language === 'en' ? 'Difference' : '差异'}
                </th>
                <th className="px-6 py-4 text-center" style={{ color: theme.success }}>{school2.name}</th>
              </tr>
            </thead>
            <tbody style={{ borderColor: theme.border }} className="divide-y">
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'Overall Score' : '综合评分'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.info }}>{school1.overallScore}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.overallScore} val2={school2.overallScore} />
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.success }}>{school2.overallScore}</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'Math Proficiency' : '数学水平'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school1.mathProficiency}%</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.mathProficiency} val2={school2.mathProficiency} />
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school2.mathProficiency}%</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'ELA Proficiency' : '英语水平'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school1.elaProficiency}%</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.elaProficiency} val2={school2.elaProficiency} />
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school2.elaProficiency}%</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'Chronic Absenteeism' : '长期缺勤率'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school1.chronicAbsenteeism}%</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school2.chronicAbsenteeism} val2={school1.chronicAbsenteeism} />
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school2.chronicAbsenteeism}%</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'Student-Teacher Ratio' : '师生比'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>1:{school1.studentTeacherRatio}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school2.studentTeacherRatio} val2={school1.studentTeacherRatio} />
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>1:{school2.studentTeacherRatio}</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'Enrollment' : '入学人数'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school1.enrollment}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.enrollment} val2={school2.enrollment} />
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school2.enrollment}</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'Gifted Program' : '资优项目'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school1.giftedProgram ? "✓" : "✗"}</td>
                <td className="px-6 py-4 text-center" style={{ color: theme.textSecondary }}>-</td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school2.giftedProgram ? "✓" : "✗"}</td>
              </tr>
              <tr>
                <td style={{ color: theme.text }} className="px-6 py-4">
                  {language === 'en' ? 'School Climate' : '学校氛围'}
                </td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school1.schoolClimate}</td>
                <td className="px-6 py-4 text-center" style={{ color: theme.textSecondary }}>-</td>
                <td className="px-6 py-4 text-center" style={{ color: theme.text }}>{school2.schoolClimate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
