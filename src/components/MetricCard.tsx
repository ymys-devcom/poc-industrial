
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

interface MetricCardProps {
  metric: MetricData;
  onMetricClick: (metricId: string) => void;
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

export const MetricCard = ({ metric, onMetricClick }: MetricCardProps) => {
  const yAxisFormatter = getYAxisFormatter(metric.id);
  const maxValue = getMaxValueForMetric(metric);

  return (
    <Card
      className="bg-mayo-card backdrop-blur-md border-white/10 p-4 cursor-pointer hover:bg-[#14294B] transition-colors text-white"
      onClick={() => onMetricClick(metric.id)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm">{metric.label}</span>
          <span className="text-2xl font-semibold">{metric.value}</span>
        </div>
        <div className="h-[140px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metric.hourlyData} margin={{ left: -16, right: 8, top: 8, bottom: 0 }}>
              <XAxis 
                dataKey="hour" 
                interval={3} 
                tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.8)" }}
                stroke="rgba(255, 255, 255, 0.2)" 
              />
              <YAxis
                tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.8)" }}
                stroke="rgba(255, 255, 255, 0.2)"
                domain={[0, maxValue]}
                tickFormatter={yAxisFormatter}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(1, 45, 90, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
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
                fill={
                  metric.id === "mission-time"
                    ? "#22c55e"
                    : metric.trend === "down"
                    ? "#ef4444"
                    : metric.trend === "up"
                    ? "#22c55e"
                    : "#0057B8"
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
