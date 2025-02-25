
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
      return (value: number) => `${value}s`;
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
      className="bg-card p-4 cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onMetricClick(metric.id)}
    >
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground text-sm">{metric.label}</span>
          <span className="text-2xl font-semibold">{metric.value}</span>
        </div>
        <div className="h-[200px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metric.hourlyData}>
              <XAxis dataKey="hour" interval={3} tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                domain={[0, maxValue]}
                tickFormatter={yAxisFormatter}
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  if (metric.id === "error-rate" || metric.id === "downtime") {
                    return [`${props.payload.value}%`, metric.label];
                  }
                  return [yAxisFormatter(value), metric.label];
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
                    : "#0ea5e9"
                }
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
