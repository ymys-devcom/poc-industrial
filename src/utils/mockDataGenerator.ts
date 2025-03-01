
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

// Consistent seed values for each metric
const METRIC_SEEDS = {
  utilization: 234,
  missionTime: 567,
  downtime: 789,
  errorRate: 901,
  milesSaved: 123,
  hoursSaved: 456,
  completedMissions: 678
};

// Base values for different hospital and robot combinations
const BASE_VALUES = {
  "Cannaday building": {
    "Nurse Bots": {
      utilization: 85,
      missionTime: 2.4,
      downtime: 2,
      errorRate: 1.6,
      milesSaved: 1250,
      hoursSaved: 500,
      completedMissions: 6
    },
    "Co-Bots": {
      utilization: 80,
      missionTime: 2.7,
      downtime: 3,
      errorRate: 1.8,
      milesSaved: 1100,
      hoursSaved: 450,
      completedMissions: 5
    },
    "Autonomous Beds": {
      utilization: 75,
      missionTime: 2.85,
      downtime: 4,
      errorRate: 2.0,
      milesSaved: 950,
      hoursSaved: 400,
      completedMissions: 4
    }
  },
  "Mayo building and hospital": {
    "Nurse Bots": {
      utilization: 83,
      missionTime: 2.5,
      downtime: 2.2,
      errorRate: 1.7,
      milesSaved: 1200,
      hoursSaved: 480,
      completedMissions: 5.8
    },
    "Co-Bots": {
      utilization: 78,
      missionTime: 2.8,
      downtime: 3.2,
      errorRate: 1.9,
      milesSaved: 1050,
      hoursSaved: 430,
      completedMissions: 4.8
    },
    "Autonomous Beds": {
      utilization: 73,
      missionTime: 2.95,
      downtime: 4.2,
      errorRate: 2.1,
      milesSaved: 900,
      hoursSaved: 380,
      completedMissions: 3.8
    }
  },
  "Mangurian building": {
    "Nurse Bots": {
      utilization: 81,
      missionTime: 2.6,
      downtime: 2.4,
      errorRate: 1.8,
      milesSaved: 1150,
      hoursSaved: 460,
      completedMissions: 5.6
    },
    "Co-Bots": {
      utilization: 76,
      missionTime: 2.9,
      downtime: 3.4,
      errorRate: 2.0,
      milesSaved: 1000,
      hoursSaved: 410,
      completedMissions: 4.6
    },
    "Autonomous Beds": {
      utilization: 71,
      missionTime: 3.0,
      downtime: 4.4,
      errorRate: 2.2,
      milesSaved: 850,
      hoursSaved: 360,
      completedMissions: 3.6
    }
  }
};

// Special handling for combined "All Bots" data
const calculateAllBotsValues = (hospital: string) => {
  const robotTypes = Object.keys(BASE_VALUES[hospital]);
  const result: any = {};
  
  Object.keys(BASE_VALUES[hospital][robotTypes[0]]).forEach(metric => {
    // For non-percentage metrics, we sum the values
    if (metric === 'milesSaved' || metric === 'hoursSaved' || metric === 'completedMissions') {
      let sum = 0;
      robotTypes.forEach(robot => {
        sum += BASE_VALUES[hospital][robot][metric];
      });
      result[metric] = sum;
    } 
    // For percentage metrics and mission time, we take a weighted average
    else {
      let sum = 0;
      robotTypes.forEach(robot => {
        sum += BASE_VALUES[hospital][robot][metric];
      });
      result[metric] = sum / robotTypes.length;
    }
  });
  
  return result;
};

// Add "All Bots" calculations for each hospital
Object.keys(BASE_VALUES).forEach(hospital => {
  if (!BASE_VALUES[hospital]['All Bots']) {
    BASE_VALUES[hospital]['All Bots'] = calculateAllBotsValues(hospital);
  }
});

const clampValue = (value: number, max: number): number => {
  return Math.min(Math.max(0, value), max);
};

const generateHourlyPattern = (
  baseValue: number, 
  hospitalMultiplier: number, 
  maxValue: number, 
  timeRangeMultiplier: number = 1,
  seed: number
) => {
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

    // Use a consistent random variation based on hour and seed
    const randomValue = Math.sin(hour * seed * 0.1) * 0.1;
    const value = Math.round(baseValue * hourMultiplier * (1 + randomValue) * hospitalMultiplier * timeRangeMultiplier);

    return {
      hour: `${hour}:00`,
      value: clampValue(value, maxValue),
    };
  });
};

const generateMetricsForRobot = (
  robotType: string,
  hospital: string,
  hospitalMultiplier: number,
  multiplier: number,
  timeRangeMultiplier: number = 1
) => {
  const baseValues = BASE_VALUES[hospital][robotType];
  
  // Generate hourly data for mission time (in hours)
  const missionTimeHourlyData = generateHourlyPattern(
    baseValues.missionTime, 
    hospitalMultiplier, 
    baseValues.missionTime * 2, 
    timeRangeMultiplier,
    METRIC_SEEDS.missionTime
  );
  
  // Calculate average mission time in hours
  const averageMissionTime = missionTimeHourlyData.reduce((sum, hour) => sum + hour.value, 0) / 24;
  
  // For accumulators like miles saved, apply day multiplier for longer time ranges
  const daysMultiplier = timeRangeMultiplier === 0.3 ? 1 : // Today
                        timeRangeMultiplier === 0.7 ? 7 : // Last 7 Days
                        timeRangeMultiplier === 0.9 ? 30 : // Last 30 Days
                        timeRangeMultiplier === 1.0 ? 90 : // Last 90 Days
                        timeRangeMultiplier === 1.1 ? 180 : 7; // Last 180 Days or default
  
  // Calculate the total miles, hours saved and completed missions based on daily rate
  const totalMilesSaved = Math.round(baseValues.milesSaved * multiplier * hospitalMultiplier * daysMultiplier);
  const totalHoursSaved = Math.round(baseValues.hoursSaved * multiplier * hospitalMultiplier * daysMultiplier);
  const totalCompletedMissions = Math.round(baseValues.completedMissions * 24 * multiplier * hospitalMultiplier * daysMultiplier);

  return {
    metrics: [
      {
        label: "Utilization",
        value: `${Math.round(clampValue(baseValues.utilization * multiplier * hospitalMultiplier, 100))}%`,
        trend: "up" as const,
        id: "utilization",
        hourlyData: generateHourlyPattern(
          baseValues.utilization, 
          hospitalMultiplier, 
          100, 
          timeRangeMultiplier,
          METRIC_SEEDS.utilization
        )
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
        value: `${totalMilesSaved} miles`,
        trend: "up" as const,
        id: "miles-saved",
        hourlyData: generateHourlyPattern(
          baseValues.milesSaved / 24, 
          hospitalMultiplier, 
          baseValues.milesSaved, 
          timeRangeMultiplier,
          METRIC_SEEDS.milesSaved
        )
      },
      {
        label: "Hours Saved",
        value: `${totalHoursSaved}h`,
        trend: "up" as const,
        id: "hours-saved",
        hourlyData: generateHourlyPattern(
          baseValues.hoursSaved / 24, 
          hospitalMultiplier, 
          baseValues.hoursSaved, 
          timeRangeMultiplier,
          METRIC_SEEDS.hoursSaved
        )
      },
      {
        label: "Completed Missions",
        value: `${Math.round(baseValues.completedMissions * multiplier * hospitalMultiplier)} / hour`,
        trend: "up" as const,
        id: "completed-missions",
        hourlyData: generateHourlyPattern(
          baseValues.completedMissions, 
          hospitalMultiplier, 
          baseValues.completedMissions * 2, 
          timeRangeMultiplier,
          METRIC_SEEDS.completedMissions
        )
      },
      {
        label: "Downtime",
        value: `${Math.round(clampValue(baseValues.downtime * multiplier * hospitalMultiplier, 100))}%`,
        trend: "down" as const,
        id: "downtime",
        hourlyData: generateHourlyPattern(
          baseValues.downtime, 
          hospitalMultiplier, 
          100, 
          timeRangeMultiplier,
          METRIC_SEEDS.downtime
        )
      },
      {
        label: "Error Rate",
        value: `${clampValue(baseValues.errorRate * multiplier * hospitalMultiplier, 5).toFixed(1)}%`,
        trend: "down" as const,
        id: "error-rate",
        hourlyData: Array.from({ length: 24 }, (_, hour) => {
          // Create deterministic "random" errors based on hour and seed
          const value = clampValue(Math.abs(Math.sin(hour * METRIC_SEEDS.errorRate * 0.1)) * baseValues.errorRate * multiplier, 5);
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

const generateHospitalData = (hospital: string, multiplier: number, timeRangeMultiplier: number = 1) => {
  const hospitalMultiplier = hospital === "Cannaday building" ? 1.2 :
                             hospital === "Mayo building and hospital" ? 1.0 :
                             hospital === "Mangurian building" ? 0.8 : 1.0;
  
  const result: HospitalData = {};
  
  // Generate data for each robot type in this hospital
  Object.keys(BASE_VALUES[hospital]).forEach(robotType => {
    result[robotType] = generateMetricsForRobot(robotType, hospital, hospitalMultiplier, multiplier, timeRangeMultiplier);
  });
  
  return result;
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

  const result: MockData = {};
  
  // Generate data for each hospital
  Object.keys(BASE_VALUES).forEach(hospital => {
    result[hospital] = generateHospitalData(hospital, multiplier, timeRangeMultiplier);
  });

  return result;
};

export const mockHospitals = ["All", "Cannaday building", "Mayo building and hospital", "Mangurian building"];

export const getMockRobotTypes = (hospital: string) => {
  return ["All", "Nurse Bots", "Co-Bots", "Autonomous Beds"];
};
