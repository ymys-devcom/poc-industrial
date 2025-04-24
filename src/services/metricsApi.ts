
import { MetricsResponse } from "@/types/metrics";

const API_BASE_URL = "https://cr-metrics-api.devcom.com";

export const fetchMissionTimeMetrics = async (
  dateFrom: string,
  dateTo: string,
  pointsAmount: number
): Promise<MetricsResponse> => {
  const url = `${API_BASE_URL}/Metrics/getDetailedInfo?missionTypes=2&missionTypes=3&metricType=1&dateFrom=${dateFrom}&dateTo=${dateTo}&pointsAmount=${pointsAmount}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch metrics data');
  }
  
  return response.json();
};
