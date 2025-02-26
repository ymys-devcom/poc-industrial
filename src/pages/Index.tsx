
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricCard } from "@/components/MetricCard";
import { generateMockDataForRange, getMockRobotTypes, mockHospitals, type MockData } from "@/utils/mockDataGenerator";

const Index = () => {
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
      setDateRange("Custom Range");
      setMockData(generateMockDataForRange("Custom Range", range));
    }
  };

  const handleMetricClick = (metricId: string) => {
    navigate(`/metrics/${metricId}`);
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
          // Sum up all hourly values for mission time
          const sum = aggregatedHourlyData.reduce((acc, curr) => acc + curr.value, 0);
          totalCurrentValue = sum;
          valueCount = 1; // Set to 1 to avoid division later
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
          valueString = `${Math.round(averageCurrentValue)} miles`;
        } else if (metric.value.includes("%")) {
          valueString = `${Math.round(averageCurrentValue)}%`;
        } else if (metric.id === "completed-missions") {
          valueString = `${Math.round(averageCurrentValue)} / hour`;
        } else if (metric.id === "mission-time") {
          valueString = `${Math.round(averageCurrentValue)}h`;
        } else {
          valueString = `${Math.round(averageCurrentValue)} hrs`;
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1F3366] to-[rgba(31,51,102,0.5)]">
      <DashboardHeader />
      <main className="p-6">
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
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentData.metrics.map((metric) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              onMetricClick={handleMetricClick}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
