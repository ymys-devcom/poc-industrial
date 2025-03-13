
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
  
  if (metric.id === "error-rate") {
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
    case "error-rate":
      return "#F96751";
    default:
      return "#0057B8";
  }
};

const getMetricBaseValue = (metricId: string, robotType: string) => {
  const baseValues = {
    "utilization": {
      "Injection Mold": 45,
      "Thermoform": 40,
      "RM Delivery": 35,
      "WIP Transport": 35,
      "All Bots": 50
    },
    "mission-time": {
      "Injection Mold": 2.4,
      "Thermoform": 2.7,
      "RM Delivery": 2.85,
      "WIP Transport": 2.85,
      "All Bots": 2.5
    },
    "miles-saved": {
      "Injection Mold": 125,
      "Thermoform": 110,
      "RM Delivery": 95,
      "WIP Transport": 95,
      "All Bots": 120
    },
    "hours-saved": {
      "Injection Mold": 85,
      "Thermoform": 75,
      "RM Delivery": 65,
      "WIP Transport": 65,
      "All Bots": 80
    },
    "completed-missions": {
      "Injection Mold": 6,
      "Thermoform": 5,
      "RM Delivery": 4,
      "WIP Transport": 4,
      "All Bots": 5
    },
    "error-rate": {
      "Injection Mold": 2.5,
      "Thermoform": 3.5,
      "RM Delivery": 4,
      "WIP Transport": 4,
      "All Bots": 3
    }
  };
  
  return baseValues[metricId as keyof typeof baseValues]?.[robotType] || 0;
};

const getMissionTypeData = (metricId: string, selectedRobotTypes: string[]) => {
  const generateMiniChartData = () => {
    return Array.from({ length: 25 }, (_, i) => ({
      value: Math.floor(Math.random() * 20) + 1
    }));
  };
  
  let robotTypesToDisplay: string[];
  
  if (selectedRobotTypes.includes("All")) {
    robotTypesToDisplay = ["Injection Mold", "Thermoform", "RM Delivery", "WIP Transport"];
  } else {
    robotTypesToDisplay = [...selectedRobotTypes];
  }
  
  return robotTypesToDisplay.map(type => {
    const baseValue = getMetricBaseValue(metricId, type);
    const randomVariation = (Math.random() * 0.1) - 0.05;
    let value = Math.round(baseValue * (1 + randomVariation));
    
    return {
      name: type,
      value: value,
      miniChartData: generateMiniChartData()
    };
  });
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

  const missionTypes = getMissionTypeData(metric.id, selectedRobotTypes);
  const showDetailedView = true;

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
                className={`${isMobile ? 'text-[16px] flex-1 pr-2 font-semibold' : 'text-[22px] max-w-[200px] font-semibold'} truncate`} 
                style={{ color: metricColor }}
              >
                {metric.label}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2 text-xs" side="top">
              {metric.label}
            </PopoverContent>
          </Popover>
          <span className={`${isMobile ? 'text-[17px] whitespace-nowrap' : 'text-[22px]'} font-semibold`} style={{ color: metricColor }}>
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
                    if (metric.id === "error-rate") {
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
                <span className={`text-white ${isMobile ? 'text-xs' : 'text-sm'} truncate flex-1 max-w-none font-medium`}>
                  {missionType.name}
                </span>
                <div className="flex items-center gap-1 md:gap-3">
                  <span className={`${isMobile ? 'text-[13px]' : 'text-[17px]'} font-medium`} style={{ color: metricColor }}>
                    {metric.id === "utilization" || metric.id === "error-rate" 
                      ? `${missionType.value}%` 
                      : metric.id === "mission-time" || metric.id === "hours-saved" 
                        ? `${missionType.value}h`
                        : metric.id === "miles-saved"
                          ? `${missionType.value}m`
                          : metric.id === "completed-missions"
                            ? `${missionType.value}/h`
                            : missionType.value}
                  </span>
                  <div className={`${isMobile ? 'w-[38px] h-[19px]' : 'w-[80px] h-[24px]'}`}>
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
