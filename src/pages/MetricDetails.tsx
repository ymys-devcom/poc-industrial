import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { Footer } from "@/components/Footer";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateMockDataForRange, getMockRobotTypes, mockHospitals } from "@/utils/mockDataGenerator";
import { differenceInDays, eachDayOfInterval, format, addDays, subDays, setHours, setMinutes } from "date-fns";

interface MetricValue {
  base: number;
  variation: number;
}

interface MetricValues {
  [key: string]: MetricValue;
}

interface HospitalMetricValues {
  [key: string]: {
    [key: string]: MetricValue;
  };
}

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

  useEffect(() => {
    if (hospitalFromUrl && mockHospitals.includes(hospitalFromUrl)) {
      setSelectedHospital(hospitalFromUrl);
    }
  }, [hospitalFromUrl]);

  const getMetricDetails = (id: string) => {
    const metrics: Record<string, { title: string, isPercentage: boolean, isAccumulative: boolean }> = {
      "utilization": {
        title: "Utilization Rate",
        isPercentage: true,
        isAccumulative: false
      },
      "mission-time": {
        title: "Mission Time",
        isPercentage: false,
        isAccumulative: false
      },
      "active-time": {
        title: "Active Time",
        isPercentage: false,
        isAccumulative: false
      },
      "error-rate": {
        title: "Error Rate",
        isPercentage: true,
        isAccumulative: false
      },
      "battery": {
        title: "Battery Health",
        isPercentage: true,
        isAccumulative: false
      },
      "miles-saved": {
        title: "Miles Saved",
        isPercentage: false,
        isAccumulative: true
      },
      "hours-saved": {
        title: "Hours Saved",
        isPercentage: false,
        isAccumulative: true
      },
      "completed-missions": {
        title: "Completed Missions",
        isPercentage: false,
        isAccumulative: true
      },
      "downtime": {
        title: "Downtime",
        isPercentage: true,
        isAccumulative: false
      }
    };
    return metrics[id || ""] || { title: "Unknown Metric", isPercentage: false, isAccumulative: false };
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
        { type: "All Bots", active: 309, total: 334 },
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
        active: stat.type === "Nurse Bots" ? Math.floor(stat.active * 0.95) :
                stat.type === "Co-Bots" ? Math.floor(stat.active * 0.90) :
                stat.type === "Autonomous Beds" ? Math.floor(stat.active * 0.85) :
                Math.floor(stat.active * 0.93)
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

    const metricSeed = metricId === "utilization" ? 10 :
                      metricId === "mission-time" ? 20 :
                      metricId === "active-time" ? 30 :
                      metricId === "error-rate" ? 40 :
                      metricId === "battery" ? 50 :
                      metricId === "miles-saved" ? 60 :
                      metricId === "hours-saved" ? 70 :
                      metricId === "completed-missions" ? 80 :
                      metricId === "downtime" ? 90 : 100;
    
    const baseValues: HospitalMetricValues = {
      "Cannaday building": {
        "All Bots": { base: 85, variation: 15 },
        "Nurse Bots": { base: 75, variation: 15 },
        "Co-Bots": { base: 60, variation: 12 },
        "Autonomous Beds": { base: 45, variation: 10 }
      },
      "Mayo building and hospital": {
        "All Bots": { base: 75, variation: 12 },
        "Nurse Bots": { base: 65, variation: 12 },
        "Co-Bots": { base: 50, variation: 10 },
        "Autonomous Beds": { base: 35, variation: 8 }
      },
      "Mangurian building": {
        "All Bots": { base: 65, variation: 10 },
        "Nurse Bots": { base: 55, variation: 10 },
        "Co-Bots": { base: 40, variation: 8 },
        "Autonomous Beds": { base: 25, variation: 6 }
      },
      "All": {
        "All Bots": { base: 90, variation: 15 },
        "Nurse Bots": { base: 85, variation: 15 },
        "Co-Bots": { base: 70, variation: 12 },
        "Autonomous Beds": { base: 55, variation: 10 }
      }
    };

    const errorRateValues: HospitalMetricValues = {
      "Cannaday building": {
        "All Bots": { base: 3, variation: 1.5 },
        "Nurse Bots": { base: 3, variation: 1.5 },
        "Co-Bots": { base: 4, variation: 2 },
        "Autonomous Beds": { base: 4.5, variation: 2.5 }
      },
      "Mayo building and hospital": {
        "All Bots": { base: 3, variation: 1.5 },
        "Nurse Bots": { base: 2.5, variation: 1.2 },
        "Co-Bots": { base: 3.5, variation: 1.8 },
        "Autonomous Beds": { base: 4, variation: 2 }
      },
      "Mangurian building": {
        "All Bots": { base: 2.5, variation: 1.2 },
        "Nurse Bots": { base: 2, variation: 1 },
        "Co-Bots": { base: 3, variation: 1.5 },
        "Autonomous Beds": { base: 3.5, variation: 1.8 }
      },
      "All": {
        "All Bots": { base: 2.8, variation: 1.2 },
        "Nurse Bots": { base: 2.5, variation: 1.2 },
        "Co-Bots": { base: 3.5, variation: 1.8 },
        "Autonomous Beds": { base: 4, variation: 2 }
      }
    };
    
    const accumulativeValues: HospitalMetricValues = {
      "Cannaday building": {
        "All Bots": { base: 9200, variation: 1500 },
        "Nurse Bots": { base: 5500, variation: 800 },
        "Co-Bots": { base: 1500, variation: 300 },
        "Autonomous Beds": { base: 2200, variation: 400 }
      },
      "Mayo building and hospital": {
        "All Bots": { base: 7800, variation: 1200 },
        "Nurse Bots": { base: 4800, variation: 700 },
        "Co-Bots": { base: 1200, variation: 250 },
        "Autonomous Beds": { base: 1800, variation: 350 }
      },
      "Mangurian building": {
        "All Bots": { base: 6500, variation: 1000 },
        "Nurse Bots": { base: 4000, variation: 600 },
        "Co-Bots": { base: 1000, variation: 200 },
        "Autonomous Beds": { base: 1500, variation: 300 }
      },
      "All": {
        "All Bots": { base: 23500, variation: 3000 },
        "Nurse Bots": { base: 14300, variation: 2000 },
        "Co-Bots": { base: 3700, variation: 700 },
        "Autonomous Beds": { base: 5500, variation: 900 }
      }
    };
    
    const metricDetails = getMetricDetails(metricId || "");
    
    const hospitalKey = selectedHospital as keyof HospitalMetricValues;
    const values: MetricValues = metricId === "error-rate" || metricId === "downtime" 
      ? errorRateValues[hospitalKey] 
      : metricDetails.isAccumulative 
        ? accumulativeValues[hospitalKey]
        : baseValues[hospitalKey];

    if (dateRange === "Today") {
      return Array.from({ length: 24 }, (_, hour) => {
        const currentHour = setMinutes(setHours(new Date(), hour), 0);
        const hourString = format(currentHour, 'HH:00');
        
        const timeOfDayFactor = hour >= 9 && hour <= 17 ? 1.2 : 
                               (hour >= 6 && hour <= 20 ? 1.0 : 0.6);
        
        const data: Record<string, any> = {
          date: hourString
        };
        
        Object.entries(values).forEach(([robotType, { base, variation }]) => {
          if (selectedRobotTypes.includes("All") || selectedRobotTypes.includes(robotType)) {
            const hourVariation = Math.sin((hour + metricSeed) * 0.3) * (variation * 0.02);
            data[robotType] = Math.max(0, Math.floor(base * timeOfDayFactor * (1 + hourVariation)));
          }
        });
        
        return data;
      });
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
          const trendFactor = Math.sin((daysSinceStart + metricSeed) * 0.1) * (variation * 0.01);
          const pseudoRandomVariation = Math.sin((daysSinceStart * metricSeed) * 0.7) * variation * 0.05;
          data[robotType] = Math.max(0, Math.floor(base * (1 + trendFactor + pseudoRandomVariation)));
        }
      });
      
      return data;
    });
  };

  const chartData = useMemo(() => generateChartData(), [dateRange, date, metricId, selectedHospital, selectedRobotTypes]);

  const calculateMetricAveragesOrTotals = () => {
    const metricDetails = getMetricDetails(metricId || "");
    const isAccumulative = metricDetails.isAccumulative;
    const isPercentage = metricDetails.isPercentage;
    
    return robotStats.map(robot => {
      const robotType = robot.type;
      
      let sum = 0;
      let count = 0;
      
      chartData.forEach(dataPoint => {
        if (dataPoint[robotType] !== undefined) {
          sum += dataPoint[robotType];
          count++;
        }
      });
      
      const value = isAccumulative ? sum : (count > 0 ? sum / count : 0);
      
      return {
        ...robot,
        metricValue: value,
        isPercentage
      };
    });
  };

  const robotMetrics = useMemo(() => calculateMetricAveragesOrTotals(), 
    [chartData, robotStats, metricId]);

  const currentMetricDetails = metricId ? getMetricDetails(metricId) : { title: "Unknown Metric", isPercentage: false, isAccumulative: false };

  const availableRobotTypes = ["All Bots", "Nurse Bots", "Co-Bots", "Autonomous Beds"];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1F3366] to-[rgba(31,51,102,0.5)]">
      <DashboardHeader />
      <main className="p-6 flex-1">
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
                {selectedHospital !== "All" 
                  ? ` - ${selectedHospital}` 
                  : " - All Sites"}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 mb-8 px-6">
              {robotMetrics.map((stat) => (
                <div 
                  key={stat.type} 
                  className="bg-mayo-card backdrop-blur-md border-white/10 p-4 rounded-lg w-full md:w-auto md:max-w-[240px] md:flex-1"
                  style={{ minWidth: '150px' }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">{stat.type}</h3>
                    <span className="text-xl font-bold text-white">{stat.total}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2">
                    <p className="text-white/60 text-sm">
                      {currentMetricDetails.isAccumulative ? "Total" : "Average"}
                    </p>
                    <p className="text-4xl font-bold" style={{ color: stat.type === "All Bots" ? "#FF9143" : "#FFFFFF" }}>
                      {stat.isPercentage 
                        ? `${Math.round(stat.metricValue)}%` 
                        : stat.metricValue >= 1000 
                          ? `${(stat.metricValue / 1000).toFixed(1)}k` 
                          : Math.round(stat.metricValue)}
                    </p>
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
                          stroke={type === "All Bots" ? "#FF9143" : index === 1 ? "#4CAF50" : index === 2 ? "#2196F3" : "#FFC107"} 
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
      <Footer />
    </div>
  );
};

export default MetricDetails;
