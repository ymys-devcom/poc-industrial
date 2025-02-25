
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

  const generateHourlyActiveTime = (baseTime: number, hospitalMultiplier: number) => {
    // Create a more realistic 24-hour pattern
    return Array.from({ length: 24 }, (_, hour) => {
      // Low activity during night hours (0-5, 22-23)
      const isNightHours = hour <= 5 || hour >= 22;
      // Peak hours during mid-morning and afternoon (9-16)
      const isPeakHours = hour >= 9 && hour <= 16;
      // Moderate activity during transition periods
      const isTransitionHours = (hour > 5 && hour < 9) || (hour > 16 && hour < 22);

      let hourMultiplier;
      if (isNightHours) {
        hourMultiplier = 0.2; // 20% activity during night
      } else if (isPeakHours) {
        hourMultiplier = 1.0; // 100% activity during peak hours
      } else if (isTransitionHours) {
        hourMultiplier = 0.6; // 60% activity during transition periods
      }

      const randomVariation = (Math.random() * 0.2) - 0.1; // ±10% random variation
      const value = Math.round(baseTime * hourMultiplier * (1 + randomVariation) * hospitalMultiplier * multiplier);

      return {
        hour: `${hour}:00`,
        value: clampValue(value, baseTime),
      };
    });
  };

  const generateMetricsForRobot = (
    baseUtilization: number,
    baseActiveTime: number,
    baseErrorRate: number,
    baseBatteryHealth: number,
    hospitalMultiplier: number
  ) => ({
    metrics: [
      {
        label: "Utilization Rate",
        value: `${Math.round(clampValue(baseUtilization * multiplier * hospitalMultiplier, 100))}%`,
        trend: "up" as const,
        id: "utilization",
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.round(clampValue((baseUtilization - 20) * hospitalMultiplier + Math.random() * 30 * multiplier, 100)),
        }))
      },
      {
        label: "Active Time",
        value: `${Math.round(baseActiveTime * multiplier * hospitalMultiplier)} hrs`,
        trend: "up" as const,
        id: "active-time",
        hourlyData: generateHourlyActiveTime(baseActiveTime / 24, hospitalMultiplier)
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
      {
        label: "Battery Health",
        value: `${Math.round(clampValue(baseBatteryHealth * multiplier * (hospitalMultiplier * 0.2 + 0.8), 100))}%`,
        trend: "stable" as const,
        id: "battery",
        hourlyData: Array.from({ length: 24 }, (_, hour) => ({
          hour: `${hour}:00`,
          value: Math.round(clampValue((baseBatteryHealth - 15) * (hospitalMultiplier * 0.2 + 0.8) + Math.random() * 15 * multiplier, 100)),
        }))
      },
    ],
  });

  const generateHospitalData = (hospitalMultiplier: number) => ({
    "Medical Supply Bot": generateMetricsForRobot(88, 1350, 0.3, 94, hospitalMultiplier),
    "Medication Delivery Bot": generateMetricsForRobot(82, 1150, 0.4, 91, hospitalMultiplier),
    "Patient Transport Bot": generateMetricsForRobot(75, 850, 0.3, 98, hospitalMultiplier),
    "Surgical Assistant Pro": generateMetricsForRobot(80, 980, 0.8, 92, hospitalMultiplier),
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
