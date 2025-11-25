export interface School {
  id: string;
  name: string;
  type: "Public" | "Charter" | "Private";
  grades: string;
  county: string;
  district: string;
  address: string;
  zipCode: string;
  
  // Performance Metrics
  mathProficiency: number;
  elaProficiency: number;
  chronicAbsenteeism: number;
  studentTeacherRatio: number;
  giftedProgram: boolean;
  enrollment: number;
  
  // Demographics
  demographics: {
    asian: number;
    white: number;
    hispanic: number;
    black: number;
    other: number;
  };
  
  // Performance by Demographics
  performanceByDemographic: {
    asian: { math: number; ela: number };
    white: { math: number; ela: number };
    hispanic: { math: number; ela: number };
    black: { math: number; ela: number };
  };
  
  // Safety & Climate
  schoolClimate: "Safe" | "Moderate" | "Needs Improvement";
  bullyingReports: "Low" | "Medium" | "High";
  
  // Trend Data (3-year)
  trends: {
    mathChange: number; // percentage point change
    elaChange: number;
    absenteeismChange: number;
    enrollmentChange: number;
  };
  
  // Calculated Score
  overallScore: number;
  description: string;
}

export interface FilterOptions {
  giftedProgram: boolean;
  lowAbsentee: boolean;
  highMath: boolean;
  highAsianPerformance: boolean;
}
