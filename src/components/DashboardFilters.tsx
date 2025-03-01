
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
  visibleMetrics?: string[];
  onMetricToggle?: (metricId: string) => void;
  metricOptions?: { id: string; label: string }[];
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
  visibleMetrics = [],
  onMetricToggle,
  metricOptions = [],
}: DashboardFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-col space-y-4 md:space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full md:w-[200px] flex items-center justify-between bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer"
              >
                <span className="flex-1 text-left truncate">
                  {selectedHospital === "All" ? "All Sites" : selectedHospital}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-[#526189] text-white" fullWidthOnMobile>
              {mockHospitals.map((hospital) => (
                <DropdownMenuItem
                  key={hospital}
                  onClick={() => onHospitalChange(hospital)}
                  className="text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
                >
                  {hospital === "All" ? "All Sites" : hospital}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full md:min-w-[200px] flex items-center justify-between gap-2 bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer"
              >
                <span className="flex-1 text-left truncate">
                  {selectedRobotTypes.includes("All")
                    ? "All AMR Types"
                    : selectedRobotTypes.length === 1
                    ? selectedRobotTypes[0]
                    : `${selectedRobotTypes[0]} +${selectedRobotTypes.length - 1}`}
                </span>
                <div className="flex items-center gap-2">
                  {selectedRobotTypes.length > 0 && !selectedRobotTypes.includes("All") && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-white/20 text-white rounded-full">
                      {selectedRobotTypes.length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] bg-[#526189] text-white" fullWidthOnMobile>
              {getMockRobotTypes(selectedHospital).map((type) => (
                <DropdownMenuItem
                  key={type}
                  className="flex items-center justify-between text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
                  onClick={() => onRobotTypeChange(type)}
                >
                  <span>{type === "All" ? "All AMR Types" : type}</span>
                  {selectedRobotTypes.includes(type) && (
                    <CheckCircle
                      className="h-4 w-4 text-white"
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
          
          {/* Metrics dropdown - moved to be in the same row */}
          {metricOptions && metricOptions.length > 0 && onMetricToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full md:min-w-[200px] flex items-center justify-between gap-2 bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer"
                >
                  <span className="flex-1 text-left truncate">
                    {visibleMetrics.includes("all") 
                      ? "All Metrics" 
                      : `${visibleMetrics.length} Selected`}
                  </span>
                  <div className="flex items-center gap-2">
                    {visibleMetrics.length > 0 && !visibleMetrics.includes("all") && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-white/20 text-white rounded-full">
                        {visibleMetrics.length}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] bg-[#526189] text-white" fullWidthOnMobile>
                {metricOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    className="flex items-center justify-between text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
                    onClick={() => onMetricToggle(option.id)}
                  >
                    <span>{option.label}</span>
                    {visibleMetrics.includes(option.id) && (
                      <CheckCircle
                        className="h-4 w-4 text-white"
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 space-x-0 md:space-x-2 w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full md:w-auto justify-start text-left font-normal bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer"
              >
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
            <PopoverContent className="w-auto p-0 bg-[#526189] text-white" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date.from}
                selected={{ from: date.from, to: date.to }}
                onSelect={onCustomDateChange}
                numberOfMonths={2}
                className="text-white [&_.rdp-day]:text-white [&_.rdp-day_button:hover]:bg-[#3E4F7C] [&_.rdp-day_button:focus]:bg-[#3E4F7C]"
              />
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full md:min-w-[120px] flex items-center justify-between bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer"
              >
                <span>{dateRange}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[120px] bg-[#526189] text-white">
              <DropdownMenuItem 
                onClick={() => onDateRangeChange("Today")}
                className="text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDateRangeChange("Last 7 Days")}
                className="text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
              >
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDateRangeChange("Last 30 Days")}
                className="text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
              >
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDateRangeChange("Last 90 Days")}
                className="text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
              >
                Last 90 Days
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDateRangeChange("Last 180 Days")}
                className="text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer"
              >
                Last 180 Days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
