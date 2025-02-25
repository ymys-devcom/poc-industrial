
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMockRobotTypes } from "@/utils/mockDataGenerator";
import { differenceInDays, eachDayOfInterval, format } from "date-fns";

const MetricDetails = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState("Mayo Clinic");
  const [selectedRobotTypes, setSelectedRobotTypes] = useState(["All"]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const getMetricDetails = (id: string) => {
    const metrics: Record<string, { title: string; description: string }> = {
      "utilization": {
        title: "Utilization Rate",
        description: "Detailed analysis of robot utilization patterns and efficiency metrics across different robot types.",
      },
      "mission-time": {
        title: "Mission Time",
        description: "Comprehensive breakdown of mission completion times and duration metrics for each robot type.",
      },
      "active-time": {
        title: "Active Time",
        description: "Comprehensive breakdown of operational hours and activity periods for each robot category.",
      },
      "error-rate": {
        title: "Error Rate",
        description: "In-depth analysis of system errors and their frequency across different robot types.",
      },
      "battery": {
        title: "Battery Health",
        description: "Detailed battery performance metrics and health indicators for each robot category.",
      },
      "miles-saved": {
        title: "Miles Saved",
        description: "Analysis of distance savings achieved through robotic automation compared to manual operations.",
      },
      "hours-saved": {
        title: "Hours Saved",
        description: "Measurement of time savings achieved through robotic automation versus traditional methods.",
      },
      "completed-missions": {
        title: "Completed Missions",
        description: "Detailed statistics of successfully completed tasks and missions across robot types.",
      },
      "downtime": {
        title: "Downtime",
        description: "Analysis of non-operational periods and maintenance requirements for each robot type.",
      }
    };
    return metrics[id] || { title: "Unknown Metric", description: "No details available." };
  };

  const metricDetails = getMetricDetails(metricId || "");

  // Mock data for robot types statistics
  const robotStats = [
    { type: "Nurse Bots", active: 90, total: 95 },
    { type: "Co-Bots", active: 15, total: 15 },
    { type: "Autonomous Hospital Beds", active: 24, total: 25 },
  ];

  // Generate chart data based on the selected date range
  const generateChartData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;
    
    // Set dates based on selected range or custom date range
    if (date.from && date.to) {
      startDate = date.from;
      endDate = date.to;
    } else {
      switch (dateRange) {
        case "Today":
          startDate = now;
          break;
        case "Last 7 Days":
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case "Last 30 Days":
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        case "Last 90 Days":
          startDate = new Date(now.setDate(now.getDate() - 90));
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 7));
      }
    }

    // Generate data points for each day in the range
    return eachDayOfInterval({ start: startDate, end: endDate }).map(date => {
      const formattedDate = format(date, 'MMM dd');
      return {
        date: formattedDate,
        "Nurse Bots": Math.floor(Math.random() * 40 + 40),
        "Co-Bots": Math.floor(Math.random() * 30 + 30),
        "Autonomous Hospital Beds": Math.floor(Math.random() * 35 + 35),
      };
    });
  };

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#012D5A] to-[#001F3F]">
      <DashboardHeader />
      <main className="p-6">
        <DashboardFilters
          selectedHospital={selectedHospital}
          selectedRobotTypes={selectedRobotTypes}
          dateRange={dateRange}
          date={date}
          onHospitalChange={setSelectedHospital}
          onRobotTypeChange={(type) => {
            if (type === "All") {
              setSelectedRobotTypes(["All"]);
            } else {
              const newTypes = selectedRobotTypes.includes(type)
                ? selectedRobotTypes.filter(t => t !== type)
                : [...selectedRobotTypes.filter(t => t !== "All"), type];
              setSelectedRobotTypes(newTypes.length ? newTypes : ["All"]);
            }
          }}
          onRemoveRobotType={(type) => {
            const newTypes = selectedRobotTypes.filter(t => t !== type);
            setSelectedRobotTypes(newTypes.length ? newTypes : ["All"]);
          }}
          onDateRangeChange={setDateRange}
          onCustomDateChange={setDate}
        />

        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div className="bg-white/10 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-2 text-white">{metricDetails.title}</h1>
            <p className="text-white/80 mb-6">{metricDetails.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {robotStats.map((stat) => (
                <div key={stat.type} className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">{stat.type}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">{stat.active}</p>
                      <p className="text-white/60 text-sm">Active</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white/80">{stat.total}</p>
                      <p className="text-white/60 text-sm">Total</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white' 
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: 'white' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Nurse Bots" 
                      stroke="#4CAF50" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Co-Bots" 
                      stroke="#2196F3" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Autonomous Hospital Beds" 
                      stroke="#FFC107" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MetricDetails;

