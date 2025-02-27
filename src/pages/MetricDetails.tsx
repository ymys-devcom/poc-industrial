import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateMockDataForRange, getMockRobotTypes, mockHospitals } from "@/utils/mockDataGenerator";
import { differenceInDays, eachDayOfInterval, format, addDays, subDays, setHours, setMinutes } from "date-fns";

const MetricDetails = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const hospitalFromUrl = queryParams.get('hospital');
  
  const [selectedHospital, setSelectedHospital] = useState(
    hospitalFromUrl || mockHospitals[0]
  );
  
  const [selectedRobotTypes, setSelectedRobotTypes] = useState(["All"]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Effect to update selected hospital when URL changes
  useEffect(() => {
    if (hospitalFromUrl && mockHospitals.includes(hospitalFromUrl)) {
      setSelectedHospital(hospitalFromUrl);
    }
  }, [hospitalFromUrl]);

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
    const hospitalRobotStats = {
      "Cannaday building": [
        { type: "Nurse Bots", active: 90, total: 95 },
        { type: "Co-Bots", active: 12, total: 15 },
        { type: "Autonomous Beds", active: 24, total: 25 },
      ],
      "Mayo building and hospital": [
        { type: "Nurse Bots", active: 75, total: 80 },
        { type: "Co-Bots", active: 8, total: 10 },
        { type: "Autonomous Beds", active: 18, total: 20 },
      ],
      "Mangurian building": [
        { type: "Nurse Bots", active: 62, total: 65 },
        { type: "Co-Bots", active: 8, total: 9 },
        { type: "Autonomous Beds", active: 12, total: 15 },
      ],
      "All": [
        { type: "Nurse Bots", active: 227, total: 240 },
        { type: "Co-Bots", active: 28, total: 34 },
        { type: "Autonomous Beds", active: 54, total: 60 },
      ]
    };

    let stats = hospitalRobotStats[selectedHospital] || hospitalRobotStats["All"];

    if (!selectedRobotTypes.includes("All")) {
      stats = stats.filter(stat => selectedRobotTypes.includes(stat.type));
    }

    if (metricId === "downtime" || metricId === "error-rate") {
      const isAll = selectedHospital === "All";
      return stats.map(stat => ({
        ...stat,
        active: Math.max(0, stat.active - Math.floor(Math.random() * (isAll ? stat.active * 0.1 : stat.active * 0.2)))
      }));
    }
    
    return stats;
  }, [metricId, selectedHospital, selectedRobotTypes]);

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
    
    const baseValues = {
      "Cannaday building": {
        "Nurse Bots": { base: 75, variation: 15 },
        "Co-Bots": { base: 60, variation: 12 },
        "Autonomous Beds": { base: 45, variation: 10 }
      },
      "Mayo building and hospital": {
        "Nurse Bots": { base: 65, variation: 12 },
        "Co-Bots": { base: 50, variation: 10 },
        "Autonomous Beds": { base: 35, variation: 8 }
      },
      "Mangurian building": {
        "Nurse Bots": { base: 55, variation: 10 },
        "Co-Bots": { base: 40, variation: 8 },
        "Autonomous Beds": { base: 25, variation: 6 }
      },
      "All": {
        "Nurse Bots": { base: 85, variation: 15 },
        "Co-Bots": { base: 70, variation: 12 },
        "Autonomous Beds": { base: 55, variation: 10 }
      }
    };

    const errorRateValues = {
      "Cannaday building": {
        "Nurse Bots": { base: 3, variation: 1.5 },
        "Co-Bots": { base: 4, variation: 2 },
        "Autonomous Beds": { base: 4.5, variation: 2.5 }
      },
      "Mayo building and hospital": {
        "Nurse Bots": { base: 2.5, variation: 1.2 },
        "Co-Bots": { base: 3.5, variation: 1.8 },
        "Autonomous Beds": { base: 4, variation: 2 }
      },
      "Mangurian building": {
        "Nurse Bots": { base: 2, variation: 1 },
        "Co-Bots": { base: 3, variation: 1.5 },
        "Autonomous Beds": { base: 3.5, variation: 1.8 }
      },
      "All": {
        "Nurse Bots": { base: 2.5, variation: 1.2 },
        "Co-Bots": { base: 3.5, variation: 1.8 },
        "Autonomous Beds": { base: 4, variation: 2 }
      }
    };
    
    const hospitalKey = selectedHospital;
    const values = metricId === "error-rate" ? errorRateValues[hospitalKey] : baseValues[hospitalKey];

    if (dateRange === "Today") {
      const data = Array.from({ length: 24 }, (_, hour) => {
        const currentHour = setMinutes(setHours(new Date(), hour), 0);
        const hourString = format(currentHour, 'HH:00');
        
        const timeOfDayFactor = hour >= 9 && hour <= 17 ? 1.2 : 
                               (hour >= 6 && hour <= 20 ? 1.0 : 0.6);
        
        const data: Record<string, any> = {
          date: hourString
        };
        
        Object.entries(values).forEach(([robotType, { base, variation }]) => {
          if (selectedRobotTypes.includes("All") || selectedRobotTypes.includes(robotType)) {
            const hourVariation = Math.sin(hour * 0.3 + metricSeed) * (variation * 0.02);
            data[robotType] = Math.max(0, Math.floor(base * timeOfDayFactor * (1 + hourVariation)));
          }
        });
        
        return data;
      });
      return data;
    }

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return days.map((day) => {
      const daysSinceStart = differenceInDays(day, startDate);
      const formattedDate = format(day, 'MMM dd');
      
      const data: Record<string, any> = {
        date: formattedDate
      };
      
      Object.entries(values).forEach(([robotType, { base, variation }]) => {
        if (selectedRobotTypes.includes("All") || selectedRobotTypes.includes(robotType)) {
          const trendFactor = Math.sin(daysSinceStart * 0.1 + metricSeed) * (variation * 0.01);
          const randomVariation = (Math.random() - 0.5) * variation * 0.1;
          data[robotType] = Math.max(0, Math.floor(base * (1 + trendFactor + randomVariation)));
        }
      });
      
      return data;
    });
  };

  const chartData = useMemo(() => generateChartData(), [dateRange, date, metricId, selectedHospital, selectedRobotTypes]);

  const currentMetricDetails = metricId ? getMetricDetails(metricId) : { title: "Unknown Metric" };

  const availableRobotTypes = ["Nurse Bots", "Co-Bots", "Autonomous Beds"];

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
          className="mb-3 mt-5 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="space-y-6">
          <div className="backdrop-blur-md border-white/10 rounded-lg">
            <div className="flex items-center justify-between p-6 pt-0">
              <h1 className="text-2xl font-bold text-white">
                {currentMetricDetails.title}
                {selectedHospital === "All" && " (All Sites)"}
              </h1>
            </div>

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
                        backgroundColor: 'rgba(1, 45, 90, 0.75)', 
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white' 
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ color: 'white' }}
                    />
                    {availableRobotTypes
                      .filter(type => selectedRobotTypes.includes("All") || selectedRobotTypes.includes(type))
                      .map((type, index) => (
                        <Line 
                          key={type}
                          type="monotone" 
                          dataKey={type} 
                          stroke={index === 0 ? "#4CAF50" : index === 1 ? "#2196F3" : "#FFC107"} 
                          strokeWidth={2}
                        />
                    ))}
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
