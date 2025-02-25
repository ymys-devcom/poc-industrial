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
      default:
        return 0.9;
    }
  };

  const multiplier = getMultiplier(range);

  const generateHourlyPattern = (baseValue: number, hospitalMultiplier: number, maxValue: number) => {
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
      const value = Math.round(baseValue * hourMultiplier * (1 + randomVariation) * hospitalMultiplier * multiplier);

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
    hospitalMultiplier: number
  ) => ({
    metrics: [
      {
        label: "Utilization",
        value: `${Math.round(clampValue(baseUtilization * multiplier * hospitalMultiplier, 100))}%`,
        trend: "up" as const,
        id: "utilization",
        hourlyData: generateHourlyPattern(baseUtilization, hospitalMultiplier, 100)
      },
      {
        label: "Mission Time",
        value: `${Math.round(baseMissionTime * multiplier * hospitalMultiplier)} sec`,
        trend: "down" as const,
        id: "mission-time",
        hourlyData: generateHourlyPattern(baseMissionTime / 12, hospitalMultiplier, 3000)
      },
      {
        label: "Miles Saved",
        value: `${Math.round(baseMilesSaved * multiplier * hospitalMultiplier)}`,
        trend: "up" as const,
        id: "miles-saved",
        hourlyData: generateHourlyPattern(baseMilesSaved / 24, hospitalMultiplier, baseMilesSaved)
      },
      {
        label: "Hours Saved",
        value: `${Math.round(baseHoursSaved * multiplier * hospitalMultiplier)}`,
        trend: "up" as const,
        id: "hours-saved",
        hourlyData: generateHourlyPattern(baseHoursSaved / 24, hospitalMultiplier, baseHoursSaved)
      },
      {
        label: "Completed Missions",
        value: `${Math.round(baseCompletedMissions * multiplier * hospitalMultiplier)} / hour`,
        trend: "up" as const,
        id: "completed-missions",
        hourlyData: generateHourlyPattern(baseCompletedMissions, hospitalMultiplier, baseCompletedMissions * 2)
      },
      {
        label: "Downtime",
        value: `${Math.round(clampValue(baseDowntime * multiplier * hospitalMultiplier, 100))}%`,
        trend: "down" as const,
        id: "downtime",
        hourlyData: generateHourlyPattern(baseDowntime, hospitalMultiplier, 100)
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
  });

  const generateHospitalData = (hospitalMultiplier: number) => ({
    "Medical Supply Bot": generateMetricsForRobot(85, 2400, 2, 1.6, 1250, 500, 6, hospitalMultiplier),
    "Medication Delivery Bot": generateMetricsForRobot(80, 2700, 3, 1.8, 1100, 450, 5, hospitalMultiplier),
    "Patient Transport Bot": generateMetricsForRobot(75, 2850, 4, 2.0, 950, 400, 4, hospitalMultiplier),
    "Surgical Assistant Pro": generateMetricsForRobot(70, 3000, 5, 2.2, 800, 350, 3, hospitalMultiplier),
  });

  return {
    "Mayo Clinic - Rochester": generateHospitalData(1.2),
    "Cleveland Clinic": generateHospitalData(1.0),
    "Johns Hopkins Hospital": generateHospitalData(0.8),
  };
};

export const mockHospitals = ["All", "Mayo Clinic - Rochester", "Cleveland Clinic", "Johns Hopkins Hospital"];

export const getMockRobotTypes = (hospital: string) => {
  const robotTypes = Object.keys(generateMockDataForRange("Last 7 Days")[mockHospitals[1]] || {});
  return ["All", ...robotTypes];
};
