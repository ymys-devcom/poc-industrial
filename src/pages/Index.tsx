
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricCard } from "@/components/MetricCard";
import { Footer } from "@/components/Footer";
import { mockHospitals, getMockRobotTypes } from "@/utils/mockDataGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchMissionTimeMetric } from "@/services/metricsApi";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotTypes, setSelectedRobotTypes] = useState(["All"]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const navigate = useNavigate();

  const { data: missionTimeData, isLoading } = useQuery({
    queryKey: ['missionTime', date.from, date.to],
    queryFn: async () => {
      if (!date.from || !date.to) return null;
      
      const dateFrom = format(date.from, 'yyyy-MM-dd');
      const dateTo = format(date.to, 'yyyy-MM-dd');
      const daysDiff = Math.ceil((date.to.getTime() - date.from.getTime()) / (1000 * 60 * 60 * 24));
      const pointsAmount = daysDiff + 1;
      
      const response = await fetchMissionTimeMetric(dateFrom, dateTo, pointsAmount);
      
      return {
        id: "mission-time",
        label: response.name,
        value: `${response.overall.toFixed(2)}${response.unit}`,
        trend: "up",
        hourlyData: response.chartPointGroups[0].points.map(point => ({
          hour: format(new Date(point.date), 'HH:mm'),
          value: point.value
        })),
        missionTypes: response.valuesByMissionTypes.map(type => ({
          name: type.type,
          value: type.value,
          miniChartData: Array(25).fill(0).map(() => ({
            value: Math.floor(Math.random() * 20) + 1
          }))
        }))
      };
    },
    enabled: !!date.from && !!date.to
  });

  const handleHospitalChange = (hospital: string) => {
    setSelectedHospital(hospital);
    setSelectedRobotTypes(["All"]);
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
    
    const now = new Date();
    let fromDate;
    
    switch (range) {
      case "Today":
        fromDate = now;
        break;
      case "Last 7 Days":
        fromDate = subDays(now, 7);
        break;
      case "Last 30 Days":
        fromDate = subDays(now, 30);
        break;
      case "Last 90 Days":
        fromDate = subDays(now, 90);
        break;
      case "Last 180 Days":
        fromDate = subDays(now, 180);
        break;
      default:
        return;
    }
    
    setDate({ from: fromDate, to: now });
  };

  const handleCustomDateChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDate(range);
    if (range.from && range.to) {
      setDateRange("Custom");
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

  // Commented out other metrics for future use
  /*
  const metricOptions = [
    { id: "all", label: "All Metrics" },
    { id: "utilization", label: "Utilization" },
    { id: "mission-time", label: "Mission Time" },
    { id: "miles-saved", label: "Miles Saved" },
    { id: "hours-saved", label: "Hours Saved" },
    { id: "completed-missions", label: "Completed Missions" },
    { id: "error-rate", label: "Error Rate" },
  ];
  */

  const metricOptions = [
    { id: "all", label: "All Metrics" },
    { id: "mission-time", label: "Mission Time" },
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
          visibleMetrics={["mission-time"]}
          onMetricToggle={() => {}}
          metricOptions={metricOptions}
          isMobile={isMobile}
        />
        <div className="grid grid-cols-1 gap-3 md:gap-6 mt-6">
          {isLoading ? (
            <div className="text-white">Loading mission time data...</div>
          ) : missionTimeData ? (
            <MetricCard
              key={missionTimeData.id}
              metric={missionTimeData}
              onMetricClick={handleMetricClick}
              selectedRobotTypes={selectedRobotTypes}
            />
          ) : (
            <div className="text-white">No mission time data available</div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
