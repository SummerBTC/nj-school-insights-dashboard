import { useState, useRef, useEffect } from "react";
import { Search, Clock } from "lucide-react";
import { Input } from "./ui/input";
import type { School } from "../types/school";
import { useTheme } from "../theme/ThemeContext";

interface SearchBarProps {
  schools: School[];
  onSelectSchool: (school: School) => void;
  selectedSchool: School;
  language: 'en' | 'zh';
}

export function SearchBar({ schools, onSelectSchool, selectedSchool, language }: SearchBarProps) {
  const { theme } = useTheme();
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
        <Search className="absolute top-1/2 -translate-y-1/2 size-6" style={{ color: theme.primary, left: '24px' }} />
        <Input
          type="text"
          placeholder={language === 'en' ? 'Search by school name, district, or zip code...' : '按学校名称、学区或邮编搜索...'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pr-6 text-lg border-2 transition-all font-medium"
          style={{
            backgroundColor: theme.backgroundElevated,
            borderColor: theme.primary,
            color: theme.text,
            borderRadius: '16px',
            paddingLeft: '60px',
            height: '60px',
          }}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl shadow-xl max-h-[320px] overflow-y-auto" style={{ backgroundColor: theme.backgroundElevated, zIndex: 50, boxShadow: `0 10px 40px ${theme.shadowStrong}` }}>
          {query === "" && recentSearches.length > 0 && (
            <div className="p-3 border-b" style={{ borderColor: theme.border }}>
              <div className="flex items-center gap-2 text-sm mb-2" style={{ color: theme.textSecondary }}>
                <Clock className="size-4" />
                <span>{language === 'en' ? 'Recent Searches' : '最近搜索'}</span>
              </div>
              {recentSearches.map((school) => (
                <button
                  key={school.id}
                  onClick={() => handleSelectSchool(school)}
                  className="w-full text-left px-3 py-2 rounded flex items-center justify-between group"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.backgroundHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div>
                    <div style={{ color: theme.text }}>{school.name}</div>
                    <div className="text-sm" style={{ color: theme.textSecondary }}>{school.district} • {school.county}</div>
                  </div>
                  <span className="text-xs opacity-0 group-hover:opacity-100" style={{ color: theme.primary }}>Select</span>
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
                    className="w-full text-left px-3 py-3 rounded flex items-center justify-between group"
                    style={{ backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.backgroundHover}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2" style={{ color: theme.text }}>
                        {school.name}
                        <span className="text-xs" style={{ color: theme.textSecondary }}>• {school.grades}</span>
                      </div>
                      <div className="text-sm" style={{ color: theme.textSecondary }}>
                        {school.district} • {school.county} • {school.zipCode}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm" style={{ color: theme.primary }}>Score: {school.overallScore}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center" style={{ color: theme.textSecondary }}>
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