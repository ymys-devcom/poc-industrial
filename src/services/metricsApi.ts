
import { MetricsApiResponse } from "@/types/metricsApi";

export const fetchMissionTimeMetric = async (dateFrom: string, dateTo: string, pointsAmount: number) => {
  const url = `https://cr-metrics-api.devcom.com/Metrics/getDetailedInfo?missionTypes=2&missionTypes=3&metricType=1&dateFrom=${dateFrom}&dateTo=${dateTo}&pointsAmount=${pointsAmount}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json() as MetricsApiResponse;
  } catch (error) {
    console.error('Error fetching mission time metric:', error);
    throw error;
  }
};
