
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { MetricCard } from "@/components/MetricCard";
import { Footer } from "@/components/Footer";
import { mockHospitals } from "@/utils/mockDataGenerator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { fetchMissionTimeMetrics } from "@/services/metricsApi";
import { format } from "date-fns";

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedHospital, setSelectedHospital] = useState(mockHospitals[0]);
  const [selectedRobotTypes, setSelectedRobotTypes] = useState(["All"]);
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [date, setDate] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const navigate = useNavigate();

  const { data: metricsData, isLoading } = useQuery({
    queryKey: ['missionTimeMetrics', date.from, date.to, dateRange],
    queryFn: async () => {
      const from = date.from || new Date();
      const to = date.to || new Date();
      const daysDiff = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
      return fetchMissionTimeMetrics(
        format(from, 'yyyy-MM-dd'),
        format(to, 'yyyy-MM-dd'),
        daysDiff + 1
      );
    },
    enabled: !!(date.from && date.to)
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
    setDate({ from: undefined, to: undefined });
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

  const metricOptions = [
    { id: "all", label: "All Metrics" },
    { id: "mission-time", label: "Mission Time" },
  ];

  const missionTimeData = metricsData ? {
    id: "mission-time",
    label: "Mission Time",
    value: `${Math.round(metricsData.overall)}h`,
    trend: 0, // Adding the missing trend property
    hourlyData: metricsData.chartPointGroups[0].points.map(point => ({
      hour: format(new Date(point.date), 'MM/dd'),
      value: point.value
    })),
    missionTypes: metricsData.valuesByMissionTypes.map(mt => ({
      name: mt.type,
      value: mt.value,
      miniChartData: metricsData.chartPointGroups
        .find(group => group.missionType === mt.type)?.points
        .map(point => ({ value: point.value })) || []
    }))
  } : null;

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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-3 md:gap-6 mt-6">
          {missionTimeData && !isLoading && (
            <MetricCard
              key={missionTimeData.id}
              metric={missionTimeData}
              onMetricClick={handleMetricClick}
              selectedRobotTypes={selectedRobotTypes}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
