
import { MetricsApiResponse } from "@/types/metricsApi";
import { toast } from "@/components/ui/use-toast";
import { format, subDays } from "date-fns";

// Mock data with the same structure as the API would return
const generateMockData = (dateFrom: string, dateTo: string, pointsAmount: number): MetricsApiResponse => {
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate points for the date range
  const thermoformPoints = [];
  const rmDeliveryPoints = [];
  
  for (let i = 0; i < Math.max(pointsAmount, 1); i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + (i * Math.max(Math.floor(daysDiff / pointsAmount), 1)));
    
    thermoformPoints.push({
      date: currentDate.toISOString(),
      value: Math.floor(Math.random() * 800) + 100 // Random value between 100-900
    });
    
    rmDeliveryPoints.push({
      date: currentDate.toISOString(),
      value: Math.floor(Math.random() * 500) + 100 // Random value between 100-600
    });
  }
  
  return {
    name: "Mission Time",
    unit: "h",
    overall: 563.33,
    valuesByMissionTypes: [
      { type: "Thermoform", value: 536.67 },
      { type: "RM Delivery", value: 474.07 }
    ],
    chartPointGroups: [
      {
        missionType: "Thermoform",
        points: thermoformPoints
      },
      {
        missionType: "RM Delivery",
        points: rmDeliveryPoints
      }
    ]
  };
};

export const fetchMissionTimeMetric = async (dateFrom: string, dateTo: string, pointsAmount: number) => {
  const url = `https://cr-metrics-api.devcom.com/Metrics/getDetailedInfo?missionTypes=2&missionTypes=3&metricType=1&dateFrom=${dateFrom}&dateTo=${dateTo}&pointsAmount=${pointsAmount}`;
  
  try {
    console.log('Fetching data from:', url);
    console.log(`Date range: ${dateFrom} to ${dateTo} with ${pointsAmount} points`);
    
    // Attempt to fetch from API
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as MetricsApiResponse;
    console.log('Received mission time data:', data);
    
    // Validate the data structure
    if (!data.chartPointGroups || data.chartPointGroups.length === 0) {
      console.warn('Invalid data format: missing chart point groups');
      throw new Error('Invalid data format: missing chart point groups');
    }
    
    if (!data.chartPointGroups[0]?.points || data.chartPointGroups[0].points.length === 0) {
      console.warn('Invalid data format: no points in the first chart group');
      throw new Error('Invalid data format: no points in the first chart group');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching mission time metric:', error);
    toast({
      title: "Using demo data",
      description: "Unable to fetch live data. Displaying demonstration data.",
      variant: "default",
    });
    
    // Return mock data in case of error for better UX
    return generateMockData(dateFrom, dateTo, pointsAmount);
  }
};
