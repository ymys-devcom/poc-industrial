
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getMockRobotTypes } from "@/utils/mockDataGenerator";
import { differenceInDays, eachDayOfInterval, format, addDays, subDays, setHours, setMinutes } from "date-fns";

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
    const metrics: Record<string, { title: string }> = {
      "utilization": {
        title: "Utilization Rate"
      },
      "mission-time": {
        title: "Mission Time"
      },
      "active-time": {
        title: "Active Time"
      },
      "error-rate": {
        title: "Error Rate"
      },
      "battery": {
        title: "Battery Health"
      },
      "miles-saved": {
        title: "Miles Saved"
      },
      "hours-saved": {
        title: "Hours Saved"
      },
      "completed-missions": {
        title: "Completed Missions"
      },
      "downtime": {
        title: "Downtime"
      }
    };
    return metrics[id] || { title: "Unknown Metric" };
  };

  const robotStats = useMemo(() => {
    const baseStats = [
      { type: "Nurse Bots", active: 90, total: 95 },
      { type: "Co-Bots", active: 15, total: 15 },
      { type: "Autonomous Beds", active: 24, total: 25 },
    ];

    if (metricId === "downtime" || metricId === "error-rate") {
      return baseStats.map(stat => ({
        ...stat,
        active: Math.max(0, stat.active - Math.floor(Math.random() * 10))
      }));
    }
    return baseStats;
  }, [metricId]);

  const generateChartData = () => {
    const now = new Date();
    let startDate: Date;
    let endDate = now;
    
    if (date.from && date.to) {
      startDate = date.from;
      endDate = date.to;
    } else {
      switch (dateRange) {
        case "Today":
          startDate = now;
          endDate = now;
          break;
        case "Last 7 Days":
          startDate = subDays(now, 7);
          break;
        case "Last 30 Days":
          startDate = subDays(now, 30);
          break;
        case "Last 90 Days":
          startDate = subDays(now, 90);
          break;
        default:
          startDate = subDays(now, 7);
      }
    }

    const metricSeed = metricId?.length || 1;

    if (dateRange === "Today") {
      return Array.from({ length: 24 }, (_, hour) => {
        const currentHour = setMinutes(setHours(now, hour), 0);
        const hourString = format(currentHour, 'HH:00');
        
        const timeOfDayFactor = hour >= 9 && hour <= 17 ? 1.2 : 
                               (hour >= 6 && hour <= 20 ? 1.0 : 0.6);
        
        const nurseBotBase = metricId === "error-rate" ? 20 : 60;
        const coBotBase = metricId === "error-rate" ? 15 : 45;
        const bedBase = metricId === "error-rate" ? 18 : 50;

        const variation = Math.sin(hour * 0.3 + metricSeed) * 0.2;

        return {
          date: hourString,
          "Nurse Bots": Math.max(0, Math.floor(nurseBotBase * timeOfDayFactor * (1 + variation))),
          "Co-Bots": Math.max(0, Math.floor(coBotBase * timeOfDayFactor * (1 + variation))),
          "Autonomous Beds": Math.max(0, Math.floor(bedBase * timeOfDayFactor * (1 + variation))),
        };
      });
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map((day, index) => {
      const daysSinceStart = differenceInDays(day, startDate);
      const formattedDate = format(day, 'MMM dd');
      
      const trendFactor = Math.sin(daysSinceStart * 0.1 + metricSeed) * 0.2;
      
      const nurseBotBase = metricId === "error-rate" ? 20 : 60;
      const coBotBase = metricId === "error-rate" ? 15 : 45;
      const bedBase = metricId === "error-rate" ? 18 : 50;

      return {
        date: formattedDate,
        "Nurse Bots": Math.max(0, Math.floor(nurseBotBase * (1 + trendFactor) + (Math.random() * 10))),
        "Co-Bots": Math.max(0, Math.floor(coBotBase * (1 + trendFactor) + (Math.random() * 8))),
        "Autonomous Beds": Math.max(0, Math.floor(bedBase * (1 + trendFactor) + (Math.random() * 9))),
      };
    });
  };

  const chartData = useMemo(() => generateChartData(), [dateRange, date, metricId]);

  const currentMetricDetails = metricId ? getMetricDetails(metricId) : { title: "Unknown Metric" };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F3366] to-[rgba(31,51,102,0.5)]">
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
          className="mb-3 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div className="backdrop-blur-md border-white/10 rounded-lg">
            <h1 className="text-2xl font-bold text-white p-6 pt-0">{currentMetricDetails.title}</h1>

            <div className="flex flex-wrap gap-4 mb-8 px-6">
              {robotStats.map((stat) => (
                <div 
                  key={stat.type} 
                  className="bg-mayo-card backdrop-blur-md border-white/10 p-4 rounded-lg w-full md:w-auto md:max-w-[240px] md:flex-1"
                  style={{ minWidth: '150px' }}
                >
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

            <div className="bg-mayo-card backdrop-blur-md border-white/10 rounded-lg p-4 mx-6 mb-6">
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
                        backgroundColor: 'rgba(1, 45, 90, 0.81)', 
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
                      dataKey="Autonomous Beds" 
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

