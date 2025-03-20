
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Define the lab report structure
export interface LabReport {
  PII: {
    Name: string;
    DOB: string;
    Age: string;
    Sex: string;
    Fasting: string;
    "Patient ID": string;
    FemalePhase: string | null;
  };
  LR_Dates: {
    "Date Collected": string;
    "Date Received": string;
    "Date Reported": string;
  };
  LR_Ref: {
    "Specimen Number": string;
    "Requisition Number": string;
    "Lab Reference ID": string;
    "Report Status": string;
    "Fasting Flag": string;
  };
  Lab_Info: {
    "org.name": string;
    "department name": string;
    address: string;
    phone: string;
    fax: string;
    "Ordering Physician": string;
  };
  Results: Array<{
    name: string;
    min_score: number;
    max_score: number;
    group_score_ranges: Array<{
      color: string;
      min: number;
      max: number;
    }>;
    results: Array<{
      N: string;
      V: number | null;
      U: string | null;
      D: string | null;
      color: string;
      score: number;
      range: {
        name: string;
        min: number | null;
        max: number | null;
        score: number;
        sex?: string;
      } | null;
    }>;
    score: number;
    color: string;
  }>;
}

// Bucket name where we'll store lab reports
const BUCKET_NAME = 'lab-reports';

/**
 * Upload a lab report to Supabase Storage
 * @param patientId The patient's ID
 * @param reportData The complete lab report data
 * @returns The path to the stored file or null if upload failed
 */
export const uploadLabReport = async (patientId: string, reportData: LabReport): Promise<string | null> => {
  try {
    // Create a unique filename using patient ID and timestamp
    const filename = `${patientId}_${Date.now()}.json`;
    const filePath = `${patientId}/${filename}`;
    
    // Convert report data to JSON string
    const fileData = JSON.stringify(reportData, null, 2);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileData, {
        contentType: 'application/json',
        cacheControl: '3600',
      });
    
    if (error) {
      console.error('Error uploading lab report:', error);
      toast({
        title: 'Upload Error',
        description: 'Failed to upload lab report. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
    
    return data.path;
  } catch (error) {
    console.error('Exception during lab report upload:', error);
    toast({
      title: 'Upload Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * Get a lab report from Supabase Storage
 * @param filePath The path to the stored file
 * @returns The lab report data or null if retrieval failed
 */
export const getLabReport = async (filePath: string): Promise<LabReport | null> => {
  try {
    // Download the file from Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(filePath);
    
    if (error) {
      console.error('Error downloading lab report:', error);
      toast({
        title: 'Retrieval Error',
        description: 'Failed to retrieve lab report. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
    
    // Parse the JSON data
    const text = await data.text();
    return JSON.parse(text) as LabReport;
  } catch (error) {
    console.error('Exception during lab report retrieval:', error);
    toast({
      title: 'Retrieval Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
    return null;
  }
};

/**
 * List all lab reports for a patient
 * @param patientId The patient's ID
 * @returns Array of file paths or empty array if listing failed
 */
export const listPatientLabReports = async (patientId: string): Promise<string[]> => {
  try {
    // List files in the patient's folder
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(patientId, {
        sortBy: { column: 'name', order: 'desc' },
      });
    
    if (error) {
      console.error('Error listing lab reports:', error);
      toast({
        title: 'Listing Error',
        description: 'Failed to list lab reports. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
    
    // Return the file paths
    return data.map(file => `${patientId}/${file.name}`);
  } catch (error) {
    console.error('Exception during lab reports listing:', error);
    toast({
      title: 'Listing Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
    return [];
  }
};

// Sample lab report data
export const sampleLabReport: LabReport = {
  "PII": {
    "Name": "JOHNSON,HOLLY A",
    "DOB": "01/02/1980",
    "Age": "45",
    "Sex": "F",
    "Fasting": "Y",
    "Patient ID": "31909",
    "FemalePhase": null
  },
  "LR_Dates": {
    "Date Collected": "01/16/2025 08:29",
    "Date Received": "01/16/2025 08:31",
    "Date Reported": "01/18/2025 02:06"
  },
  "LR_Ref": {
    "Specimen Number": "TZ782653U",
    "Requisition Number": "0040585",
    "Lab Reference ID": "5Q1F385650",
    "Report Status": "FINAL/SEE REPORT",
    "Fasting Flag": "YES"
  },
  "Lab_Info": {
    "org.name": "MyQuest™",
    "department name": "FAMILY PRACTICE ASSOCIATES",
    "address": "326 S LINE AVE\nINVERNESS, FL 34452-4606",
    "phone": "(352) 726-5533",
    "fax": "(352) 726-5818",
    "Ordering Physician": "MOOSE.CORINNE"
  },
  "Results": [
    {
      "name": "HEART",
      "min_score": 0,
      "max_score": 8,
      "group_score_ranges": [
        {
          "color": "RED",
          "min": 0,
          "max": 1.99
        },
        {
          "color": "YELLOW",
          "min": 2,
          "max": 5
        },
        {
          "color": "GREEN",
          "min": 6,
          "max": 8
        }
      ],
      "results": [
        {
          "N": "CHOLESTEROL, TOTAL",
          "V": 186,
          "U": "mg/dL",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 150,
            "max": 225,
            "score": 1
          }
        },
        {
          "N": "HDL CHOLESTEROL",
          "V": 51,
          "U": "mg/dL",
          "D": "01/16/2025",
          "color": "low_yellow",
          "score": 0.5,
          "range": {
            "name": "low_yellow",
            "min": 38,
            "max": 54.99,
            "score": 0.5
          }
        },
        {
          "N": "TRIGLYCERIDES",
          "V": 234,
          "U": "mg/dL",
          "D": "01/16/2025",
          "color": "high_yellow",
          "score": 0.5,
          "range": {
            "name": "high_yellow",
            "min": 125.01,
            "max": 149,
            "score": 0.5
          }
        },
        {
          "N": "LDL-CHOLESTEROL",
          "V": 100,
          "U": "mg/dL (calc)",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 0,
            "max": 125,
            "score": 1
          }
        },
        {
          "N": "CHOL/HDLC RATIO",
          "V": 3.6,
          "U": "(calc)",
          "D": "01/16/2025",
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "NON HDL CHOLESTEROL",
          "V": 135,
          "U": "mg/dL (calc)",
          "D": "01/16/2025",
          "color": "",
          "score": 0,
          "range": null
        }
      ],
      "score": 3.5,
      "color": "YELLOW"
    },
    {
      "name": "HORMONES",
      "min_score": 0,
      "max_score": 20,
      "group_score_ranges": [
        {
          "color": "RED",
          "min": 0,
          "max": 6.66
        },
        {
          "color": "YELLOW",
          "min": 6.67,
          "max": 13.4
        },
        {
          "color": "GREEN",
          "min": 13.41,
          "max": 20
        }
      ],
      "results": [
        {
          "N": "LH",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "FSH",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "Testosterone (TESTO)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "Free Testosterone (FTESTO)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "Sex Horm Binding Glob, Serum (SHBG)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "Insulin-Like Growth Factor I (IGF)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "Cortisol (CORT)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "DHEA-Sulfate (DHEAS)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        },
        {
          "N": "Estradiol (E2)",
          "V": null,
          "U": null,
          "D": null,
          "color": "",
          "score": 0,
          "range": null
        }
      ],
      "score": 0,
      "color": "RED"
    },
    {
      "name": "KIDNEY",
      "min_score": 0,
      "max_score": 5,
      "group_score_ranges": [
        {
          "color": "RED",
          "min": 0,
          "max": 1.66
        },
        {
          "color": "YELLOW",
          "min": 1.67,
          "max": 3.34
        },
        {
          "color": "GREEN",
          "min": 3.35,
          "max": 5
        }
      ],
      "results": [
        {
          "N": "BUN",
          "V": 12,
          "U": "mg/dL",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 10,
            "max": 22,
            "score": 1,
            "sex": "female"
          }
        },
        {
          "N": "Creatinine (CREA)",
          "V": 0.89,
          "U": "mg/dL",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 0.65,
            "max": 0.9,
            "score": 1,
            "sex": "female"
          }
        },
        {
          "N": "eGFR (EGFR)",
          "V": 81,
          "U": "mL/min/1.73m2",
          "D": "01/16/2025",
          "color": "green",
          "score": 2,
          "range": {
            "name": "green",
            "min": 70.01,
            "max": null,
            "score": 2
          }
        },
        {
          "N": "BUN/Creatinine Ratio (BUN/CREA)",
          "V": null,
          "U": "(calc)",
          "D": "01/16/2025",
          "color": "",
          "score": 0,
          "range": null
        }
      ],
      "score": 4,
      "color": "GREEN"
    },
    {
      "name": "LIVER",
      "min_score": 0,
      "max_score": 7,
      "group_score_ranges": [
        {
          "color": "RED",
          "min": 0,
          "max": 2.32
        },
        {
          "color": "YELLOW",
          "min": 2.33,
          "max": 4.66
        },
        {
          "color": "GREEN",
          "min": 4.67,
          "max": 7
        }
      ],
      "results": [
        {
          "N": "Bilirubin, Total (TBIL)",
          "V": 0.5,
          "U": "mg/dL",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 0,
            "max": 0.6,
            "score": 1
          }
        },
        {
          "N": "Alkaline Phosphatase (ALP)",
          "V": 74,
          "U": "U/L",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 39,
            "max": 90,
            "score": 1
          }
        },
        {
          "N": "ALT (SGPT) (ALT)",
          "V": 21,
          "U": "U/L",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 0,
            "max": 25,
            "score": 1,
            "sex": "female"
          }
        },
        {
          "N": "AST (SGOT) (AST)",
          "V": 19,
          "U": "U/L",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 0,
            "max": 25,
            "score": 1
          }
        },
        {
          "N": "Total protein (PROT)",
          "V": 7.3,
          "U": "g/dL",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 6.9,
            "max": 8.5,
            "score": 1
          }
        },
        {
          "N": "Albumin (ALB)",
          "V": 4.5,
          "U": "g/dL",
          "D": "01/16/2025",
          "color": "green",
          "score": 0.5,
          "range": {
            "name": "green",
            "min": 4.3,
            "max": 4.6,
            "score": 0.5,
            "sex": "female"
          }
        },
        {
          "N": "Globulin, Total (GLOB)",
          "V": 2.8,
          "U": "g/dL (calc)",
          "D": "01/16/2025",
          "color": "green",
          "score": 0.5,
          "range": {
            "name": "green",
            "min": 2.4,
            "max": 4.5,
            "score": 0.5
          }
        },
        {
          "N": "A/G Ratio (ALB/GLOB)",
          "V": 1.6,
          "U": "(calc)",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 1.5,
            "max": 1.8,
            "score": 1
          }
        }
      ],
      "score": 7,
      "color": "GREEN"
    },
    {
      "name": "THYROID",
      "min_score": 0,
      "max_score": 5,
      "group_score_ranges": [
        {
          "color": "RED",
          "min": 0,
          "max": 1.66
        },
        {
          "color": "YELLOW",
          "min": 1.67,
          "max": 3.34
        },
        {
          "color": "GREEN",
          "min": 3.35,
          "max": 5
        }
      ],
      "results": [
        {
          "N": "TSH",
          "V": 0.86,
          "U": "mIU/L",
          "D": "01/16/2025",
          "color": "green",
          "score": 1,
          "range": {
            "name": "green",
            "min": 1.2,
            "max": 3,
            "score": 1
          }
        }
      ],
      "score": 1,
      "color": "YELLOW"
    }
  ]
};

/**
 * Utility function to upload the sample lab report
 * Can be called from the browser console for testing
 */
export const uploadSampleLabReport = async (): Promise<void> => {
  const patientId = sampleLabReport.PII["Patient ID"];
  const result = await uploadLabReport(patientId, sampleLabReport);
  
  if (result) {
    console.log('Sample lab report uploaded successfully:', result);
    toast({
      title: 'Upload Successful',
      description: 'Sample lab report has been uploaded.',
    });
  }
};
