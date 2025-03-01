
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
  
  const [mockData, setMockData] = useState(() => 
    generateMockDataForRange(dateRange));

  useEffect(() => {
    if (hospitalFromUrl && mockHospitals.includes(hospitalFromUrl)) {
      setSelectedHospital(hospitalFromUrl);
    }
  }, [hospitalFromUrl]);
  
  useEffect(() => {
    // Update mock data when date range or custom date changes
    if (date.from && date.to) {
      setMockData(generateMockDataForRange("Custom Range", date));
    } else {
      setMockData(generateMockDataForRange(dateRange));
    }
  }, [dateRange, date]);

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

  // Get relevant hospitals based on selection
  const relevantHospitals = useMemo(() => {
    return selectedHospital === "All" 
      ? mockHospitals.filter(h => h !== "All") 
      : [selectedHospital];
  }, [selectedHospital]);

  // Get relevant robot types based on selection
  const relevantRobotTypes = useMemo(() => {
    return selectedRobotTypes.includes("All")
      ? ["Nurse Bots", "Co-Bots", "Autonomous Beds"]
      : selectedRobotTypes;
  }, [selectedRobotTypes]);

  // Get the metric values for robots in the selected hospital
  const robotMetricValues = useMemo(() => {
    const result = [];
    
    for (const hospital of relevantHospitals) {
      for (const robotType of relevantRobotTypes) {
        const robotData = mockData[hospital]?.[robotType];
        if (robotData) {
          const metric = robotData.metrics.find(m => m.id === metricId);
          if (metric) {
            const numericValue = parseFloat(metric.value.replace(/[^0-9.]/g, ''));
            
            result.push({
              hospital,
              type: robotType,
              metricValue: numericValue,
              displayValue: metric.value,
              total: robotType === "Nurse Bots" ? 95 : 
                     robotType === "Co-Bots" ? 15 : 25,
              active: robotType === "Nurse Bots" ? 90 : 
                      robotType === "Co-Bots" ? 12 : 24,
              isPercentage: metric.value.includes('%')
            });
          }
        }
      }
    }

    // If we're looking at "All" hospital, add the combined values
    if (selectedHospital === "All" && result.length > 0) {
      // Group by robot type
      const byRobotType: Record<string, number[]> = {};
      result.forEach(item => {
        if (!byRobotType[item.type]) {
          byRobotType[item.type] = [];
        }
        byRobotType[item.type].push(item.metricValue);
      });
      
      // Add combined values for each robot type
      Object.entries(byRobotType).forEach(([robotType, values]) => {
        const metricDetails = getMetricDetails(metricId || "");
        const isAccumulative = metricDetails.isAccumulative;
        
        // For accumulative values, sum them up
        // For averages, calculate the mean
        const combValue = isAccumulative 
          ? values.reduce((sum, val) => sum + val, 0)
          : values.reduce((sum, val) => sum + val, 0) / values.length;
          
        result.push({
          hospital: "All",
          type: robotType,
          metricValue: combValue,
          displayValue: metricDetails.isPercentage 
            ? `${Math.round(combValue)}%` 
            : metricId === "miles-saved" 
              ? `${Math.round(combValue)} miles` 
              : `${Math.round(combValue)}${metricId === "hours-saved" ? 'h' : ''}`,
          total: robotType === "Nurse Bots" ? 240 : 
                 robotType === "Co-Bots" ? 34 : 60,
          active: robotType === "Nurse Bots" ? 227 : 
                  robotType === "Co-Bots" ? 28 : 54,
          isPercentage: metricDetails.isPercentage
        });
      });
    }
    
    // If we're looking at multiple robot types, add the combined "All Bots" value
    if ((selectedRobotTypes.includes("All") || selectedRobotTypes.length > 1) && result.length > 0) {
      // Group by hospital
      const byHospital: Record<string, number[]> = {};
      result.forEach(item => {
        if (!byHospital[item.hospital]) {
          byHospital[item.hospital] = [];
        }
        byHospital[item.hospital].push(item.metricValue);
      });
      
      // Add combined values for each hospital
      Object.entries(byHospital).forEach(([hospital, values]) => {
        const metricDetails = getMetricDetails(metricId || "");
        const isAccumulative = metricDetails.isAccumulative;
        
        // For accumulative values, sum them up
        // For averages, calculate the mean
        const combValue = isAccumulative 
          ? values.reduce((sum, val) => sum + val, 0)
          : values.reduce((sum, val) => sum + val, 0) / values.length;
          
        const totalRobots = hospital === "Cannaday building" ? 135 :
                            hospital === "Mayo building and hospital" ? 110 :
                            hospital === "Mangurian building" ? 89 : 334;
                            
        const activeRobots = hospital === "Cannaday building" ? 126 :
                             hospital === "Mayo building and hospital" ? 101 :
                             hospital === "Mangurian building" ? 82 : 309;
                             
        result.push({
          hospital: hospital,
          type: "All Bots",
          metricValue: combValue,
          displayValue: metricDetails.isPercentage 
            ? `${Math.round(combValue)}%` 
            : metricId === "miles-saved" 
              ? `${Math.round(combValue)} miles` 
              : `${Math.round(combValue)}${metricId === "hours-saved" ? 'h' : ''}`,
          total: totalRobots,
          active: activeRobots,
          isPercentage: metricDetails.isPercentage
        });
      });
    }
    
    return result;
  }, [mockData, metricId, relevantHospitals, relevantRobotTypes, selectedHospital, selectedRobotTypes]);

  // Get chart data from hourly data in mockData
  const chartData = useMemo(() => {
    const metricDetails = getMetricDetails(metricId || "");
    
    // For today, show hourly data
    if (dateRange === "Today") {
      // Initialize with 24 hours
      const hourlyData = Array.from({ length: 24 }, (_, hour) => ({
        date: `${hour}:00`,
      }));
      
      // Add data for each robot type
      for (const hospital of relevantHospitals) {
        for (const robotType of relevantRobotTypes) {
          const robotData = mockData[hospital]?.[robotType];
          if (robotData) {
            const metric = robotData.metrics.find(m => m.id === metricId);
            if (metric && metric.hourlyData) {
              metric.hourlyData.forEach((hourData, index) => {
                const key = `${hospital}-${robotType}`;
                hourlyData[index][key] = hourData.value;
              });
            }
          }
        }
      }
      
      // If "All Bots" is selected or multiple robot types are selected, calculate combined values
      if (selectedRobotTypes.includes("All") || selectedRobotTypes.length > 1) {
        hourlyData.forEach((hour, index) => {
          for (const hospital of relevantHospitals) {
            let sum = 0;
            let count = 0;
            
            // Sum up values for all robot types in this hospital for this hour
            for (const robotType of relevantRobotTypes) {
              const key = `${hospital}-${robotType}`;
              if (hour[key]) {
                sum += hour[key];
                count++;
              }
            }
            
            // Calculate average or sum based on metric type
            if (count > 0) {
              const combinedValue = metricDetails.isAccumulative 
                ? sum
                : sum / count;
              
              hour[`${hospital}-All Bots`] = combinedValue;
            }
          }
        });
      }
      
      // If "All" hospital is selected, calculate combined values for each robot type
      if (selectedHospital === "All") {
        hourlyData.forEach((hour, index) => {
          // Include "All Bots" if it's selected
          if (selectedRobotTypes.includes("All")) {
            let sum = 0;
            let count = 0;
            
            // Calculate combined values for all hospitals and all robot types
            for (const hospital of relevantHospitals) {
              for (const robotType of relevantRobotTypes) {
                const key = `${hospital}-${robotType}`;
                if (hour[key]) {
                  sum += hour[key];
                  count++;
                }
              }
            }
            
            // Calculate average or sum based on metric type
            if (count > 0) {
              const combinedValue = metricDetails.isAccumulative 
                ? sum
                : sum / count;
              
              hour[`All-All Bots`] = combinedValue;
            }
          } else {
            // Calculate combined values for each robot type across all hospitals
            for (const robotType of relevantRobotTypes) {
              let sum = 0;
              let count = 0;
              
              // Sum up values for this robot type across all hospitals
              for (const hospital of relevantHospitals) {
                const key = `${hospital}-${robotType}`;
                if (hour[key]) {
                  sum += hour[key];
                  count++;
                }
              }
              
              // Calculate average or sum based on metric type
              if (count > 0) {
                const combinedValue = metricDetails.isAccumulative 
                  ? sum
                  : sum / count;
                
                hour[`All-${robotType}`] = combinedValue;
              }
            }
          }
        });
      }
      
      return hourlyData;
    } 
    // For other time ranges, show daily data
    else {
      // Calculate start date based on date range
      const now = new Date();
      let startDate: Date;
      let endDate = now;
      
      if (date.from && date.to) {
        startDate = date.from;
        endDate = date.to;
      } else {
        switch (dateRange) {
          case "Last 7 Days":
            startDate = subDays(now, 7);
            break;
          case "Last 30 Days":
            startDate = subDays(now, 30);
            break;
          case "Last 90 Days":
            startDate = subDays(now, 90);
            break;
          case "Last 180 Days":
            startDate = subDays(now, 180);
            break;
          default:
            startDate = subDays(now, 7);
        }
      }
      
      // Generate daily data
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      // Initialize with each day
      const dailyData = days.map(day => ({
        date: format(day, 'MMM dd'),
        rawDate: day
      }));
      
      // Adjust values based on days
      dailyData.forEach((day, index) => {
        const dayProgress = index / (dailyData.length - 1);
        
        for (const hospital of relevantHospitals) {
          for (const robotType of relevantRobotTypes) {
            const robotData = mockData[hospital]?.[robotType];
            if (robotData) {
              const metric = robotData.metrics.find(m => m.id === metricId);
              if (metric) {
                const hourlyData = metric.hourlyData;
                
                // Calculate a daily value based on the hourly pattern and the day index
                let dayValue = 0;
                
                if (hourlyData.length > 0) {
                  // Use sin curve to create smooth variation over time
                  const variation = Math
                    .sin((index / (dailyData.length - 1)) * Math.PI * 2)
                    * 0.2;
                  
                  // Take a weighted average of multiple hours to simulate daily value
                  const baseValue = (
                    hourlyData[9].value + 
                    hourlyData[12].value + 
                    hourlyData[15].value
                  ) / 3;
                  
                  dayValue = baseValue * (1 + variation);
                  
                  // For accumulative metrics, scale by days in range
                  if (metricDetails.isAccumulative) {
                    const daysInRange = differenceInDays(endDate, startDate) || 1;
                    dayValue = dayValue * 24 / daysInRange;
                  }
                }
                
                day[`${hospital}-${robotType}`] = dayValue;
              }
            }
          }
        }
        
        // Calculate combined values similar to hourly data
        // For "All Bots" if selected
        if (selectedRobotTypes.includes("All") || selectedRobotTypes.length > 1) {
          for (const hospital of relevantHospitals) {
            let sum = 0;
            let count = 0;
            
            for (const robotType of relevantRobotTypes) {
              const key = `${hospital}-${robotType}`;
              if (day[key]) {
                sum += day[key];
                count++;
              }
            }
            
            if (count > 0) {
              const combinedValue = metricDetails.isAccumulative 
                ? sum
                : sum / count;
              
              day[`${hospital}-All Bots`] = combinedValue;
            }
          }
        }
        
        // For "All" hospital if selected
        if (selectedHospital === "All") {
          if (selectedRobotTypes.includes("All")) {
            let sum = 0;
            let count = 0;
            
            for (const hospital of relevantHospitals) {
              for (const robotType of relevantRobotTypes) {
                const key = `${hospital}-${robotType}`;
                if (day[key]) {
                  sum += day[key];
                  count++;
                }
              }
            }
            
            if (count > 0) {
              const combinedValue = metricDetails.isAccumulative 
                ? sum
                : sum / count;
              
              day[`All-All Bots`] = combinedValue;
            }
          } else {
            for (const robotType of relevantRobotTypes) {
              let sum = 0;
              let count = 0;
              
              for (const hospital of relevantHospitals) {
                const key = `${hospital}-${robotType}`;
                if (day[key]) {
                  sum += day[key];
                  count++;
                }
              }
              
              if (count > 0) {
                const combinedValue = metricDetails.isAccumulative 
                  ? sum
                  : sum / count;
                
                day[`All-${robotType}`] = combinedValue;
              }
            }
          }
        }
      });
      
      return dailyData;
    }
  }, [mockData, metricId, relevantHospitals, relevantRobotTypes, selectedHospital, selectedRobotTypes, dateRange, date]);

  const currentMetricDetails = metricId ? getMetricDetails(metricId) : { title: "Unknown Metric", isPercentage: false, isAccumulative: false };

  // Prepare data series for chart display
  const chartSeries = useMemo(() => {
    const result = [];
    
    // Get all possible keys (hospital-robotType combinations)
    const allKeys = new Set<string>();
    chartData.forEach(dataPoint => {
      Object.keys(dataPoint).forEach(key => {
        if (key !== 'date' && key !== 'rawDate') {
          allKeys.add(key);
        }
      });
    });
    
    // For each key, determine if it should be shown based on selection
    for (const key of allKeys) {
      const [hospital, robotType] = key.split('-');
      
      const shouldShow = 
        (selectedHospital === "All" || selectedHospital === hospital) &&
        (selectedRobotTypes.includes("All") || selectedRobotTypes.includes(robotType));
      
      if (shouldShow) {
        const displayName = selectedHospital === "All" && hospital !== "All"
          ? `${hospital} - ${robotType}`
          : robotType;
          
        result.push({
          key,
          name: displayName,
          color: 
            robotType === "All Bots" ? "#FF9143" :
            robotType === "Nurse Bots" ? "#4CAF50" :
            robotType === "Co-Bots" ? "#2196F3" :
            "#FFC107"
        });
      }
    }
    
    return result;
  }, [chartData, selectedHospital, selectedRobotTypes]);

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
          onDateRangeChange={(range) => {
            setDateRange(range);
            setDate({ from: undefined, to: undefined });
          }}
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
              {robotMetricValues.map((stat) => (
                <div 
                  key={`${stat.hospital}-${stat.type}`} 
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
                      {stat.displayValue}
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
                    {chartSeries.map((series) => (
                      <Line 
                        key={series.key}
                        type="monotone" 
                        name={series.name}
                        dataKey={series.key}
                        stroke={series.color}
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
