
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";

interface DatePickerWithPresetsProps {
  date: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onDateRangeChange: (range: string) => void;
  dateRange: string;
  className?: string;
  align?: "start" | "center" | "end";
  isMobile?: boolean;
}

export function DatePickerWithPresets({
  date,
  onCustomDateChange,
  onDateRangeChange,
  dateRange,
  className,
  align = "start",
  isMobile = false,
}: DatePickerWithPresetsProps) {
  const [open, setOpen] = useState(false);
  const [isCustomRange, setIsCustomRange] = useState(false);

  const presets = [
    { label: "Today", value: "Today" },
    { label: "Last 7 Days", value: "Last 7 Days" },
    { label: "Last 30 Days", value: "Last 30 Days" },
    { label: "Last 90 Days", value: "Last 90 Days" },
    { label: "Last 180 Days", value: "Last 180 Days" },
  ];

  // Determine if the current selection is a preset or custom date range
  useEffect(() => {
    const isPreset = presets.some(preset => preset.value === dateRange);
    setIsCustomRange(!isPreset && (date.from !== undefined || date.to !== undefined));
  }, [dateRange, date, presets]);

  // Format the date range for display
  const formatDisplayText = () => {
    if (date.from && date.to) {
      return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    } else if (date.from) {
      return format(date.from, "LLL dd, y");
    }
    return dateRange || "Pick a date range";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "flex justify-start text-left bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer overflow-hidden text-xs px-2 py-1",
            isCustomRange || !dateRange ? "!w-[255px]" : "!w-[140px]",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          <div className="flex-1 overflow-hidden">
            <span className="block truncate w-full">
              {formatDisplayText()}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-[#526189] text-white z-50" 
        align={align}
        side={isMobile ? "bottom" : "bottom"}
      >
        <div className="flex flex-col md:flex-row gap-0 md:gap-2">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date.from}
            selected={{ from: date.from, to: date.to }}
            onSelect={(newDate) => {
              // Fix for the type error - ensure we're passing the correct type
              onCustomDateChange({
                from: newDate?.from,
                to: newDate?.to
              });
              
              // Set isCustomRange to true only if both from and to dates are selected
              if (newDate?.from && newDate?.to) {
                setIsCustomRange(true);
                // Close the popover when a complete range is selected
                setTimeout(() => setOpen(false), 300);
              }
            }}
            numberOfMonths={1}
            className="text-white [&_.rdp-day]:text-white [&_.rdp-day_button:hover]:bg-[#253a60]/70 [&_.rdp-day_button:focus]:bg-[#253a60]/70"
          />
          <div className={`p-3 border-t border-white/10 md:border-t-0 md:border-l md:pl-4 ${isMobile ? "" : "min-w-[120px]"}`}>
            <div className="space-y-2">
              <div className="flex flex-col space-y-2">
                {presets.map((preset) => (
                  <Button
                    key={preset.value}
                    onClick={() => {
                      onDateRangeChange(preset.value);
                      setIsCustomRange(false);
                      setOpen(false);
                    }}
                    variant={dateRange === preset.value ? "secondary" : "outline"}
                    className={`text-white text-xs md:text-xs justify-start ${
                      dateRange === preset.value 
                        ? "bg-[#253a60] hover:bg-[#1A1F2C] w-auto inline-block" 
                        : "bg-transparent hover:bg-[#253a60]/50 border-white/20 w-full"
                    }`}
                    size="sm"
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
