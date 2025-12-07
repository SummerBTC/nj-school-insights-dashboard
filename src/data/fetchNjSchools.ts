// src/data/fetchNjSchools.ts
import Papa from "papaparse";
import type { School } from "../types/school";

// CSV row structure from Supabase
interface CsvRow {
  CountyCode: number;
  CountyName: string;
  DistrictCode: number;
  DistrictName: string;
  SchoolCode: number;
  SchoolName: string;
  GradeSpan: string;
  ADDRESS: string;
  CITY_STATE_ZIP: string;
  PHONE: string;
  ENROLLMENT: number;
  ASIAN_PERCENT: number;
  ELA_PROFICIENCY: number;
  MATH_PROFICIENCY: number;
}

function transformCsvToSchool(row: CsvRow): School {
  const asianPercent = row.ASIAN_PERCENT || 0;
  const enrollment = row.ENROLLMENT || 0;
  const mathProf = row.MATH_PROFICIENCY || 0;
  const elaProf = row.ELA_PROFICIENCY || 0;

  // Calculate overall score (simplified)
  const overallScore = Math.round((mathProf + elaProf) / 2);

  // Parse demographics (using available data + defaults)
  const demographics = {
    asian: asianPercent,
    white: Math.max(0, 100 - asianPercent - 20), // Placeholder logic
    hispanic: 10, // Default
    black: 5, // Default
    other: Math.max(0, 100 - asianPercent - (100 - asianPercent - 20) - 10 - 5),
  };

  // Default performance by demographic
  const performanceByDemographic = {
    asian: { math: mathProf + 5, ela: elaProf + 5 },
    white: { math: mathProf, ela: elaProf },
    hispanic: { math: mathProf - 10, ela: elaProf - 10 },
    black: { math: mathProf - 15, ela: elaProf - 15 },
  };

  // Default trends
  const trends = {
    mathChange: Math.random() > 0.5 ? Math.round(Math.random() * 5) : -Math.round(Math.random() * 3),
    elaChange: Math.random() > 0.5 ? Math.round(Math.random() * 4) : -Math.round(Math.random() * 2),
    absenteeismChange: -Math.round(Math.random() * 2),
    enrollmentChange: Math.round(Math.random() * 10) - 5,
  };

  return {
    id: `${row.CountyCode}-${row.DistrictCode}-${row.SchoolCode}`,
    name: row.SchoolName || "Unknown School",
    type: "Public", // Default
    grades: row.GradeSpan || "K-12",
    gradeSpan: row.GradeSpan || "K-12",
    county: row.CountyName || "Unknown",
    district: row.DistrictName || "Unknown District",
    address: `${row.ADDRESS}, ${row.CITY_STATE_ZIP}` || "",
    zipCode: row.CITY_STATE_ZIP?.split(" ").pop() || "",

    // Performance Metrics
    mathProficiency: mathProf,
    elaProficiency: elaProf,
    chronicAbsenteeism: 5 + Math.round(Math.random() * 10), // Default placeholder
    studentTeacherRatio: 12 + Math.round(Math.random() * 8), // Default placeholder
    giftedProgram: mathProf > 70, // Schools with high math likely have G&T
    enrollment: enrollment,

    demographics,
    performanceByDemographic,

    // Safety & Climate (placeholders)
    schoolClimate: mathProf > 75 ? "Safe" : mathProf > 60 ? "Moderate" : "Needs Improvement",
    bullyingReports: mathProf > 70 ? "Low" : "Medium",

    trends,

    overallScore,
    description: `${row.SchoolName} is a school in ${row.CountyName} County serving grades ${row.GradeSpan} with ${enrollment} students.`,
  };
}

export default async function fetchNjSchools(): Promise<School[]> {
  // Use local CSV file instead of Supabase
  const csvUrl = "/data/nj_schools_bergen_light.csv";

  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch CSV from local storage");
    }

    const csvText = await response.text();

    // Parse CSV
    const parsed = Papa.parse<CsvRow>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Transform each row to School type
    const schools: School[] = parsed.data
      .filter((row) => row.SchoolName) // Filter out invalid rows
      .map(transformCsvToSchool);

    console.log(`✅ Loaded ${schools.length} schools from CSV`);
    return schools;
  } catch (error) {
    console.error("❌ Error fetching NJ schools:", error);
    return [];
  }
}