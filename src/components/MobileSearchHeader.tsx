import { Search } from "lucide-react";
import type { School } from "../types/school";

interface MobileSearchHeaderProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  selectedSchool: School | null;
}

export function MobileSearchHeader({ schools, onSelectSchool, selectedSchool }: MobileSearchHeaderProps) {
  return (
    <div className="md:hidden sticky top-11 z-40 bg-[#fff8fb] pb-2 shadow-sm">
      <div className="px-4 pt-3">
        {/* Airbnb-style tall pill search bar */}
        <div className="w-full rounded-full bg-white shadow-md border border-pink-100 flex items-center gap-3 px-5 h-14">
          <Search className="size-5 text-pink-400 flex-shrink-0" />
          <input
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-pink-300"
            placeholder="Search by school, district, or zip code…"
            type="text"
          />
        </div>
      </div>

      {/* Filter chips row - scrollable horizontally */}
      <div className="px-4 pt-2 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
        <button className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-xs whitespace-nowrap hover:bg-pink-50 transition-colors">
          📍 Bergen County
        </button>
        <button className="px-3 py-1.5 rounded-full bg-white border border-pink-100 text-xs whitespace-nowrap hover:bg-pink-50 transition-colors">
          🏫 Public
        </button>
        <button className="px-3 py-1.5 rounded-full bg-white border border-pink-100 text-xs whitespace-nowrap hover:bg-pink-50 transition-colors">
          ⭐ Gifted
        </button>
        <button className="px-3 py-1.5 rounded-full bg-white border border-pink-100 text-xs whitespace-nowrap hover:bg-pink-50 transition-colors">
          🎯 High Score
        </button>
      </div>
    </div>
  );
}
