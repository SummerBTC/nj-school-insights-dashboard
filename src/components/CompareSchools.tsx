import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { School } from "../types/school";
import { areSameLevel, getSchoolLevelLabel } from "../utils/schoolLevel";

interface CompareSchoolsProps {
  schools: School[];
  defaultSchool: School;
  language: 'en' | 'zh';
}

export function CompareSchools({ schools, defaultSchool, language }: CompareSchoolsProps) {
  const [school1, setSchool1] = useState<School>(defaultSchool);
  const [school2, setSchool2] = useState<School>(schools.find(s => s.id !== defaultSchool.id) || schools[1]);
  const [onlySimilarSchools, setOnlySimilarSchools] = useState<boolean>(true);

  // Filter schools for School 2 dropdown based on toggle
  const availableSchools = useMemo(() => {
    if (!onlySimilarSchools) {
      return schools;
    }

    // Filter to only show schools at the same level as School 1
    return schools.filter(school =>
      areSameLevel(school1.gradeSpan || school1.grades, school.gradeSpan || school.grades)
    );
  }, [schools, school1, onlySimilarSchools]);

  // Auto-update school2 if current selection is filtered out
  useMemo(() => {
    if (onlySimilarSchools && !availableSchools.find(s => s.id === school2.id)) {
      const newSchool2 = availableSchools.find(s => s.id !== school1.id);
      if (newSchool2) {
        setSchool2(newSchool2);
      }
    }
  }, [availableSchools, onlySimilarSchools, school1.id, school2.id]);

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

  const radarData = [
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
  ];

  const getDifference = (val1: number, val2: number) => {
    const diff = val1 - val2;
    return { diff, isPositive: diff > 0, isNeutral: diff === 0 };
  };

  const DifferenceIndicator = ({ val1, val2 }: { val1: number; val2: number }) => {
    const { diff, isPositive, isNeutral } = getDifference(val1, val2);

    if (isNeutral) {
      return (
        <div className="flex items-center gap-1 text-[#6B7280]">
          <Minus className="size-4" />
          <span className="text-sm">{language === 'en' ? 'Equal' : '相同'}</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
        {isPositive ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
        <span className="text-sm">{Math.abs(diff).toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Toggle */}
      <div className="bg-white rounded-lg p-4 border border-[#E5E7EB] flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-[#374151]">
            {language === 'en' ? 'Only show similar schools' : '仅显示相似学校'}
          </div>
          <div className="text-xs text-[#6B7280] mt-1">
            {onlySimilarSchools
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

      {/* School Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="bg-white rounded-lg p-4 border-2 border-[#3B82F6]">
          <label className="text-sm text-[#6B7280] mb-2 block">
            {language === 'en' ? 'School 1' : '学校 1'}
          </label>
          <Select value={school1.id} onValueChange={(id) => setSchool1(schools.find(s => s.id === id)!)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id} disabled={school.id === school2.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="size-8 text-[#6B7280]" />
        </div>

        <div className="bg-white rounded-lg p-4 border-2 border-[#22C55E]">
          <label className="text-sm text-[#6B7280] mb-2 block">
            {language === 'en' ? 'School 2' : '学校 2'}
          </label>
          <Select value={school2.id} onValueChange={(id) => setSchool2(availableSchools.find(s => s.id === id)!)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableSchools.map((school) => (
                <SelectItem key={school.id} value={school.id} disabled={school.id === school1.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Radar Chart Comparison */}
      <div className="bg-white rounded-lg p-6 border border-[#E5E7EB]">
        <h3 className="mb-4 text-[#374151]">
          {language === 'en' ? 'Performance Overlay' : '表现对比图'}
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RechartsRadar data={radarData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#6B7280', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 10 }} />
            <Radar
              name={school1.name}
              dataKey={school1.name}
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name={school2.name}
              dataKey={school2.name}
              stroke="#22C55E"
              fill="#22C55E"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>

      {/* Detailed Comparison Table */}
      <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB]">
              <tr>
                <th className="px-6 py-4 text-left text-[#374151]">
                  {language === 'en' ? 'Metric' : '指标'}
                </th>
                <th className="px-6 py-4 text-center text-[#3B82F6]">{school1.name}</th>
                <th className="px-6 py-4 text-center text-[#6B7280]">
                  {language === 'en' ? 'Difference' : '差异'}
                </th>
                <th className="px-6 py-4 text-center text-[#22C55E]">{school2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'Overall Score' : '综合评分'}
                </td>
                <td className="px-6 py-4 text-center text-[#3B82F6]">{school1.overallScore}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.overallScore} val2={school2.overallScore} />
                </td>
                <td className="px-6 py-4 text-center text-[#22C55E]">{school2.overallScore}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'Math Proficiency' : '数学水平'}
                </td>
                <td className="px-6 py-4 text-center">{school1.mathProficiency}%</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.mathProficiency} val2={school2.mathProficiency} />
                </td>
                <td className="px-6 py-4 text-center">{school2.mathProficiency}%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'ELA Proficiency' : '英语水平'}
                </td>
                <td className="px-6 py-4 text-center">{school1.elaProficiency}%</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.elaProficiency} val2={school2.elaProficiency} />
                </td>
                <td className="px-6 py-4 text-center">{school2.elaProficiency}%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'Chronic Absenteeism' : '长期缺勤率'}
                </td>
                <td className="px-6 py-4 text-center">{school1.chronicAbsenteeism}%</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school2.chronicAbsenteeism} val2={school1.chronicAbsenteeism} />
                </td>
                <td className="px-6 py-4 text-center">{school2.chronicAbsenteeism}%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'Student-Teacher Ratio' : '师生比'}
                </td>
                <td className="px-6 py-4 text-center">1:{school1.studentTeacherRatio}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school2.studentTeacherRatio} val2={school1.studentTeacherRatio} />
                </td>
                <td className="px-6 py-4 text-center">1:{school2.studentTeacherRatio}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'Enrollment' : '入学人数'}
                </td>
                <td className="px-6 py-4 text-center">{school1.enrollment}</td>
                <td className="px-6 py-4 flex justify-center">
                  <DifferenceIndicator val1={school1.enrollment} val2={school2.enrollment} />
                </td>
                <td className="px-6 py-4 text-center">{school2.enrollment}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'Gifted Program' : '资优项目'}
                </td>
                <td className="px-6 py-4 text-center">{school1.giftedProgram ? "✓" : "✗"}</td>
                <td className="px-6 py-4 text-center text-[#6B7280]">-</td>
                <td className="px-6 py-4 text-center">{school2.giftedProgram ? "✓" : "✗"}</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-[#374151]">
                  {language === 'en' ? 'School Climate' : '学校氛围'}
                </td>
                <td className="px-6 py-4 text-center">{school1.schoolClimate}</td>
                <td className="px-6 py-4 text-center text-[#6B7280]">-</td>
                <td className="px-6 py-4 text-center">{school2.schoolClimate}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#EFF6FF] rounded-lg p-6 border border-[#3B82F6]/20">
          <h4 className="text-[#3B82F6] mb-3">
            {school1.name} {language === 'en' ? 'Strengths' : '优势'}
          </h4>
          <ul className="space-y-2 text-sm text-[#374151]">
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

        <div className="bg-[#F0FDF4] rounded-lg p-6 border border-[#22C55E]/20">
          <h4 className="text-[#22C55E] mb-3">
            {school2.name} {language === 'en' ? 'Strengths' : '优势'}
          </h4>
          <ul className="space-y-2 text-sm text-[#374151]">
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
    </div>
  );
}
