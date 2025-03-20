
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { uploadLabReport, type LabReport } from "@/utils/labReportStorage";
import { createRelationship } from "@/utils/reportTracker";
import { Loader2 } from "lucide-react";

const USER_FILES_BUCKET = "user-files";
const LAB_REPORTS_BUCKET = "lab-reports";

export function LabReportUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload the original file to user-files bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(USER_FILES_BUCKET)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: "Upload Successful",
        description: "File has been uploaded. Processing will start shortly.",
      });

      // For demo purposes, we'll simulate processing by parsing it as a lab report JSON
      // In a real application, you might have a more complex process, potentially server-side
      setIsProcessing(true);
      
      try {
        // Read the uploaded file as JSON (assuming it's already a JSON lab report)
        // In a real app, this might involve OCR, parsing, etc.
        const fileContent = await file.text();
        const labReportData = JSON.parse(fileContent) as LabReport;
        
        // Get patient ID from the lab report
        const patientId = labReportData.PII["Patient ID"];
        
        if (!patientId) {
          throw new Error("Patient ID not found in lab report");
        }
        
        // Upload the processed lab report to lab-reports bucket
        const labReportPath = await uploadLabReport(patientId, labReportData);
        
        if (!labReportPath) {
          throw new Error("Failed to upload processed lab report");
        }
        
        // Create a relationship between the original file and the processed lab report
        const relationshipCreated = await createRelationship(
          filePath,
          USER_FILES_BUCKET,
          labReportPath,
          LAB_REPORTS_BUCKET,
          patientId,
          {
            originalFileName: file.name,
            processingMethod: "direct-json-parse", // In a real app, this might be "ocr", "ai-extraction", etc.
            processingDate: new Date().toISOString(),
          }
        );
        
        if (!relationshipCreated) {
          console.warn("Failed to create relationship between files");
        }
        
        toast({
          title: "Processing Complete",
          description: `Lab report processed and stored for Patient ID: ${patientId}`,
        });
        
        // Reset the form
        setFile(null);
        const fileInput = document.getElementById("file-upload") as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
        
      } catch (processingError) {
        console.error("Error processing lab report:", processingError);
        toast({
          title: "Processing Error",
          description: "Failed to process the uploaded file as a lab report. Please ensure it's in the correct format.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Lab Report</CardTitle>
        <CardDescription>Upload a lab report file to process and store</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            id="file-upload"
            type="file"
            accept=".json,.txt,.pdf" // Add other formats as needed
            onChange={handleFileChange}
            disabled={isUploading || isProcessing}
          />
          {file && (
            <p className="text-sm text-gray-500">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading || isProcessing}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Upload and Process"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
