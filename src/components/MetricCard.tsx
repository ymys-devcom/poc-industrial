
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

export const MetricCard = ({ metric, onMetricClick }: MetricCardProps) => {
  const yAxisFormatter = getYAxisFormatter(metric.id);
  const maxValue = getMaxValueForMetric(metric);
  const metricColor = getMetricColor(metric.id);

  return (
    <Card
      className="bg-mayo-card backdrop-blur-md border-white/10 p-3 cursor-pointer hover:bg-[#14294B] transition-colors text-white"
      onClick={() => onMetricClick(metric.id)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm" style={{ color: metricColor }}>{metric.label}</span>
          <span className="text-lg font-semibold" style={{ color: metricColor }}>{metric.value}</span>
        </div>
        <div className="h-[120px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metric.hourlyData} margin={{ left: -4, right: 8, top: 8, bottom: 0 }}>
              <XAxis 
                dataKey="hour" 
                interval={3} 
                tick={{ fontSize: 9, fill: "rgba(255, 255, 255, 0.8)" }}
                stroke="rgba(255, 255, 255, 0.2)" 
              />
              <YAxis
                tick={{ fontSize: 9, fill: "rgba(255, 255, 255, 0.8)" }}
                stroke="rgba(255, 255, 255, 0.2)"
                domain={[0, maxValue]}
                tickFormatter={yAxisFormatter}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(1, 45, 90, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "11px"
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
      </div>
    </Card>
  );
};
