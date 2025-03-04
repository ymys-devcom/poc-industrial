
import { Calendar, ChevronDown, CheckCircle, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { mockHospitals, getMockRobotTypes } from "@/utils/mockDataGenerator";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-col space-y-4 md:space-y-4 w-full max-w-full">
        {isMobile ? (
          // Mobile layout
          <div className="flex flex-col space-y-4 w-full">
            {/* First row - always visible */}
            <div className="flex space-x-2 w-full">
              {/* Date picker - 60% width */}
              <div className="w-[55%]">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-start text-left font-normal text-xs bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer overflow-hidden px-2 py-1"
                    >
                      <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 overflow-hidden">
                        <span className="block truncate w-full">
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
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#526189] text-white" align="start">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={date.from}
                      selected={{ from: date.from, to: date.to }}
                      onSelect={onCustomDateChange}
                      numberOfMonths={1}
                      className="text-white [&_.rdp-day]:text-white [&_.rdp-day_button:hover]:bg-[#3E4F7C] [&_.rdp-day_button:focus]:bg-[#3E4F7C]"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date range presets - increased to 35% width (10% wider) */}
              <div className="w-[35%]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-between bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
                    >
                      <span className="truncate">{dateRange}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    fitToTriggerWidth
                    className="bg-[#526189] text-white"
                  >
                    <DropdownMenuItem 
                      onClick={() => onDateRangeChange("Today")}
                      className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                    >
                      <span className="truncate">Today</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDateRangeChange("Last 7 Days")}
                      className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                    >
                      <span className="truncate">Last 7 Days</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDateRangeChange("Last 30 Days")}
                      className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                    >
                      <span className="truncate">Last 30 Days</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDateRangeChange("Last 90 Days")}
                      className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                    >
                      <span className="truncate">Last 90 Days</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDateRangeChange("Last 180 Days")}
                      className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                    >
                      <span className="truncate">Last 180 Days</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filter toggle button - 10% width (down from 15% to accommodate wider date preset) */}
              <div className="w-[10%]">
                <Button
                  variant="outline"
                  onClick={toggleMobileFilters}
                  className="w-full flex items-center justify-center bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer px-2 py-1"
                >
                  {showMobileFilters ? (
                    <X className="h-5 w-5 text-orange-500" style={{ strokeWidth: 2 }} />
                  ) : (
                    <Filter className="h-5 w-5 text-orange-500" style={{ strokeWidth: 2 }} />
                  )}
                </Button>
              </div>
            </div>

            {/* Additional filters - toggle visibility */}
            {showMobileFilters && (
              <>
                {/* Site dropdown - full width */}
                <div className="w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-between bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
                      >
                        <span className="flex-1 text-left truncate">
                          {selectedHospital === "All" ? "All Sites" : selectedHospital}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      fitToTriggerWidth
                      className="bg-[#526189] text-white"
                    >
                      {mockHospitals.map((hospital) => (
                        <Tooltip key={hospital}>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem
                              onClick={() => onHospitalChange(hospital)}
                              className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer overflow-hidden px-2 py-1"
                            >
                              <span className="truncate">
                                {hospital === "All" ? "All Sites" : hospital}
                              </span>
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent 
                            className="bg-[#14294B] text-white border-white/10"
                            side="right"
                          >
                            {hospital === "All" ? "All Sites" : hospital}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Robot type dropdown - full width */}
                <div className="w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full flex items-center justify-between gap-2 bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
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
                    <DropdownMenuContent 
                      fitToTriggerWidth
                      className="bg-[#526189] text-white"
                    >
                      {getMockRobotTypes(selectedHospital).map((type) => (
                        <Tooltip key={type}>
                          <TooltipTrigger asChild>
                            <DropdownMenuItem
                              className="flex items-center justify-between text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                              onClick={() => onRobotTypeChange(type)}
                            >
                              <span className="truncate">
                                {type === "All" ? "All AMR Types" : type}
                              </span>
                              {selectedRobotTypes.includes(type) && (
                                <CheckCircle
                                  className="h-4 w-4 text-white flex-shrink-0 ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveRobotType(type);
                                  }}
                                />
                              )}
                            </DropdownMenuItem>
                          </TooltipTrigger>
                          <TooltipContent 
                            className="bg-[#14294B] text-white border-white/10"
                            side="right"
                          >
                            {type === "All" ? "All AMR Types" : type}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Metrics dropdown - if applicable */}
                {metricOptions && metricOptions.length > 0 && onMetricToggle && (
                  <div className="w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-between gap-2 bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
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
                      <DropdownMenuContent 
                        fitToTriggerWidth
                        className="bg-[#526189] text-white"
                      >
                        {metricOptions.map((option) => (
                          <Tooltip key={option.id}>
                            <TooltipTrigger asChild>
                              <DropdownMenuItem
                                className="flex items-center justify-between text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                                onClick={() => onMetricToggle(option.id)}
                              >
                                <span className="truncate">{option.label}</span>
                                {visibleMetrics.includes(option.id) && (
                                  <CheckCircle
                                    className="h-4 w-4 text-white flex-shrink-0 ml-2"
                                  />
                                )}
                              </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent 
                              className="bg-[#14294B] text-white border-white/10"
                              side="right"
                            >
                              {option.label}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Desktop layout - also update with smaller text and padding
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 w-full max-w-full">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-2 w-full md:w-auto">
              {/* Hospital dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-[200px] flex items-center justify-between bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
                  >
                    <span className="flex-1 text-left truncate">
                      {selectedHospital === "All" ? "All Sites" : selectedHospital}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  fitToTriggerWidth
                  className="bg-[#526189] text-white"
                >
                  {mockHospitals.map((hospital) => (
                    <Tooltip key={hospital}>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem
                          onClick={() => onHospitalChange(hospital)}
                          className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer overflow-hidden px-2 py-1"
                        >
                          <span className="truncate">
                            {hospital === "All" ? "All Sites" : hospital}
                          </span>
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent 
                        className="bg-[#14294B] text-white border-white/10"
                        side="right"
                      >
                        {hospital === "All" ? "All Sites" : hospital}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Robot type dropdown - adjusted width to fit content */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full md:w-auto flex items-center justify-between gap-2 bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
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
                <DropdownMenuContent 
                  fitToTriggerWidth
                  className="bg-[#526189] text-white"
                >
                  {getMockRobotTypes(selectedHospital).map((type) => (
                    <Tooltip key={type}>
                      <TooltipTrigger asChild>
                        <DropdownMenuItem
                          className="flex items-center justify-between text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                          onClick={() => onRobotTypeChange(type)}
                        >
                          <span className="truncate">
                            {type === "All" ? "All AMR Types" : type}
                          </span>
                          {selectedRobotTypes.includes(type) && (
                            <CheckCircle
                              className="h-4 w-4 text-white flex-shrink-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveRobotType(type);
                              }}
                            />
                          )}
                        </DropdownMenuItem>
                      </TooltipTrigger>
                      <TooltipContent 
                        className="bg-[#14294B] text-white border-white/10"
                        side="right"
                      >
                        {type === "All" ? "All AMR Types" : type}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Metrics dropdown - adjusted width to fit content */}
              {metricOptions && metricOptions.length > 0 && onMetricToggle && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full md:w-auto flex items-center justify-between gap-2 bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
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
                  <DropdownMenuContent 
                    fitToTriggerWidth
                    className="bg-[#526189] text-white"
                  >
                    {metricOptions.map((option) => (
                      <Tooltip key={option.id}>
                        <TooltipTrigger asChild>
                          <DropdownMenuItem
                            className="flex items-center justify-between text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                            onClick={() => onMetricToggle(option.id)}
                          >
                            <span className="truncate">{option.label}</span>
                            {visibleMetrics.includes(option.id) && (
                              <CheckCircle
                                className="h-4 w-4 text-white flex-shrink-0 ml-2"
                              />
                            )}
                          </DropdownMenuItem>
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-[#14294B] text-white border-white/10"
                          side="right"
                        >
                          {option.label}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Date controls container */}
            <div className="flex flex-col md:flex-row w-full md:w-auto items-center space-y-4 md:space-y-0 md:space-x-2">
              <div className="flex w-full md:w-auto space-x-2">
                {/* Date picker - Fixed width container */}
                <div className="w-[60%] md:w-[200px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full flex justify-start text-left font-normal bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer overflow-hidden text-xs px-2 py-1"
                      >
                        <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <span className="block truncate w-full">
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
                          </span>
                        </div>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#526189] text-white" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={date.from}
                        selected={{ from: date.from, to: date.to }}
                        onSelect={onCustomDateChange}
                        numberOfMonths={1}
                        className="text-white [&_.rdp-day]:text-white [&_.rdp-day_button:hover]:bg-[#3E4F7C] [&_.rdp-day_button:focus]:bg-[#3E4F7C]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Date range dropdown - increased to be 10% wider */}
                <div className="w-[40%] md:w-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full min-w-[110px] flex items-center justify-between bg-[#526189] text-white border-white hover:bg-[#3E4F7C] hover:text-white cursor-pointer text-xs px-2 py-1"
                      >
                        <span className="truncate">{dateRange}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      fitToTriggerWidth
                      className="bg-[#526189] text-white"
                    >
                      <DropdownMenuItem 
                        onClick={() => onDateRangeChange("Today")}
                        className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                      >
                        <span className="truncate">Today</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDateRangeChange("Last 7 Days")}
                        className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                      >
                        <span className="truncate">Last 7 Days</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDateRangeChange("Last 30 Days")}
                        className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                      >
                        <span className="truncate">Last 30 Days</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDateRangeChange("Last 90 Days")}
                        className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                      >
                        <span className="truncate">Last 90 Days</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDateRangeChange("Last 180 Days")}
                        className="text-xs text-white hover:bg-[#3E4F7C] hover:text-white focus:bg-[#3E4F7C] focus:text-white cursor-pointer px-2 py-1"
                      >
                        <span className="truncate">Last 180 Days</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
