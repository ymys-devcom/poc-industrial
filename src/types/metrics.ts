
export interface MetricPoint {
  date: string;
  value: number;
}

export interface ChartPointGroup {
  missionType: string;
  points: MetricPoint[];
}

export interface MissionTypeValue {
  type: string;
  value: number;
}

export interface MetricsResponse {
  name: string;
  unit: string;
  overall: number;
  valuesByMissionTypes: MissionTypeValue[];
  chartPointGroups: ChartPointGroup[];
}
