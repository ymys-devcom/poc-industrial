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
import { useIsMobile } from "@/hooks/use-mobile";
import { DataTable, RobotData } from "@/components/ui/data-table";

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
  const isMobile = useIsMobile();
  
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
    
    if (metricId === "downtime") {
      navigate("/");
    }
  }, [hospitalFromUrl, metricId, navigate]);

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
      }
    };
    return metrics[id || ""] || { title: "Unknown Metric", isPercentage: false, isAccumulative: false };
  };

  const robotStats = useMemo(() => {
    const hospitalRobotStats = {
      "PolyPhorm Plant": [
        { type: "Injection Mold", active: 90, total: 95 },
        { type: "Thermoform", active: 12, total: 15 },
        { type: "RM Delivery", active: 24, total: 25 },
        { type: "WIPTransport", active: 24, total: 25 },
      ],
      "ThermoMolt Plant": [
        { type: "Injection Mold", active: 75, total: 80 },
        { type: "Thermoform", active: 8, total: 10 },
        { type: "RM Delivery", active: 18, total: 20 },
        { type: "WIPTransport", active: 18, total: 20 },
      ],
      "Mangurian building": [
        { type: "Injection Mold", active: 62, total: 65 },
        { type: "Thermoform", active: 8, total: 9 },
        { type: "RM Delivery", active: 12, total: 15 },
        { type: "WIPTransport", active: 12, total: 15 },
      ],
      "All": [
        { type: "All Bots", active: 309, total: 334 },
        { type: "Injection Mold", active: 227, total: 240 },
        { type: "Thermoform", active: 28, total: 34 },
        { type: "RM Delivery", active: 54, total: 60 },
        { type: "WIPTransport", active: 54, total: 60 },
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
        active: stat.type === "Injection Mold" ? Math.floor(stat.active * 0.95) :
                stat.type === "Thermoform" ? Math.floor(stat.active * 0.90) :
                stat.type === "RM Delivery" ? Math.floor(stat.active * 0.85) :
                stat.type === "WIPTransport" ? Math.floor(stat.active * 0.85) :
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
      "PolyPhorm Plant": {
        "All Bots": { base: 50, variation: 10 },
        "Injection Mold": { base: 45, variation: 10 },
        "Thermoform": { base: 40, variation: 8 },
        "RM Delivery": { base: 35, variation: 7 },
        "WIPTransport": { base: 35, variation: 7 }
      },
      "ThermoMolt Plant": {
        "All Bots": { base: 45, variation: 10 },
        "Injection Mold": { base: 40, variation: 8 },
        "Thermoform": { base: 35, variation: 7 },
        "RM Delivery": { base: 30, variation: 6 },
        "WIPTransport": { base: 30, variation: 6 }
      },
      "Mangurian building": {
        "All Bots": { base: 40, variation: 8 },
        "Injection Mold": { base: 35, variation: 7 },
        "Thermoform": { base: 30, variation: 6 },
        "RM Delivery": { base: 25, variation: 5 },
        "WIPTransport": { base: 25, variation: 5 }
      },
      "All": {
        "All Bots": { base: 50, variation: 10 },
        "Injection Mold": { base: 45, variation: 10 },
        "Thermoform": { base: 40, variation: 8 },
        "RM Delivery": { base: 35, variation: 7 },
        "WIPTransport": { base: 35, variation: 7 }
      }
    };

    const errorRateValues: HospitalMetricValues = {
      "PolyPhorm Plant": {
        "All Bots": { base: 3, variation: 1.5 },
        "Injection Mold": { base: 3, variation: 1.5 },
        "Thermoform": { base: 4, variation: 2 },
        "RM Delivery": { base: 4.5, variation: 2.5 },
        "WIPTransport": { base: 4.5, variation: 2.5 }
      },
      "ThermoMolt Plant": {
        "All Bots": { base: 3, variation: 1.5 },
        "Injection Mold": { base: 2.5, variation: 1.2 },
        "Thermoform": { base: 3.5, variation: 1.8 },
        "RM Delivery": { base: 4, variation: 2 },
        "WIPTransport": { base: 4, variation: 2 }
      },
      "Mangurian building": {
        "All Bots": { base: 2.5, variation: 1.2 },
        "Injection Mold": { base: 2, variation: 1 },
        "Thermoform": { base: 3, variation: 1.5 },
        "RM Delivery": { base: 3.5, variation: 1.8 },
        "WIPTransport": { base: 3.5, variation: 1.8 }
      },
      "All": {
        "All Bots": { base: 2.8, variation: 1.2 },
        "Injection Mold": { base: 2.5, variation: 1.2 },
        "Thermoform": { base: 3.5, variation: 1.8 },
        "RM Delivery": { base: 4, variation: 2 },
        "WIPTransport": { base: 4, variation: 2 }
      }
    };
    
    const accumulativeValues: HospitalMetricValues = {
      "PolyPhorm Plant": {
        "All Bots": { base: 920, variation: 150 },
        "Injection Mold": { base: 550, variation: 80 },
        "Thermoform": { base: 150, variation: 30 },
        "RM Delivery": { base: 220, variation: 40 },
        "WIPTransport": { base: 220, variation: 40 }
      },
      "ThermoMolt Plant": {
        "All Bots": { base: 780, variation: 120 },
        "Injection Mold": { base: 480, variation: 70 },
        "Thermoform": { base: 120, variation: 25 },
        "RM Delivery": { base: 180, variation: 35 },
        "WIPTransport": { base: 180, variation: 35 }
      },
      "Mangurian building": {
        "All Bots": { base: 650, variation: 100 },
        "Injection Mold": { base: 400, variation: 60 },
        "Thermoform": { base: 100, variation: 20 },
        "RM Delivery": { base: 150, variation: 30 },
        "WIPTransport": { base: 150, variation: 30 }
      },
      "All": {
        "All Bots": { base: 935, variation: 150 },
        "Injection Mold": { base: 643, variation: 90 },
        "Thermoform": { base: 370, variation: 70 },
        "RM Delivery": { base: 550, variation: 90 },
        "WIPTransport": { base: 550, variation: 90 }
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
            let value = Math.max(0, Math.floor(base * timeOfDayFactor * (1 + hourVariation)));
            
            if (metricDetails.isPercentage && metricId !== "error-rate" && metricId !== "downtime") {
              value = Math.min(value, 100);
            }
            
            data[robotType] = value;
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
          let value = Math.max(0, Math.floor(base * (1 + trendFactor + pseudoRandomVariation)));
          
          if (metricDetails.isPercentage && metricId !== "error-rate" && metricId !== "downtime") {
            value = Math.min(value, 100);
          }
          
          data[robotType] = value;
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
      
      let value = isAccumulative ? sum : (count > 0 ? sum / count : 0);
      
      if (isPercentage && metricId !== "error-rate" && metricId !== "downtime") {
        value = Math.min(value, 100);
      }
      
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

  const availableRobotTypes = ["All Bots", "Injection Mold", "Thermoform", "RM Delivery", "WIPTransport"];

  const formatYAxisValue = (value: number): string => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  const generateRobotData = (): RobotData[] => {
    const metricDetails = getMetricDetails(metricId || "");
    const isPercentage = metricDetails.isPercentage;
    
    if (!selectedRobotTypes.includes("All") && selectedRobotTypes.length === 0) {
      return [];
    }
    
    const generateSerial = (type: string, index: number): string => {
      const prefix = type === "Injection Mold" ? "IM" : 
                    type === "Thermoform" ? "TF" : 
                    type === "RM Delivery" ? "RMD" : 
                    type === "WIPTransport" ? "WIP" : "BOT";
      return `${prefix}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    };
    
    const types = selectedRobotTypes.includes("All") 
      ? ["Injection Mold", "Thermoform", "RM Delivery", "WIPTransport"]
      : selectedRobotTypes;
    
    const facilitiesToUse = selectedHospital === "All" 
      ? mockHospitals.filter(h => h !== "All") 
      : [selectedHospital];
    
    let allRobots: RobotData[] = [];
    
    facilitiesToUse.forEach(facility => {
      types.forEach((type, typeIndex) => {
        const robotMetric = robotMetrics.find(r => r.type === type);
        let metricValue = robotMetric ? robotMetric.metricValue : 0;
        
        const variation = (Math.random() * 0.2) - 0.1;
        metricValue = Math.round(metricValue * (1 + variation));
        
        if (isPercentage && metricId !== "error-rate" && metricId !== "downtime") {
          metricValue = Math.min(metricValue, 100);
        }
        
        const serialNumber = generateSerial(type, typeIndex);
        
        const isOnline = !((typeIndex) % 5 === 0);
        
        allRobots.push({
          id: `${facility}-${type}-0`,
          serialNumber: serialNumber,
          missionType: type,
          metricValue,
          isOnline,
          facility
        });
      });
    });
    
    if (allRobots.length > 6) {
      allRobots = allRobots.slice(0, 6);
    }
    
    return allRobots;
  };

  const robotData = useMemo(() => generateRobotData(), [metricId, selectedRobotTypes, selectedHospital, robotMetrics]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1F3366] to-[rgba(31,51,102,0.5)]">
      <DashboardHeader />
      <main className={`px-6 pb-6 ${isMobile ? 'pt-[10px]' : 'pt-6'} flex-1 overflow-auto`}>
        {isMobile && (
          <h1 className="text-xl font-bold text-white flex items-center mb-[10px]">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="p-1 mr-2 text-white hover:bg-white/10"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" style={{ strokeWidth: 2 }} />
            </Button>
            {currentMetricDetails.title}
          </h1>
        )}
        
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

        {!isMobile && (
          <Button 
            variant="ghost-compact" 
            onClick={() => navigate("/")}
            className="mb-1 mt-5 text-white hover:bg-white/10 px-1"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        )}

        <div className="space-y-6">
          <div className="backdrop-blur-md border-white/10 rounded-lg">
            <div className="flex items-center justify-between pb-4">
              {!isMobile && (
                <h1 className="text-2xl font-bold text-white flex items-center">
                  {currentMetricDetails.title}
                  {selectedHospital !== "All" 
                    ? ` - ${selectedHospital}` 
                    : " - All Facilities"}
                </h1>
              )}
            </div>

          <div className="flex flex-row flex-wrap gap-3 mb-8">
            {robotMetrics.map((stat) => (
              <div 
                key={stat.type} 
                className="bg-mayo-card backdrop-blur-md border-white/10 p-3 rounded-lg max-w-[180px] w-[calc(50%-0.375rem)]"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold text-white truncate" title={stat.type}>{stat.type}</h3>
                  <span className="text-base font-semibold text-gray-400">{stat.total}</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <p className="text-white/60 text-xs">
                    {currentMetricDetails.isAccumulative ? "Total" : "Average"}
                  </p>
                  <p className="text-2xl md:text-3xl font-bold" style={{ color: stat.type === "All Bots" ? "#FF9143" : "#FFFFFF" }}>
                    {stat.isPercentage 
                      ? `${Math.round(stat.metricValue)}%` 
                      : Math.round(stat.metricValue)}
                  </p>
                </div>
              </div>
            ))}
          </div>

            <div className="bg-mayo-card backdrop-blur-md border-white/10 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Over Time</h3>
              <div className={`${isMobile ? 'h-[221px]' : 'h-[292px]'}`}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={chartData}
                    margin={{ left: 0, right: 10, top: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: 'rgba(255,255,255,0.5)' }}
                      width={40}
                      tickFormatter={formatYAxisValue}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(1, 45, 90, 0.75)', 
                        border: 'none',
                        borderRadius: '4px',
                        color: 'white' 
                      }}
                      formatter={(value: any, name: string) => {
                        let formattedValue = value;
                        if (value >= 1000) {
                          formattedValue = `${(value / 1000).toFixed(1)}k`;
                        }
                        
                        return [Math.round(value).toString(), name];
                      }}
                      labelFormatter={(label) => {
                        return `Date: ${label}`;
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ 
                        color: 'white',
                        fontSize: isMobile ? '10px' : '12px'
                      }}
                    />
                    {availableRobotTypes
                      .filter(type => selectedRobotTypes.includes("All") || selectedRobotTypes.includes(type))
                      .map((type, index) => (
                        <Line 
                          key={type}
                          type="monotone" 
                          dataKey={type} 
                          stroke={type === "All Bots" ? "#FF9143" : index === 1 ? "#4CAF50" : index === 2 ? "#2196F3" : index === 3 ? "#FFC107" : "#E91E63"} 
                          strokeWidth={2}
                          name={type}
                        />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <DataTable 
              data={robotData} 
              metricName={currentMetricDetails.title}
              isPercentage={currentMetricDetails.isPercentage}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MetricDetails;
