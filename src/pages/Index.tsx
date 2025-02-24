
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
  { label: "Utilization Rate", value: "90%", trend: "up" },
  { label: "Active Time", value: "1,250 hrs", trend: "up" },
  { label: "Error Rate", value: "0.5%", trend: "down" },
  { label: "Battery Health", value: "95%", trend: "stable" },
];

const Index = () => {
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotType, setSelectedRobotType] = useState(mockRobotTypes[0]);

  return (
    <div className="min-h-screen bg-dashboard-background text-dashboard-text">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-dashboard-card">
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
                <div className="flex h-full w-full items-center justify-center bg-dashboard-accent rounded-full">
                  <span className="text-sm font-medium">JD</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
              <DropdownMenuContent>
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
              <DropdownMenuContent>
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
            <Card key={metric.label} className="bg-dashboard-card p-4">
              <div className="flex flex-col">
                <span className="text-dashboard-muted text-sm">{metric.label}</span>
                <span className="text-2xl font-semibold mt-1">{metric.value}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Utilization Trends</h3>
            <div className="h-[300px] flex items-center justify-center text-dashboard-muted">
              Chart Placeholder
            </div>
          </Card>
          <Card className="bg-dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="h-[300px] flex items-center justify-center text-dashboard-muted">
              Chart Placeholder
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
