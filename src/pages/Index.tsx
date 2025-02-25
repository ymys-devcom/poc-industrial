import { useState } from "react";
import { Bell, Bot, Calendar, ChevronDown, Settings, LogOut, CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

const generateMockDataForRange = (range: string) => {
  const getMultiplier = (range: string) => {
    switch (range) {
      case "Today":
        return 0.85;
      case "Last 7 Days":
        return 0.9;
      case "Last 30 Days":
        return 0.95;
      case "Last 90 Days":
        return 1;
      default:
        return 0.9;
    }
  };

  const multiplier = getMultiplier(range);

  const clampValue = (value: number, max: number): number => {
    return Math.min(Math.max(0, value), max);
  };

  const generateMetricsForRobot = (baseUtilization: number, baseActiveTime: number, baseErrorRate: number, baseBatteryHealth: number) => ({
    metrics: [
      { 
        label: "Utilization Rate", 
        value: `${Math.round(clampValue(baseUtilization * multiplier, 100))}%`,
        trend: "up", 
        id: "utilization",
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.round(clampValue((baseUtilization - 20) + Math.random() * 30 * multiplier, 100)),
        }))
      },
      { 
        label: "Active Time", 
        value: `${Math.round(baseActiveTime * multiplier)} hrs`,
        trend: "up", 
        id: "active-time",
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.round(clampValue((baseActiveTime - 450) + Math.random() * 450 * multiplier, baseActiveTime)),
        }))
      },
      { 
        label: "Error Rate", 
        value: `${clampValue((baseErrorRate * (2 - multiplier)), 5).toFixed(1)}%`,
        trend: "down", 
        id: "error-rate",
        hourlyData: Array.from({ length: 24 }, (_, hour) => {
          const value = Math.round(clampValue(Math.random() * baseErrorRate * multiplier, 5));
          return {
            hour: `${hour}:00`,
            value: value,
            displayValue: value
          };
        })
      },
      { 
        label: "Battery Health", 
        value: `${Math.round(clampValue(baseBatteryHealth * multiplier, 100))}%`,
        trend: "stable", 
        id: "battery",
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.round(clampValue((baseBatteryHealth - 15) + Math.random() * 15 * multiplier, 100)),
        }))
      },
    ],
  });

  const standardRobots = {
    "Medical Supply Bot": generateMetricsForRobot(88, 1350, 0.3, 94),
    "Medication Delivery Bot": generateMetricsForRobot(82, 1150, 0.4, 91),
    "Patient Transport Bot": generateMetricsForRobot(75, 850, 0.3, 98),
    "Surgical Assistant Pro": generateMetricsForRobot(80, 980, 0.8, 92),
  };

  return {
    "Mayo Clinic - Rochester": standardRobots,
    "Cleveland Clinic": standardRobots,
    "Johns Hopkins Hospital": standardRobots,
  };
};

const mockHospitals = ["All", "Mayo Clinic - Rochester", "Cleveland Clinic", "Johns Hopkins Hospital"];
const getMockRobotTypes = (hospital: string) => {
  const robotTypes = Object.keys(generateMockDataForRange("Last 7 Days")[mockHospitals[1]] || {});
  return ["All", ...robotTypes];
};

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotTypes, setSelectedRobotTypes] = useState(["All"]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [mockData, setMockData] = useState(generateMockDataForRange("Last 7 Days"));
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const navigate = useNavigate();

  const handleHospitalChange = (hospital: string) => {
    setSelectedHospital(hospital);
    setSelectedRobotTypes(["All"]);
    setMockData(generateMockDataForRange(dateRange));
  };

  const handleRobotTypeChange = (robotType: string) => {
    if (robotType === "All") {
      setSelectedRobotTypes(["All"]);
    } else {
      setSelectedRobotTypes((prev) => {
        const newSelection = prev.filter(type => type !== "All");
        if (prev.includes(robotType)) {
          const result = newSelection.filter((type) => type !== robotType);
          return result.length === 0 ? ["All"] : result;
        }
        return [...newSelection, robotType];
      });
    }
  };

  const removeRobotType = (robotType: string) => {
    if (robotType === "All") return;
    setSelectedRobotTypes((prev) => {
      const result = prev.filter((type) => type !== robotType);
      return result.length === 0 ? ["All"] : result;
    });
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setDate({ from: undefined, to: undefined });
    setMockData(generateMockDataForRange(range));
  };

  const handleCustomDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDate(range);
    if (range.from && range.to) {
      setDateRange("Custom Range");
      setMockData(generateMockDataForRange("Custom Range"));
    }
  };

  const handleMetricClick = (metricId: string) => {
    navigate(`/metrics/${metricId}`);
  };

  const aggregateData = () => {
    if (selectedRobotTypes.length === 0) {
      return { metrics: [] };
    }

    const hospitals = selectedHospital === "All" 
      ? mockHospitals.filter(h => h !== "All")
      : [selectedHospital];

    const robotTypes = selectedRobotTypes.includes("All") 
      ? getMockRobotTypes(hospitals[0]).filter(type => type !== "All")
      : selectedRobotTypes;

    const firstHospitalData = mockData[hospitals[0]]?.[robotTypes[0]];
    if (!firstHospitalData) return { metrics: [] };

    return {
      metrics: firstHospitalData.metrics.map((metric) => {
        const aggregatedHourlyData = metric.hourlyData.map((hourData) => {
          let totalValue = 0;
          let count = 0;

          hospitals.forEach(hospital => {
            robotTypes.forEach(robotType => {
              const value = mockData[hospital]?.[robotType]?.metrics
                .find(m => m.id === metric.id)
                ?.hourlyData.find(h => h.hour === hourData.hour)?.value;
              
              if (typeof value === 'number') {
                totalValue += value;
                count++;
              }
            });
          });

          const average = count > 0 ? totalValue / count : 0;
          return {
            ...hourData,
            value: metric.id === "error-rate" ? Math.min(average, 5) : Math.min(average, 100),
          };
        });

        let totalCurrentValue = 0;
        let valueCount = 0;

        hospitals.forEach(hospital => {
          robotTypes.forEach(robotType => {
            const robotMetric = mockData[hospital]?.[robotType]?.metrics.find(m => m.id === metric.id);
            if (robotMetric) {
              const value = Number(robotMetric.value.replace(/[^0-9.]/g, ""));
              if (!isNaN(value)) {
                totalCurrentValue += value;
                valueCount++;
              }
            }
          });
        });

        const averageCurrentValue = valueCount > 0 ? totalCurrentValue / valueCount : 0;

        return {
          ...metric,
          value: `${Math.round(averageCurrentValue)}${metric.value.includes("%") ? "%" : " hrs"}`,
          hourlyData: aggregatedHourlyData,
        };
      }),
    };
  };

  const currentData = aggregateData();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="px-6 py-4 flex justify-between items-center bg-card">
        <div className="flex items-center space-x-4">
          <Bot className="h-8 w-8" />
          <h1 className="text-xl font-semibold">HealthTech Insight</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <div className="flex h-full w-full items-center justify-center bg-primary/10 rounded-full">
                  <span className="text-sm font-medium">JD</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] bg-popover">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  {selectedHospital} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] bg-popover">
                {mockHospitals.map((hospital) => (
                  <DropdownMenuItem
                    key={hospital}
                    onClick={() => handleHospitalChange(hospital)}
                  >
                    {hospital}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[200px] flex items-center justify-between gap-2">
                  <span className="flex-1 text-left truncate">
                    {selectedRobotTypes.includes("All") 
                      ? "All Robot Types" 
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
                    onClick={() => handleRobotTypeChange(type)}
                  >
                    <span>{type}</span>
                    {selectedRobotTypes.includes(type) && (
                      <CheckCircle 
                        className="h-4 w-4 text-primary" 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRobotType(type);
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
                  onSelect={handleCustomDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {dateRange}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] bg-popover">
                <DropdownMenuItem onClick={() => handleDateRangeChange("Today")}>
                  Today
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDateRangeChange("Last 7 Days")}>
                  Last 7 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDateRangeChange("Last 30 Days")}>
                  Last 30 Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDateRangeChange("Last 90 Days")}>
                  Last 90 Days
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {currentData.metrics.map((metric) => (
            <Card 
              key={metric.id} 
              className="bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleMetricClick(metric.id)}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-muted-foreground text-sm">{metric.label}</span>
                  <span className="text-2xl font-semibold">{metric.value}</span>
                </div>
                <div className="h-[200px] mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metric.hourlyData}>
                      <XAxis 
                        dataKey="hour" 
                        interval={3}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string, props: any) => {
                          if (metric.id === "error-rate") {
                            return [`${props.payload.displayValue}%`, "Error Rate"];
                          }
                          return [value, name];
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill={
                          metric.id === "error-rate" 
                            ? "#ef4444" 
                            : metric.id === "battery" 
                            ? "#22c55e"
                            : "#0ea5e9"
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
