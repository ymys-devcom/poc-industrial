import { useState } from "react";
import { Bell, Bot, Calendar, ChevronDown, Settings, LogOut } from "lucide-react";
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

  // Helper function to ensure values stay within bounds
  const clampValue = (value: number, max: number): number => {
    return Math.min(Math.max(0, value), max);
  };

  return {
    "Mayo Clinic - Rochester": {
      "AMR v2.3": {
        metrics: [
          { 
            label: "Utilization Rate", 
            value: `${Math.round(clampValue(85 * multiplier, 100))}%`,
            trend: "up", 
            id: "utilization",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(65 + Math.random() * 30 * multiplier, 100)),
            }))
          },
          { 
            label: "Active Time", 
            value: `${Math.round(1250 * multiplier)} hrs`,
            trend: "up", 
            id: "active-time",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(800 + Math.random() * 450 * multiplier, 1450)),
            }))
          },
          { 
            label: "Error Rate", 
            value: `${clampValue((0.5 * (2 - multiplier)), 5).toFixed(1)}%`,
            trend: "down", 
            id: "error-rate",
            hourlyData: Array.from({ length: 24 }, (_, hour) => {
              const value = Math.round(clampValue(Math.random() * 2 * multiplier, 5));
              return {
                hour: `${hour}:00`,
                value: value,
                displayValue: value
              };
            })
          },
          { 
            label: "Battery Health", 
            value: `${Math.round(clampValue(95 * multiplier, 100))}%`,
            trend: "stable", 
            id: "battery",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(85 + Math.random() * 15 * multiplier, 100)),
            }))
          },
        ],
      },
      "Surgical Assistant Pro": {
        metrics: [
          { 
            label: "Utilization Rate", 
            value: `${Math.round(clampValue(80 * multiplier, 100))}%`,
            trend: "up", 
            id: "utilization",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(55 + Math.random() * 30 * multiplier, 100)),
            }))
          },
          { 
            label: "Active Time", 
            value: `${Math.round(980 * multiplier)} hrs`,
            trend: "up", 
            id: "active-time",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(600 + Math.random() * 450 * multiplier, 1200)),
            }))
          },
          { 
            label: "Error Rate", 
            value: `${clampValue((0.8 * (2 - multiplier)), 5).toFixed(1)}%`,
            trend: "up", 
            id: "error-rate",
            hourlyData: Array.from({ length: 24 }, (_, hour) => {
              const value = Math.round(clampValue(Math.random() * 3 * multiplier, 5));
              return {
                hour: `${hour}:00`,
                value: value,
                displayValue: value
              };
            })
          },
          { 
            label: "Battery Health", 
            value: `${Math.round(clampValue(92 * multiplier, 100))}%`,
            trend: "down", 
            id: "battery",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(80 + Math.random() * 15 * multiplier, 100)),
            }))
          },
        ],
      },
    },
    "Cleveland Clinic": {
      "Patient Transport Bot": {
        metrics: [
          { 
            label: "Utilization Rate", 
            value: `${Math.round(clampValue(75 * multiplier, 100))}%`,
            trend: "down", 
            id: "utilization",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(45 + Math.random() * 35 * multiplier, 100)),
            }))
          },
          { 
            label: "Active Time", 
            value: `${Math.round(850 * multiplier)} hrs`,
            trend: "down", 
            id: "active-time",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(500 + Math.random() * 450 * multiplier, 1000)),
            }))
          },
          { 
            label: "Error Rate", 
            value: `${clampValue((0.3 * (2 - multiplier)), 5).toFixed(1)}%`,
            trend: "down", 
            id: "error-rate",
            hourlyData: Array.from({ length: 24 }, (_, hour) => {
              const value = Math.round(clampValue(Math.random() * 1.5 * multiplier, 5));
              return {
                hour: `${hour}:00`,
                value: value,
                displayValue: value
              };
            })
          },
          { 
            label: "Battery Health", 
            value: `${Math.round(clampValue(98 * multiplier, 100))}%`,
            trend: "up", 
            id: "battery",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(90 + Math.random() * 10 * multiplier, 100)),
            }))
          },
        ],
      },
      "Delivery Robot": {
        metrics: [
          { 
            label: "Utilization Rate", 
            value: `${Math.round(clampValue(90 * multiplier, 100))}%`,
            trend: "up", 
            id: "utilization",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(75 + Math.random() * 25 * multiplier, 100)),
            }))
          },
          { 
            label: "Active Time", 
            value: `${Math.round(1450 * multiplier)} hrs`,
            trend: "up", 
            id: "active-time",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(1000 + Math.random() * 450 * multiplier, 1600)),
            }))
          },
          { 
            label: "Error Rate", 
            value: `${clampValue((0.2 * (2 - multiplier)), 5).toFixed(1)}%`,
            trend: "down", 
            id: "error-rate",
            hourlyData: Array.from({ length: 24 }, (_, hour) => {
              const value = Math.round(clampValue(Math.random() * 1 * multiplier, 5));
              return {
                hour: `${hour}:00`,
                value: value,
                displayValue: value
              };
            })
          },
          { 
            label: "Battery Health", 
            value: `${Math.round(clampValue(89 * multiplier, 100))}%`,
            trend: "down", 
            id: "battery",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.round(clampValue(75 + Math.random() * 15 * multiplier, 100)),
            }))
          },
        ],
      },
    },
  };
};

const mockHospitals = ["Mayo Clinic - Rochester", "Cleveland Clinic"];
const getMockRobotTypes = (hospital: string) => Object.keys(generateMockDataForRange("Last 7 Days")[hospital] || {});

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotType, setSelectedRobotType] = useState(getMockRobotTypes(mockHospitals[0])[0]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [mockData, setMockData] = useState(generateMockDataForRange("Last 7 Days"));
  const navigate = useNavigate();

  const handleHospitalChange = (hospital: string) => {
    setSelectedHospital(hospital);
    setSelectedRobotType(getMockRobotTypes(hospital)[0]);
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setMockData(generateMockDataForRange(range));
  };

  const handleMetricClick = (metricId: string) => {
    navigate(`/metrics/${metricId}`);
  };

  const currentData = mockData[selectedHospital]?.[selectedRobotType] || {
    metrics: [],
  };

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
                <Button variant="outline" className="w-[200px]">
                  {selectedRobotType} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px] bg-popover">
                {getMockRobotTypes(selectedHospital).map((type) => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setSelectedRobotType(type)}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
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
