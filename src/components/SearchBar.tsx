import { useState, useRef, useEffect } from "react";
import { Search, Clock } from "lucide-react";
import { Input } from "./ui/input";
import type { School } from "../types/school";

interface SearchBarProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  selectedSchool: School;
}

export function SearchBar({ schools, onSelectSchool, selectedSchool }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<School[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSchools = schools.filter((school) => {
    const searchTerm = query.toLowerCase();
    return (
      school.name.toLowerCase().includes(searchTerm) ||
      school.district.toLowerCase().includes(searchTerm) ||
      school.zipCode.includes(searchTerm) ||
      school.county.toLowerCase().includes(searchTerm)
    );
  });

  const handleSelectSchool = (school: School) => {
    onSelectSchool(school);
    setQuery("");
    setIsOpen(false);
    
    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.id !== school.id);
      return [school, ...filtered].slice(0, 3);
    });
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute top-1/2 -translate-y-1/2 size-5" style={{ color: '#FF5B85', left: '20px' }} />
        <Input
          type="text"
          placeholder="Search by school name, district, or zip code..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-4 py-3 text-base border-2 transition-all"
          style={{
            backgroundColor: '#FFFFFF',
            borderColor: '#FF5B85',
            color: '#2E2E2E',
            borderRadius: '12px',
            paddingLeft: '48px',
          }}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-[#E5E7EB] rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {query === "" && recentSearches.length > 0 && (
            <div className="p-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 text-[#6B7280] text-sm mb-2">
                <Clock className="size-4" />
                <span>Recent Searches</span>
              </div>
              {recentSearches.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelectSchool(school)}
                  className="w-full text-left px-3 py-2 hover:bg-[#F9FAFB] rounded flex items-center justify-between group"
                >
                  <div>
                    <div className="text-[#374151]">{school.name}</div>
                    <div className="text-sm text-[#6B7280]">{school.district} • {school.county}</div>
                  </div>
                  <span className="text-xs text-[#3B82F6] opacity-0 group-hover:opacity-100">Select</span>
                </button>
              ))}
            </div>
          )}

          {query !== "" && (
            <div className="p-2">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => handleSelectSchool(school)}
                    className="w-full text-left px-3 py-3 hover:bg-[#F9FAFB] rounded flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <div className="text-[#374151] flex items-center gap-2">
                        {school.name}
                        <span className="text-xs text-[#6B7280]">• {school.grades}</span>
                      </div>
                      <div className="text-sm text-[#6B7280]">
                        {school.district} • {school.county} • {school.zipCode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#3B82F6]">Score: {school.overallScore}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-[#6B7280]">
                  No schools found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}