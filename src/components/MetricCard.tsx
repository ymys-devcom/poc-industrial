
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { MetricCardProps } from "@/utils/mockDataGenerator";

export const MetricCard = ({ metric, onMetricClick }: { 
  metric: MetricCardProps; 
  onMetricClick?: (metricId: string) => void;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/metrics/${metric.id}`);
  };

  return (
    <Card 
      className="hover:bg-white/5 transition-colors cursor-pointer" 
      onClick={handleClick}
    >
      <CardContent className="pt-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">{metric.title}</h3>
          <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
        </div>
        
        <div className="h-[100px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metric.hourlyData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4CAF50"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
