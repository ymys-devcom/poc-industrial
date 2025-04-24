
import { MetricsApiResponse } from "@/types/metricsApi";
import { toast } from "@/components/ui/use-toast";

export const fetchMissionTimeMetric = async (dateFrom: string, dateTo: string, pointsAmount: number) => {
  const url = `https://cr-metrics-api.devcom.com/Metrics/getDetailedInfo?missionTypes=2&missionTypes=3&metricType=1&dateFrom=${dateFrom}&dateTo=${dateTo}&pointsAmount=${pointsAmount}`;
  
  try {
    console.log('Fetching data from:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json() as MetricsApiResponse;
    console.log('Received mission time data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching mission time metric:', error);
    toast({
      title: "Error fetching metrics data",
      description: "Unable to retrieve mission time data. Please try again later.",
      variant: "destructive",
    });
    
    // Return mock data in case of error for better UX
    return {
      name: "Mission Time",
      unit: "h",
      overall: 0,
      valuesByMissionTypes: [],
      chartPointGroups: [{
        missionType: "Error",
        points: []
      }]
    };
  }
};
