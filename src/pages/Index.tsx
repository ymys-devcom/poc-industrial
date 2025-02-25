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
        return 0.8;
      case "Last 7 Days":
        return 1;
      case "Last 30 Days":
        return 1.2;
      case "Last 90 Days":
        return 1.4;
      default:
        return 1;
    }
  };

  const multiplier = getMultiplier(range);

  return {
    "Mayo Clinic - Rochester": {
      "AMR v2.3": {
        metrics: [
          { 
            label: "Utilization Rate", 
            value: `${Math.round(90 * multiplier)}%`, 
            trend: "up", 
            id: "utilization",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.floor(65 + Math.random() * 35 * multiplier),
            }))
          },
          { 
            label: "Active Time", 
            value: `${Math.round(1250 * multiplier)} hrs`, 
            trend: "up", 
            id: "active-time",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.floor(800 + Math.random() * 450 * multiplier),
            }))
          },
          { 
            label: "Error Rate", 
            value: `${(0.5 * (2 - multiplier)).toFixed(1)}%`, 
            trend: "down", 
            id: "error-rate",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.floor(Math.random() * 2 * multiplier),
            }))
          },
          { 
            label: "Battery Health", 
            value: `${Math.round(95 * multiplier)}%`, 
            trend: "stable", 
            id: "battery",
            hourlyData: Array.from({ length: 24 }, (_, hour) => ({
              hour: `${hour}:00`,
              value: Math.floor(85 + Math.random() * 15 * multiplier),
            }))
          },
        ],
      },
      "Surgical Assistant Pro": {
        metrics: [
          { label: "Utilization Rate", value: `${Math.round(85 * multiplier)}%`, trend: "up", id: "utilization" },
          { label: "Active Time", value: `${Math.round(980 * multiplier)} hrs`, trend: "up", id: "active-time" },
          { label: "Error Rate", value: `${(0.8 * (2 - multiplier)).toFixed(1)}%`, trend: "up", id: "error-rate" },
          { label: "Battery Health", value: `${Math.round(92 * multiplier)}%`, trend: "down", id: "battery" },
        ],
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.floor(Math.random() * 85 * multiplier),
        })),
      },
    },
    "Cleveland Clinic": {
      "Patient Transport Bot": {
        metrics: [
          { label: "Utilization Rate", value: `${Math.round(75 * multiplier)}%`, trend: "down", id: "utilization" },
          { label: "Active Time", value: `${Math.round(850 * multiplier)} hrs`, trend: "down", id: "active-time" },
          { label: "Error Rate", value: `${(0.3 * (2 - multiplier)).toFixed(1)}%`, trend: "down", id: "error-rate" },
          { label: "Battery Health", value: `${Math.round(98 * multiplier)}%`, trend: "up", id: "battery" },
        ],
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.floor(Math.random() * 75 * multiplier),
        })),
      },
      "Delivery Robot": {
        metrics: [
          { label: "Utilization Rate", value: `${Math.round(95 * multiplier)}%`, trend: "up", id: "utilization" },
          { label: "Active Time", value: `${Math.round(1450 * multiplier)} hrs`, trend: "up", id: "active-time" },
          { label: "Error Rate", value: `${(0.2 * (2 - multiplier)).toFixed(1)}%`, trend: "down", id: "error-rate" },
          { label: "Battery Health", value: `${Math.round(89 * multiplier)}%`, trend: "down", id: "battery" },
        ],
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.floor(Math.random() * 95 * multiplier),
        })),
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
                      />
                      <Tooltip />
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
