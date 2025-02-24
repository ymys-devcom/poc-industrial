
import { useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, Star } from "lucide-react";
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
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const generateMockDataForRange = (range: string) => {
  const getMultiplier = (range: string) => {
    switch (range) {
      case "Today":
        return 0.8;
      case "This Week":
        return 1;
      case "This Month":
        return 1.2;
      case "This Year":
        return 1.4;
      default:
        return 1;
    }
  };

  const multiplier = getMultiplier(range);
  
  const generateHourlyData = (baseValue: number) => {
    return Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      value: Math.floor((baseValue + Math.random() * 20 - 10) * multiplier),
    }));
  };

  return {
    favorites: [
      { 
        label: "Utilization",
        value: "50%",
        data: generateHourlyData(50),
        color: "#9b87f5"
      },
      { 
        label: "Mission Time",
        value: "90 sec",
        data: generateHourlyData(90),
        color: "#0EA5E9"
      },
      { 
        label: "Miles Saved",
        value: "1,250",
        data: generateHourlyData(1250),
        color: "#D946EF"
      },
      { 
        label: "Hours Saved",
        value: "500",
        data: generateHourlyData(500),
        color: "#F97316"
      }
    ],
    allStats: [
      { 
        label: "Utilization",
        value: "50%",
        data: generateHourlyData(50),
        color: "#9b87f5"
      },
      { 
        label: "Mission Time",
        value: "90 sec",
        data: generateHourlyData(90),
        color: "#0EA5E9"
      },
      { 
        label: "Downtime",
        value: "2%",
        data: generateHourlyData(2),
        color: "#D946EF"
      },
      { 
        label: "Error Rate",
        value: "1.6%",
        data: generateHourlyData(1.6),
        color: "#F97316"
      },
      { 
        label: "Miles Saved",
        value: "1,250",
        data: generateHourlyData(1250),
        color: "#9b87f5"
      },
      { 
        label: "Hours Saved",
        value: "500",
        data: generateHourlyData(500),
        color: "#0EA5E9"
      },
      { 
        label: "Completed Missions",
        value: "6 / hour",
        data: generateHourlyData(6),
        color: "#D946EF"
      }
    ]
  };
};

const mockLocations = ["Canavday Building and Davis Building", "Mayo Building", "Hospital"];
const mockRobotTypes = ["Nurse Bots", "Go-Bots", "Autonomous Hospital Beds", "HAL-PICK"];

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState(mockLocations[0]);
  const [selectedRobotTypes, setSelectedRobotTypes] = useState([mockRobotTypes[0]]);
  const [dateRange, setDateRange] = useState("This Week");
  const [mockData, setMockData] = useState(generateMockDataForRange("This Week"));
  const [showAllStats, setShowAllStats] = useState(false);
  const navigate = useNavigate();

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setMockData(generateMockDataForRange(range));
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <header className="px-6 py-4 flex justify-between items-center bg-[#403E43]/50">
        <div className="flex items-center space-x-4">
          <img
            src="/lovable-uploads/c655a0e6-4cb1-4808-ab99-49b26fbb55ab.png"
            alt="Mayo Clinic Logo"
            className="h-8"
          />
          <span className="text-sm">Jacksonville, FL</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm">Settings</Button>
          <Button variant="ghost" size="sm">Log out</Button>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-400 mb-1 block">Site</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedLocation} <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {mockLocations.map((location) => (
                    <DropdownMenuItem
                      key={location}
                      onClick={() => setSelectedLocation(location)}
                    >
                      {location}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex-[2] min-w-[300px]">
              <label className="text-sm text-gray-400 mb-1 block">AMR Type</label>
              <div className="flex flex-wrap gap-2">
                {mockRobotTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedRobotTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedRobotTypes((prev) =>
                        prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      );
                    }}
                  >
                    {type}
                    {selectedRobotTypes.includes(type) && (
                      <span className="ml-2 text-xs">×</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-gray-400 mb-1 block">Date Range</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {dateRange} <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  {["Today", "This Week", "This Month", "This Year"].map((range) => (
                    <DropdownMenuItem
                      key={range}
                      onClick={() => handleDateRangeChange(range)}
                    >
                      {range}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Favorites
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAllStats(!showAllStats)}>
                {showAllStats ? "Show Less" : "Show All Stats"}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockData.favorites.map((metric) => (
                <Card 
                  key={metric.label}
                  className="bg-[#403E43]/50 border-0 p-4"
                >
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">{metric.label}</span>
                    <span className="text-2xl font-semibold mt-1">{metric.value}</span>
                    <div className="h-[60px] mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metric.data}>
                          <XAxis dataKey="hour" hide />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={metric.color}
                            fill={metric.color}
                            fillOpacity={0.1}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {showAllStats && (
            <section>
              <h2 className="text-lg font-semibold mb-4">All Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockData.allStats.map((metric) => (
                  <Card 
                    key={metric.label}
                    className="bg-[#403E43]/50 border-0 p-4"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-400">{metric.label}</span>
                      <span className="text-2xl font-semibold mt-1">{metric.value}</span>
                      <div className="h-[60px] mt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={metric.data}>
                            <XAxis dataKey="hour" hide />
                            <Tooltip />
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={metric.color}
                              fill={metric.color}
                              fillOpacity={0.1}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
