
import { useState } from "react";
import { Bell, Bot, Calendar, ChevronDown, Home, LogOut, Settings, User } from "lucide-react";
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

const mockHospitals = [
  "Mayo Clinic - Rochester",
  "Cleveland Clinic",
  "Johns Hopkins Hospital",
  "Massachusetts General Hospital",
];

const mockRobotTypes = [
  "AMR v2.3",
  "Surgical Assistant Pro",
  "Patient Transport Bot",
  "Delivery Robot",
];

const mockMetrics = [
  { label: "Utilization Rate", value: "90%", trend: "up", id: "utilization" },
  { label: "Active Time", value: "1,250 hrs", trend: "up", id: "active-time" },
  { label: "Error Rate", value: "0.5%", trend: "down", id: "error-rate" },
  { label: "Battery Health", value: "95%", trend: "stable", id: "battery" },
];

const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
  hour: `${hour}:00`,
  value: Math.floor(Math.random() * 100),
}));

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotType, setSelectedRobotType] = useState(mockRobotTypes[0]);
  const navigate = useNavigate();

  const handleMetricClick = (metricId: string) => {
    navigate(`/metrics/${metricId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
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

      {/* Main Content */}
      <main className="p-6">
        {/* Controls */}
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
                    onClick={() => setSelectedHospital(hospital)}
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
                {mockRobotTypes.map((type) => (
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
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {mockMetrics.map((metric) => (
            <Card 
              key={metric.label} 
              className="bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => handleMetricClick(metric.id)}
            >
              <div className="flex flex-col">
                <span className="text-muted-foreground text-sm">{metric.label}</span>
                <span className="text-2xl font-semibold mt-1">{metric.value}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Utilization Trends (24h)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--primary)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Chart Placeholder
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;

