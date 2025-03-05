
import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricData } from "@/utils/mockDataGenerator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { getMockRobotTypes } from "@/utils/mockDataGenerator";

interface MetricCardProps {
  metric: MetricData;
  onMetricClick: (metricId: string) => void;
  selectedRobotTypes: string[];
}

const getMaxValueForMetric = (metric: MetricData) => {
  if (!metric.hourlyData) return 100;
  
  if (metric.id === "error-rate" || metric.id === "downtime") {
    return 100;
  }
  
  const maxValue = Math.max(...metric.hourlyData.map((data) => data.value));
  return Math.ceil(maxValue);
};

const getYAxisFormatter = (metricId: string) => {
  switch (metricId) {
    case "mission-time":
      return (value: number) => `${value}h`;
    case "utilization":
    case "downtime":
    case "error-rate":
      return (value: number) => `${value}%`;
    case "completed-missions":
      return (value: number) => `${value}/h`;
    default:
      return (value: number) => `${value}`;
  }
};

const getMetricColor = (metricId: string) => {
  switch (metricId) {
    case "utilization":
      return "#F9A251";
    case "mission-time":
      return "#B9C6EA";
    case "miles-saved":
      return "#51D7F9";
    case "hours-saved":
      return "#2FD96D";
    case "completed-missions":
      return "#D789FB";
    case "downtime":
      return "#F9CF51";
    case "error-rate":
      return "#F96751";
    default:
      return "#0057B8";
  }
};

// Mock data for mission types - in a real app, this would come from your data source
const getMissionTypeData = (metricId: string, robotType: string) => {
  // This is just sample data - replace with real data in a production app
  const baseValues: Record<string, number> = {
    "Injection Mold": 158,
    "Thermoform": 120,
    "RM Delivery": 187,
    "WIP Transfer": 48
  };
  
  // Scale values based on metric type
  let multiplier = 1;
  if (metricId === "miles-saved") multiplier = 0.1;
  if (metricId === "hours-saved") multiplier = 0.5;
  if (metricId === "error-rate") multiplier = 0.05;
  if (metricId === "downtime") multiplier = 0.2;
  if (metricId === "mission-time") multiplier = 0.3;
  
  // Generate random mini chart data
  const generateMiniChartData = () => {
    return Array.from({ length: 10 }, () => ({
      value: Math.floor(Math.random() * 20) + 1
    }));
  };
  
  return Object.entries(baseValues).map(([name, value]) => ({
    name,
    value: Math.round(value * multiplier * (1 + (Math.random() * 0.4 - 0.2))),
    miniChartData: generateMiniChartData()
  }));
};

export const MetricCard = ({ metric, onMetricClick, selectedRobotTypes }: MetricCardProps) => {
  const yAxisFormatter = getYAxisFormatter(metric.id);
  const maxValue = getMaxValueForMetric(metric);
  const metricColor = getMetricColor(metric.id);
  const isMobile = useIsMobile();

  const chartHeight = isMobile ? 77 : 114;
  const barChartHeight = isMobile ? "110%" : "100%";

  const formatDisplayValue = (value: string): string => {
    if (metric.id === "miles-saved" && value.includes("miles")) {
      return value.replace(" miles", "m");
    }
    if (metric.id === "completed-missions" && value.includes("/ hour")) {
      return value.replace("/ hour", "/h");
    }
    if (metric.id === "completed-missions" && value.includes(" /h")) {
      return value.replace(" /h", "/h");
    }
    return value;
  };

  // Get mission types based on selected robot types
  const missionTypes = getMissionTypeData(metric.id, selectedRobotTypes[0] || "All");
  const showDetailedView = true; // You might want to control this with a state or prop

  return (
    <Card
      className={`bg-mayo-card backdrop-blur-md border-white/10 cursor-pointer hover:bg-[#14294B] transition-colors text-white ${isMobile ? 'p-1' : 'p-3'}`}
      onClick={() => onMetricClick(metric.id)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <Popover>
            <PopoverTrigger asChild>
              <span 
                className={`${isMobile ? 'text-[13px] max-w-[85px]' : 'text-[17px] max-w-[200px]'} truncate`} 
                style={{ color: metricColor }}
              >
                {metric.label}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 text-xs" side="top">
              {metric.label}
            </PopoverContent>
          </Popover>
          <span className={`${isMobile ? 'text-[15px]' : 'text-[19px]'} font-semibold`} style={{ color: metricColor }}>
            {formatDisplayValue(metric.value)}
          </span>
        </div>
        
        {!showDetailedView ? (
          <div style={{ height: `${chartHeight}px` }} className="mt-1">
            <ResponsiveContainer width="100%" height={barChartHeight}>
              <BarChart 
                data={metric.hourlyData} 
                margin={{ 
                  left: isMobile ? 5 : -4,
                  right: isMobile ? 2 : 8, 
                  top: 8, 
                  bottom: 0 
                }}
              >
                <XAxis 
                  dataKey="hour" 
                  interval={isMobile ? 5 : 3} 
                  tick={{ fontSize: isMobile ? 7 : 9, fill: "rgba(255, 255, 255, 0.8)" }}
                  stroke="rgba(255, 255, 255, 0.2)" 
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 7 : 9, fill: "rgba(255, 255, 255, 0.8)" }}
                  stroke="rgba(255, 255, 255, 0.2)"
                  domain={[0, maxValue]}
                  tickFormatter={yAxisFormatter}
                  width={isMobile ? 20 : 30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(1, 45, 90, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: isMobile ? "8px" : "11px"
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    const roundedValue = Math.round(value * 10) / 10;
                    if (metric.id === "error-rate" || metric.id === "downtime") {
                      return [`${roundedValue}%`, metric.label];
                    }
                    return [yAxisFormatter(roundedValue), metric.label];
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={metricColor}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="mt-3">
            {missionTypes.map((missionType, index) => (
              <div key={index} className="flex items-center justify-between mb-3 last:mb-0">
                <span className="text-white text-sm truncate max-w-[110px]">{missionType.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[17px] font-medium" style={{ color: metricColor }}>
                    {missionType.value}
                  </span>
                  <div className="w-[80px] h-[24px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={missionType.miniChartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Bar dataKey="value" fill={metricColor} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
