import { Calendar, ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { mockHospitals, getMockRobotTypes } from "@/utils/mockDataGenerator";

interface DashboardFiltersProps {
  selectedHospital: string;
  selectedRobotTypes: string[];
  dateRange: string;
  date: {
    from: Date | undefined;
    to: Date | undefined;
  };
  onHospitalChange: (hospital: string) => void;
  onRobotTypeChange: (robotType: string) => void;
  onRemoveRobotType: (robotType: string) => void;
  onDateRangeChange: (range: string) => void;
  onCustomDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const DashboardFilters = ({
  selectedHospital,
  selectedRobotTypes,
  dateRange,
  date,
  onHospitalChange,
  onRobotTypeChange,
  onRemoveRobotType,
  onDateRangeChange,
  onCustomDateChange,
}: DashboardFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[200px] flex items-center justify-between">
              <span className="flex-1 text-left truncate">
                {selectedHospital === "All" ? "All Sites" : selectedHospital}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-popover">
            {mockHospitals.map((hospital) => (
              <DropdownMenuItem
                key={hospital}
                onClick={() => onHospitalChange(hospital)}
              >
                {hospital === "All" ? "All Sites" : hospital}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[200px] flex items-center justify-between gap-2">
              <span className="flex-1 text-left truncate">
                {selectedRobotTypes.includes("All")
                  ? "All AMR Types"
                  : selectedRobotTypes.length === 1
                  ? selectedRobotTypes[0]
                  : `${selectedRobotTypes[0]} +${selectedRobotTypes.length - 1}`}
              </span>
              <div className="flex items-center gap-2">
                {selectedRobotTypes.length > 0 && !selectedRobotTypes.includes("All") && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {selectedRobotTypes.length}
                  </span>
                )}
                <ChevronDown className="h-4 w-4" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-popover">
            {getMockRobotTypes(selectedHospital).map((type) => (
              <DropdownMenuItem
                key={type}
                className="flex items-center justify-between"
                onClick={() => onRobotTypeChange(type)}
              >
                <span>{type === "All" ? "All AMR Types" : type}</span>
                {selectedRobotTypes.includes(type) && (
                  <CheckCircle
                    className="h-4 w-4 text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRobotType(type);
                    }}
                  />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {date.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                "Pick a date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date.from}
              selected={{ from: date.from, to: date.to }}
              onSelect={onCustomDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{dateRange}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] bg-popover">
            <DropdownMenuItem onClick={() => onDateRangeChange("Today")}>
              Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange("Last 7 Days")}>
              Last 7 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange("Last 30 Days")}>
              Last 30 Days
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDateRangeChange("Last 90 Days")}>
              Last 90 Days
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
