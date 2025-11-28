import { SchoolResultCard } from "./SchoolResultCard";
import type { School } from "../types/school";

interface MobileSearchResultsProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
}

export function MobileSearchResults({ schools, onSelectSchool }: MobileSearchResultsProps) {
  // Sort schools by overall score descending
  const sortedSchools = [...schools].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <main className="md:hidden pt-[132px] pb-6 bg-[#fffafc] min-h-screen">
      <div className="px-4 space-y-3">
        {/* Results count */}
        <div className="text-sm text-gray-600 px-2">
          <span className="font-semibold">{schools.length}</span> schools found
        </div>

        {/* School cards list */}
        {sortedSchools.map((school) => (
          <SchoolResultCard
            key={school.id}
            school={school}
            onSelect={onSelectSchool}
          />
        ))}

        {/* Empty state */}
        {schools.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-sm">
              No schools found. Try adjusting your filters.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
