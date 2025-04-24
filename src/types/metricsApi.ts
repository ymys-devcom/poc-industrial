
export interface MetricsApiResponse {
  name: string;
  unit: string;
  overall: number;
  valuesByMissionTypes: {
    type: string;
    value: number;
  }[];
  chartPointGroups: {
    missionType: string;
    points: {
      date: string;
      value: number;
    }[];
  }[];
}

