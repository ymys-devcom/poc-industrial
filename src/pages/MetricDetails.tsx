
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardFilters } from "@/components/DashboardFilters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { generateMockDataForRange, getMockRobotTypes, mockHospitals } from "@/utils/mockDataGenerator";
import { differenceInDays, eachDayOfInterval, format, addDays, subDays, setHours, setMinutes } from "date-fns";
import { useState, useEffect } from "react";

// Define interfaces for our data structures
interface MetricValue {
  base: number;
  variation: number;
}

interface MetricValues {
  [key: string]: MetricValue;
}

interface HospitalMetricValues {
  [key: string]: {
    [key: string]: MetricValues;
  };
}

interface DateRange {
  from: Date | null;
  to: Date | null;
}

const MetricDetails = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State variables
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedRobotTypes, setSelectedRobotTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [metricData, setMetricData] = useState<HospitalMetricValues | null>(null);

  // Function to generate data based on filters
  const generateData = () => {
    if (!dateRange.from || !dateRange.to) return;

    const newData: HospitalMetricValues = {};
    const allDays = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

    mockHospitals.forEach(hospital => {
      if (!selectedHospital || selectedHospital === hospital) {
        newData[hospital] = {};
        allDays.forEach(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          newData[hospital][dateKey] = {};

          getMockRobotTypes().forEach(robotType => {
            if (selectedRobotTypes.length === 0 || selectedRobotTypes.includes(robotType)) {
              newData[hospital][dateKey][robotType] = generateMockDataForRange();
            }
          });
        });
      }
    });
    setMetricData(newData);
  };

  useEffect(() => {
    generateData();
  }, [selectedHospital, selectedRobotTypes, dateRange]);

  // Prepare chart data
  const chartData = () => {
    if (!metricData || !dateRange.from || !dateRange.to) return [];

    const allDays = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });
    return allDays.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      let total = 0;
      Object.values(metricData).forEach(hospitalData => {
        if (hospitalData[dateKey]) {
          Object.values(hospitalData[dateKey]).forEach(robotData => {
            Object.values(robotData).forEach(metricValue => {
              total += metricValue.base + metricValue.variation;
            });
          });
        }
      });
      return {
        date: dateKey,
        value: total,
      };
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-sm"
          >
            ← Back to Dashboard
          </Button>
          <DashboardFilters 
            selectedHospital={selectedHospital}
            setSelectedHospital={setSelectedHospital}
            selectedRobotTypes={selectedRobotTypes}
            setSelectedRobotTypes={setSelectedRobotTypes}
            dateRange={dateRange}
            setDateRange={setDateRange}
            hospitals={mockHospitals}
            robotTypes={getMockRobotTypes()}
          />
        </div>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Metric Details: {metricId}</CardTitle>
            <CardDescription>
              Detailed view of metric {metricId} over time, filtered by hospital and robot type.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MetricDetails;
