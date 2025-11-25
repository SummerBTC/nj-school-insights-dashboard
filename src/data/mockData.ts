import type { School } from "../types/school";

export const mockSchools: School[] = [
  {
    id: "1",
    name: "Jefferson Elementary",
    type: "Public",
    grades: "K-5",
    county: "Bergen County",
    district: "Westwood Regional",
    address: "123 School St, Westwood, NJ",
    zipCode: "07675",
    mathProficiency: 78,
    elaProficiency: 74,
    chronicAbsenteeism: 6,
    studentTeacherRatio: 14,
    giftedProgram: true,
    enrollment: 450,
    demographics: {
      asian: 35,
      white: 45,
      hispanic: 12,
      black: 5,
      other: 3
    },
    performanceByDemographic: {
      asian: { math: 89, ela: 85 },
      white: { math: 82, ela: 78 },
      hispanic: { math: 65, ela: 62 },
      black: { math: 58, ela: 60 }
    },
    schoolClimate: "Safe",
    bullyingReports: "Low",
    trends: {
      mathChange: 3,
      elaChange: -1,
      absenteeismChange: 1,
      enrollmentChange: 5
    },
    overallScore: 87,
    description: "High math performance, safe environment, stable staffing."
  },
  {
    id: "2",
    name: "Lincoln Middle School",
    type: "Public",
    grades: "6-8",
    county: "Bergen County",
    district: "Ridgewood Public Schools",
    address: "456 Main Ave, Ridgewood, NJ",
    zipCode: "07450",
    mathProficiency: 84,
    elaProficiency: 81,
    chronicAbsenteeism: 4,
    studentTeacherRatio: 13,
    giftedProgram: true,
    enrollment: 620,
    demographics: {
      asian: 42,
      white: 48,
      hispanic: 6,
      black: 3,
      other: 1
    },
    performanceByDemographic: {
      asian: { math: 92, ela: 88 },
      white: { math: 86, ela: 83 },
      hispanic: { math: 72, ela: 70 },
      black: { math: 68, ela: 65 }
    },
    schoolClimate: "Safe",
    bullyingReports: "Low",
    trends: {
      mathChange: 5,
      elaChange: 3,
      absenteeismChange: -1,
      enrollmentChange: 8
    },
    overallScore: 92,
    description: "Excellent math program, strong gifted education, top-tier performance."
  },
  {
    id: "3",
    name: "Washington High School",
    type: "Public",
    grades: "9-12",
    county: "Morris County",
    district: "Morris School District",
    address: "789 Oak Rd, Morristown, NJ",
    zipCode: "07960",
    mathProficiency: 72,
    elaProficiency: 76,
    chronicAbsenteeism: 8,
    studentTeacherRatio: 16,
    giftedProgram: false,
    enrollment: 1200,
    demographics: {
      asian: 28,
      white: 52,
      hispanic: 14,
      black: 4,
      other: 2
    },
    performanceByDemographic: {
      asian: { math: 85, ela: 82 },
      white: { math: 75, ela: 78 },
      hispanic: { math: 60, ela: 65 },
      black: { math: 55, ela: 62 }
    },
    schoolClimate: "Safe",
    bullyingReports: "Medium",
    trends: {
      mathChange: -2,
      elaChange: 1,
      absenteeismChange: 2,
      enrollmentChange: -3
    },
    overallScore: 78,
    description: "Solid ELA performance, increasing absenteeism requires attention."
  },
  {
    id: "4",
    name: "Roosevelt Elementary",
    type: "Public",
    grades: "K-5",
    county: "Essex County",
    district: "Montclair Public Schools",
    address: "321 Pine St, Montclair, NJ",
    zipCode: "07042",
    mathProficiency: 68,
    elaProficiency: 71,
    chronicAbsenteeism: 11,
    studentTeacherRatio: 15,
    giftedProgram: true,
    enrollment: 380,
    demographics: {
      asian: 18,
      white: 38,
      hispanic: 22,
      black: 20,
      other: 2
    },
    performanceByDemographic: {
      asian: { math: 82, ela: 79 },
      white: { math: 74, ela: 76 },
      hispanic: { math: 58, ela: 62 },
      black: { math: 54, ela: 60 }
    },
    schoolClimate: "Moderate",
    bullyingReports: "Medium",
    trends: {
      mathChange: -4,
      elaChange: -2,
      absenteeismChange: 3,
      enrollmentChange: -8
    },
    overallScore: 68,
    description: "Declining performance, high absenteeism, equity gaps need addressing."
  },
  {
    id: "5",
    name: "Kennedy STEM Academy",
    type: "Charter",
    grades: "K-8",
    county: "Hudson County",
    district: "Jersey City Charter",
    address: "555 Science Blvd, Jersey City, NJ",
    zipCode: "07302",
    mathProficiency: 87,
    elaProficiency: 79,
    chronicAbsenteeism: 5,
    studentTeacherRatio: 12,
    giftedProgram: true,
    enrollment: 520,
    demographics: {
      asian: 48,
      white: 22,
      hispanic: 18,
      black: 10,
      other: 2
    },
    performanceByDemographic: {
      asian: { math: 94, ela: 88 },
      white: { math: 88, ela: 82 },
      hispanic: { math: 78, ela: 70 },
      black: { math: 72, ela: 68 }
    },
    schoolClimate: "Safe",
    bullyingReports: "Low",
    trends: {
      mathChange: 6,
      elaChange: 4,
      absenteeismChange: -2,
      enrollmentChange: 12
    },
    overallScore: 91,
    description: "Outstanding STEM focus, excellent math performance, growing enrollment."
  },
  {
    id: "6",
    name: "Madison Elementary",
    type: "Public",
    grades: "K-5",
    county: "Bergen County",
    district: "Tenafly Public Schools",
    address: "888 Maple Ave, Tenafly, NJ",
    zipCode: "07670",
    mathProficiency: 81,
    elaProficiency: 83,
    chronicAbsenteeism: 3,
    studentTeacherRatio: 13,
    giftedProgram: true,
    enrollment: 410,
    demographics: {
      asian: 52,
      white: 38,
      hispanic: 5,
      black: 3,
      other: 2
    },
    performanceByDemographic: {
      asian: { math: 91, ela: 89 },
      white: { math: 84, ela: 86 },
      hispanic: { math: 70, ela: 72 },
      black: { math: 65, ela: 68 }
    },
    schoolClimate: "Safe",
    bullyingReports: "Low",
    trends: {
      mathChange: 4,
      elaChange: 5,
      absenteeismChange: -1,
      enrollmentChange: 6
    },
    overallScore: 93,
    description: "Top-performing school, strong across all metrics, excellent attendance."
  }
];
