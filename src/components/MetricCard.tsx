
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
  return Math.max(...metric.hourlyData.map((data) => data.value));
};

export const MetricCard = ({ metric, onMetricClick }: MetricCardProps) => {
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
                domain={[0, metric.id === "active-time" ? getMaxValueForMetric(metric) : 100]}
                tickFormatter={(value) => `${value}${metric.id === "active-time" ? "" : "%"}`}
              />
              <Tooltip
                formatter={(value: number, name: string, props: any) => {
                  if (metric.id === "error-rate") {
                    return [`${props.payload.displayValue}%`, "Error Rate"];
                  }
                  if (metric.id === "active-time") {
                    return [value, "Active Time"];
                  }
                  return [value, name];
                }}
              />
              <Bar
                dataKey="value"
                fill={
                  metric.id === "error-rate"
                    ? "#ef4444"
                    : metric.id === "battery"
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

