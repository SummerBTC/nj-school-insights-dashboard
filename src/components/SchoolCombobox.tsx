import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "./ui/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import type { School } from "../types/school";
import { useTheme } from "../theme/ThemeContext";

interface SchoolComboboxProps {
  schools: School[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  disabledSchoolId?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
}

export function SchoolCombobox({
  schools,
  value,
  onValueChange,
  disabled = false,
  disabledSchoolId,
  placeholder = "Select school...",
  searchPlaceholder = "Search school...",
  emptyText = "No school found.",
  className,
}: SchoolComboboxProps) {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const selectedSchool = schools.find((school) => school.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            className
          )}
          disabled={disabled}
          style={{
            backgroundColor: theme.backgroundElevated,
            borderColor: theme.border,
            color: value ? theme.text : theme.textSecondary
          }}
        >
          <span className="truncate">
            {selectedSchool ? selectedSchool.name : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" style={{ color: theme.textSecondary, opacity: 0.7 }} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
        style={{
          backgroundColor: theme.backgroundElevated,
          borderColor: theme.border,
          color: theme.text
        }}
      >
        <Command style={{ backgroundColor: theme.backgroundElevated, color: theme.text }}>
          <CommandInput
            placeholder={searchPlaceholder}
            style={{ color: theme.text }}
          />
          <CommandList>
            <CommandEmpty style={{ color: theme.textSecondary }}>{emptyText}</CommandEmpty>
            <CommandGroup>
              {schools.map((school) => {
                const isDisabled = school.id === disabledSchoolId;
                return (
                  <CommandItem
                    key={school.id}
                    value={`${school.id}-${school.name}`}
                    keywords={[school.name, school.id]}
                    onSelect={() => {
                      if (!isDisabled) {
                        onValueChange(school.id);
                        setOpen(false);
                      }
                    }}
                    disabled={isDisabled}
                    className="cursor-pointer"
                    style={{
                      color: isDisabled ? theme.textMuted : theme.text,
                      opacity: isDisabled ? 0.5 : 1
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === school.id ? "opacity-100" : "opacity-0"
                      )}
                      style={{ color: theme.primary }}
                    />
                    <span className="flex-1 truncate">{school.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
