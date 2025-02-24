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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const mockData = {
  "Mayo Clinic - Rochester": {
    "AMR v2.3": {
      metrics: [
        { label: "Utilization Rate", value: "90%", trend: "up", id: "utilization" },
        { label: "Active Time", value: "1,250 hrs", trend: "up", id: "active-time" },
        { label: "Error Rate", value: "0.5%", trend: "down", id: "error-rate" },
        { label: "Battery Health", value: "95%", trend: "stable", id: "battery" },
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        value: Math.floor(Math.random() * 100),
      })),
    },
    "Surgical Assistant Pro": {
      metrics: [
        { label: "Utilization Rate", value: "85%", trend: "up", id: "utilization" },
        { label: "Active Time", value: "980 hrs", trend: "up", id: "active-time" },
        { label: "Error Rate", value: "0.8%", trend: "up", id: "error-rate" },
        { label: "Battery Health", value: "92%", trend: "down", id: "battery" },
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        value: Math.floor(Math.random() * 85),
      })),
    },
  },
  "Cleveland Clinic": {
    "Patient Transport Bot": {
      metrics: [
        { label: "Utilization Rate", value: "75%", trend: "down", id: "utilization" },
        { label: "Active Time", value: "850 hrs", trend: "down", id: "active-time" },
        { label: "Error Rate", value: "0.3%", trend: "down", id: "error-rate" },
        { label: "Battery Health", value: "98%", trend: "up", id: "battery" },
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        value: Math.floor(Math.random() * 75),
      })),
    },
    "Delivery Robot": {
      metrics: [
        { label: "Utilization Rate", value: "95%", trend: "up", id: "utilization" },
        { label: "Active Time", value: "1,450 hrs", trend: "up", id: "active-time" },
        { label: "Error Rate", value: "0.2%", trend: "down", id: "error-rate" },
        { label: "Battery Health", value: "89%", trend: "down", id: "battery" },
      ],
      hourlyData: Array.from({ length: 24 }, (_, hour) => ({
        hour: `${hour}:00`,
        value: Math.floor(Math.random() * 95),
      })),
    },
  },
};

const mockHospitals = Object.keys(mockData);
const getMockRobotTypes = (hospital: string) => Object.keys(mockData[hospital] || {});

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotType, setSelectedRobotType] = useState(getMockRobotTypes(mockHospitals[0])[0]);
  const navigate = useNavigate();

  const handleHospitalChange = (hospital: string) => {
    setSelectedHospital(hospital);
    setSelectedRobotType(getMockRobotTypes(hospital)[0]);
  };

  const handleMetricClick = (metricId: string) => {
    navigate(`/metrics/${metricId}`);
  };

  const currentData = mockData[selectedHospital]?.[selectedRobotType] || {
    metrics: [],
    hourlyData: [],
  };

  const performanceData = currentData.hourlyData.map((item) => ({
    hour: item.hour,
    efficiency: Math.min(100, item.value + Math.random() * 10),
    accuracy: Math.min(100, item.value - Math.random() * 5),
  }));

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
          <Button variant="outline" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {currentData.metrics.map((metric) => (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Utilization Trends (24h)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentData.hourlyData}>
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
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="var(--primary)" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="var(--destructive)" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
