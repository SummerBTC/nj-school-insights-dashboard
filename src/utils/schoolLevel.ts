// Helper functions to categorize school levels based on grade span

export type SchoolLevel = "Elementary" | "Middle" | "High" | "Other";

/**
 * Parse grade span string and extract start/end grades
 * Examples: "PK-05", "K-8", "09-12", "04-08"
 */
function parseGradeSpan(gradeSpan: string): { start: number; end: number } | null {
  if (!gradeSpan) return null;

  // Clean up the string
  const cleaned = gradeSpan.toUpperCase().trim();

  // Handle PK (Pre-K) as grade -1
  // Handle K (Kindergarten) as grade 0
  const gradeMap: { [key: string]: number } = {
    PK: -1,
    K: 0,
  };

  // Split by common delimiters: -, to, –, —
  const parts = cleaned.split(/[-–—]|TO/).map((p) => p.trim());

  if (parts.length !== 2) return null;

  // Parse start grade
  let start: number;
  if (parts[0] in gradeMap) {
    start = gradeMap[parts[0]];
  } else {
    start = parseInt(parts[0], 10);
    if (isNaN(start)) return null;
  }

  // Parse end grade
  let end: number;
  if (parts[1] in gradeMap) {
    end = gradeMap[parts[1]];
  } else {
    end = parseInt(parts[1], 10);
    if (isNaN(end)) return null;
  }

  return { start, end };
}

/**
 * Categorize school level based on grade span
 * Rules:
 * - Elementary: end grade ≤ 5
 * - Middle: end grade ≤ 8 (and not Elementary)
 * - High: start grade ≥ 9
 * - Other: everything else (e.g., K-12, PK-12)
 */
export function getSchoolLevel(gradeSpan: string): SchoolLevel {
  const parsed = parseGradeSpan(gradeSpan);

  if (!parsed) return "Other";

  const { start, end } = parsed;

  // High school: starts at grade 9 or later
  if (start >= 9) return "High";

  // Elementary: ends at grade 5 or earlier
  if (end <= 5) return "Elementary";

  // Middle: ends at grade 8 or earlier (and not Elementary)
  if (end <= 8) return "Middle";

  // Everything else (e.g., K-12, PK-12)
  return "Other";
}

/**
 * Check if two schools are at the same level
 */
export function areSameLevel(gradeSpan1: string, gradeSpan2: string): boolean {
  const level1 = getSchoolLevel(gradeSpan1);
  const level2 = getSchoolLevel(gradeSpan2);
  return level1 === level2;
}

/**
 * Get a human-readable label for the school level
 */
export function getSchoolLevelLabel(gradeSpan: string): string {
  const level = getSchoolLevel(gradeSpan);
  const labels: { [key in SchoolLevel]: string } = {
    Elementary: "Elementary School",
    Middle: "Middle School",
    High: "High School",
    Other: "Multi-Level School",
  };
  return labels[level];
}
