import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricCard } from "@/components/MetricCard";
import { Footer } from "@/components/Footer";
import { generateMockDataForRange, getMockRobotTypes, mockHospitals, type MockData } from "@/utils/mockDataGenerator";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotTypes, setSelectedRobotTypes] = useState(["All"]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [mockData, setMockData] = useState(generateMockDataForRange("Last 7 Days"));
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(["all"]);
  const navigate = useNavigate();

  const handleHospitalChange = (hospital: string) => {
    setSelectedHospital(hospital);
    setSelectedRobotTypes(["All"]);
    setMockData(generateMockDataForRange(dateRange));
  };

  const handleRobotTypeChange = (robotType: string) => {
    if (robotType === "All") {
      setSelectedRobotTypes(["All"]);
    } else {
      setSelectedRobotTypes((prev) => {
        const newSelection = prev.filter(type => type !== "All");
        if (prev.includes(robotType)) {
          const result = newSelection.filter((type) => type !== robotType);
          return result.length === 0 ? ["All"] : result;
        }
        return [...newSelection, robotType];
      });
    }
  };

  const removeRobotType = (robotType: string) => {
    if (robotType === "All") return;
    setSelectedRobotTypes((prev) => {
      const result = prev.filter((type) => type !== robotType);
      return result.length === 0 ? ["All"] : result;
    });
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setDate({ from: undefined, to: undefined });
    setMockData(generateMockDataForRange(range));
  };

  const handleCustomDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDate(range);
    if (range.from && range.to) {
      setDateRange("Custom");
      setMockData(generateMockDataForRange("Custom", range));
    }
  };

  const handleMetricClick = (metricId: string) => {
    const params = new URLSearchParams();
    params.append('facility', selectedHospital);
    
    params.append('dateRange', dateRange);
    
    if (date.from) {
      params.append('dateFrom', date.from.toISOString());
    }
    
    if (date.to) {
      params.append('dateTo', date.to.toISOString());
    }
    
    selectedRobotTypes.forEach(type => {
      params.append('robotType', type);
    });
    
    navigate(`/metrics/${metricId}?${params.toString()}`);
  };

  const handleMetricToggle = (metricId: string) => {
    setVisibleMetrics((prev) => {
      if (metricId === "all") {
        return ["all"];
      }
      
      const withoutAll = prev.filter(id => id !== "all");
      
      const newSelection = prev.includes(metricId)
        ? withoutAll.filter(id => id !== metricId)
        : [...withoutAll, metricId];
      
      if (newSelection.length === 0) {
        return ["all"];
      }
      
      return newSelection;
    });
  };

  const aggregateData = () => {
    if (selectedRobotTypes.length === 0) {
      return { metrics: [] };
    }

    const hospitals = selectedHospital === "All"
      ? mockHospitals.filter(h => h !== "All")
      : [selectedHospital];

    const robotTypes = selectedRobotTypes.includes("All")
      ? getMockRobotTypes(hospitals[0]).filter(type => type !== "All")
      : selectedRobotTypes;

    const firstHospitalData = mockData[hospitals[0]]?.[robotTypes[0]];
    if (!firstHospitalData) return { metrics: [] };

    return {
      metrics: firstHospitalData.metrics.map((metric) => {
        const aggregatedHourlyData = metric.hourlyData.map((hourData) => {
          let totalValue = 0;
          let count = 0;

          hospitals.forEach(hospital => {
            robotTypes.forEach(robotType => {
              const value = mockData[hospital]?.[robotType]?.metrics
                .find(m => m.id === metric.id)
                ?.hourlyData.find(h => h.hour === hourData.hour)?.value;
              
              if (typeof value === 'number') {
                totalValue += value;
                count++;
              }
            });
          });

          const average = count > 0 ? totalValue / count : 0;
          return {
            ...hourData,
            value: metric.id === "error-rate" ? Math.min(average, 5) : Math.min(average, 100),
          };
        });

        let totalCurrentValue = 0;
        let valueCount = 0;

        if (metric.id === "mission-time") {
          const sum = aggregatedHourlyData.reduce((acc, curr) => acc + curr.value, 0);
          totalCurrentValue = sum;
          valueCount = 1;
        } else {
          hospitals.forEach(hospital => {
            robotTypes.forEach(robotType => {
              const robotMetric = mockData[hospital]?.[robotType]?.metrics.find(m => m.id === metric.id);
              if (robotMetric) {
                const value = Number(robotMetric.value.replace(/[^0-9.]/g, ""));
                if (!isNaN(value)) {
                  totalCurrentValue += value;
                  valueCount++;
                }
              }
            });
          });
        }

        const averageCurrentValue = valueCount > 0 ? totalCurrentValue / valueCount : 0;

        let valueString;
        if (metric.id === "miles-saved") {
          valueString = `${Math.round(averageCurrentValue)}m`;
        } else if (metric.value.includes("%")) {
          valueString = `${Math.round(averageCurrentValue)}%`;
        } else if (metric.id === "completed-missions") {
          valueString = `${Math.round(averageCurrentValue)}/h`;
        } else if (metric.id === "mission-time") {
          valueString = `${Math.round(averageCurrentValue)}h`;
        } else if (metric.id === "hours-saved") {
          valueString = `${Math.round(averageCurrentValue)}h`;
        } else {
          valueString = `${Math.round(averageCurrentValue)}`;
        }

        return {
          ...metric,
          value: valueString,
          hourlyData: aggregatedHourlyData,
        };
      }),
    };
  };

  const currentData = aggregateData();
  
  const filteredMetrics = visibleMetrics.includes("all") 
    ? currentData.metrics 
    : currentData.metrics.filter(metric => visibleMetrics.includes(metric.id));

  const metricOptions = [
    { id: "all", label: "All Metrics" },
    { id: "utilization", label: "Utilization" },
    { id: "mission-time", label: "Mission Time" },
    { id: "miles-saved", label: "Miles Saved" },
    { id: "hours-saved", label: "Hours Saved" },
    { id: "completed-missions", label: "Completed Missions" },
    { id: "error-rate", label: "Error Rate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F3366] to-[rgba(31,51,102,0.5)] flex flex-col overflow-hidden">
      <DashboardHeader />
      <main className="p-6 flex-grow overflow-y-auto overflow-x-hidden">
        <DashboardFilters
          selectedHospital={selectedHospital}
          selectedRobotTypes={selectedRobotTypes}
          dateRange={dateRange}
          date={date}
          onHospitalChange={handleHospitalChange}
          onRobotTypeChange={handleRobotTypeChange}
          onRemoveRobotType={removeRobotType}
          onDateRangeChange={handleDateRangeChange}
          onCustomDateChange={handleCustomDateChange}
          visibleMetrics={visibleMetrics}
          onMetricToggle={handleMetricToggle}
          metricOptions={metricOptions}
          isMobile={isMobile}
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 mt-6">
          {filteredMetrics.filter(metric => metric.id !== "downtime").map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              onMetricClick={handleMetricClick}
              selectedRobotTypes={selectedRobotTypes}
            />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
