
import { differenceInDays } from "date-fns";

export type MetricData = {
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  id: string;
  hourlyData: Array<{
    hour: string;
    value: number;
    displayValue?: number;
  }>;
};

export type HospitalData = {
  [key: string]: {
    metrics: MetricData[];
  };
};

export type MockData = {
  [key: string]: HospitalData;
};

const clampValue = (value: number, max: number): number => {
  return Math.min(Math.max(0, value), max);
};

const generateHourlyPattern = (baseValue: number, hospitalMultiplier: number, maxValue: number, timeRangeMultiplier: number = 1) => {
  return Array.from({ length: 24 }, (_, hour) => {
    const isNightHours = hour <= 5 || hour >= 22;
    const isPeakHours = hour >= 9 && hour <= 16;
    const isTransitionHours = (hour > 5 && hour < 9) || (hour > 16 && hour < 22);

    let hourMultiplier;
    if (isNightHours) {
      hourMultiplier = 0.2;
    } else if (isPeakHours) {
      hourMultiplier = 1.0;
    } else if (isTransitionHours) {
      hourMultiplier = 0.6;
    }

    const randomVariation = (Math.random() * 0.2) - 0.1;
    const value = Math.round(baseValue * hourMultiplier * (1 + randomVariation) * hospitalMultiplier * timeRangeMultiplier);

    return {
      hour: `${hour}:00`,
      value: clampValue(value, maxValue),
    };
  });
};

const generateMetricsForRobot = (
  baseUtilization: number,
  baseMissionTime: number,
  baseDowntime: number,
  baseErrorRate: number,
  baseMilesSaved: number,
  baseHoursSaved: number,
  baseCompletedMissions: number,
  hospitalMultiplier: number,
  multiplier: number,
  timeRangeMultiplier: number = 1
) => {
  // Generate hourly data for mission time (in hours)
  const missionTimeHourlyData = generateHourlyPattern(baseMissionTime, hospitalMultiplier, baseMissionTime * 2, timeRangeMultiplier);
  
  // Calculate average mission time in hours
  const averageMissionTime = missionTimeHourlyData.reduce((sum, hour) => sum + hour.value, 0) / 24;

  return {
    metrics: [
      {
        label: "Utilization",
        value: `${Math.round(clampValue(baseUtilization * multiplier * hospitalMultiplier * timeRangeMultiplier, 100))}%`,
        trend: "up" as const,
        id: "utilization",
        hourlyData: generateHourlyPattern(baseUtilization, hospitalMultiplier, 100, timeRangeMultiplier)
      },
      {
        label: "Mission Time",
        value: `${averageMissionTime.toFixed(1)}h`,
        trend: "down" as const,
        id: "mission-time",
        hourlyData: missionTimeHourlyData
      },
      {
        label: "Miles Saved",
        value: `${Math.round(baseMilesSaved * multiplier * hospitalMultiplier * timeRangeMultiplier)} miles`,
        trend: "up" as const,
        id: "miles-saved",
        hourlyData: generateHourlyPattern(baseMilesSaved / 24, hospitalMultiplier, baseMilesSaved, timeRangeMultiplier)
      },
      {
        label: "Hours Saved",
        value: `${Math.round(baseHoursSaved * multiplier * hospitalMultiplier * timeRangeMultiplier)}h`,
        trend: "up" as const,
        id: "hours-saved",
        hourlyData: generateHourlyPattern(baseHoursSaved / 24, hospitalMultiplier, baseHoursSaved, timeRangeMultiplier)
      },
      {
        label: "Completed Missions",
        value: `${Math.round(baseCompletedMissions * multiplier * hospitalMultiplier * timeRangeMultiplier)} / hour`,
        trend: "up" as const,
        id: "completed-missions",
        hourlyData: generateHourlyPattern(baseCompletedMissions, hospitalMultiplier, baseCompletedMissions * 2, timeRangeMultiplier)
      },
      {
        label: "Downtime",
        value: `${Math.round(clampValue(baseDowntime * multiplier * hospitalMultiplier * timeRangeMultiplier, 100))}%`,
        trend: "down" as const,
        id: "downtime",
        hourlyData: generateHourlyPattern(baseDowntime, hospitalMultiplier, 100, timeRangeMultiplier)
      },
      {
        label: "Error Rate",
        value: `${clampValue((baseErrorRate * (2 - multiplier)) / hospitalMultiplier, 5).toFixed(1)}%`,
        trend: "down" as const,
        id: "error-rate",
        hourlyData: Array.from({ length: 24 }, (_, hour) => {
          const value = Math.round(clampValue(Math.random() * baseErrorRate * multiplier / hospitalMultiplier, 5));
          return {
            hour: `${hour}:00`,
            value: value,
            displayValue: value
          };
        })
      },
    ],
  };
};

const generateHospitalData = (hospitalMultiplier: number, multiplier: number, timeRangeMultiplier: number = 1) => ({
  "Nurse Bots": generateMetricsForRobot(85, 2.4, 2, 1.6, 1250, 500, 6, hospitalMultiplier, multiplier, timeRangeMultiplier),
  "Co-Bots": generateMetricsForRobot(80, 2.7, 3, 1.8, 1100, 450, 5, hospitalMultiplier, multiplier, timeRangeMultiplier),
  "Autonomous Beds": generateMetricsForRobot(75, 2.85, 4, 2.0, 950, 400, 4, hospitalMultiplier, multiplier, timeRangeMultiplier),
});

export const generateMockDataForRange = (
  range: string,
  customDateRange?: { from: Date | undefined; to: Date | undefined }
): MockData => {
  const getMultiplier = (range: string) => {
    if (customDateRange?.from && customDateRange?.to) {
      const daysDifference = differenceInDays(customDateRange.to, customDateRange.from);
      return 0.85 + (Math.sin(daysDifference * 0.1) * 0.15);
    }

    switch (range) {
      case "Today":
        return 0.85;
      case "Last 7 Days":
        return 0.9;
      case "Last 30 Days":
        return 0.95;
      case "Last 90 Days":
        return 1;
      case "Last 180 Days":
        return 1.05;
      default:
        return 0.9;
    }
  };

  const getTimeRangeMultiplier = (range: string) => {
    switch (range) {
      case "Today":
        return 0.3;
      case "Last 7 Days":
        return 0.7;
      case "Last 30 Days":
        return 0.9;
      case "Last 90 Days":
        return 1;
      case "Last 180 Days":
        return 1.1;
      default:
        return 0.7;
    }
  };

  const multiplier = getMultiplier(range);
  const timeRangeMultiplier = getTimeRangeMultiplier(range);

  return {
    "Cannaday building": generateHospitalData(1.2, multiplier, timeRangeMultiplier),
    "Mayo building and hospital": generateHospitalData(1.0, multiplier, timeRangeMultiplier),
    "Mangurian building": generateHospitalData(0.8, multiplier, timeRangeMultiplier),
  };
};

export const mockHospitals = ["All", "Cannaday building", "Mayo building and hospital", "Mangurian building"];

export const getMockRobotTypes = (hospital: string) => {
  return ["All", "Nurse Bots", "Co-Bots", "Autonomous Beds"];
};
