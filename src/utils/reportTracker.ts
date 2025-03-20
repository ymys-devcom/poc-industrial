
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Interface for tracking relationships
export interface ReportRelationship {
  originalFileId: string;      // ID or path of the original uploaded file
  originalBucket: string;      // Bucket where original file is stored
  parsedReportId: string;      // ID or path of the parsed lab report
  parsedBucket: string;        // Bucket where parsed report is stored
  patientId: string;           // Patient ID from the lab report
  createdAt: string;           // Timestamp when the relationship was created
  metadata?: Record<string, any>; // Optional additional metadata
}

// Bucket name for tracking relationships
const TRACKER_BUCKET = 'report-relationships';
const RELATIONSHIPS_FILE = 'relationships.json';

/**
 * Get all existing relationships
 * @returns Array of report relationships or empty array if none exist
 */
export const getRelationships = async (): Promise<ReportRelationship[]> => {
  try {
    // Check if the relationships file exists
    const { data: fileExists } = await supabase.storage
      .from(TRACKER_BUCKET)
      .list('', { search: RELATIONSHIPS_FILE });
    
    if (!fileExists || fileExists.length === 0) {
      // Create an empty relationships file if it doesn't exist
      await supabase.storage
        .from(TRACKER_BUCKET)
        .upload(RELATIONSHIPS_FILE, JSON.stringify([], null, 2), {
          contentType: 'application/json',
          upsert: true,
        });
      return [];
    }
    
    // Download the relationships file
    const { data, error } = await supabase.storage
      .from(TRACKER_BUCKET)
      .download(RELATIONSHIPS_FILE);
    
    if (error) {
      console.error('Error retrieving relationships:', error);
      return [];
    }
    
    // Parse the JSON data
    const text = await data.text();
    return JSON.parse(text) as ReportRelationship[];
  } catch (error) {
    console.error('Exception during relationship retrieval:', error);
    return [];
  }
};

/**
 * Save all relationships back to storage
 * @param relationships Array of relationships to save
 * @returns true if successful, false otherwise
 */
const saveRelationships = async (relationships: ReportRelationship[]): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(TRACKER_BUCKET)
      .upload(RELATIONSHIPS_FILE, JSON.stringify(relationships, null, 2), {
        contentType: 'application/json',
        upsert: true,
      });
    
    if (error) {
      console.error('Error saving relationships:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception during relationship save:', error);
    return false;
  }
};

/**
 * Create a new relationship between an original file and a parsed report
 * @param originalFileId ID or path of the original uploaded file
 * @param originalBucket Bucket where original file is stored
 * @param parsedReportId ID or path of the parsed lab report
 * @param parsedBucket Bucket where parsed report is stored
 * @param patientId Patient ID from the lab report
 * @param metadata Optional additional metadata
 * @returns true if successful, false otherwise
 */
export const createRelationship = async (
  originalFileId: string,
  originalBucket: string,
  parsedReportId: string,
  parsedBucket: string,
  patientId: string,
  metadata?: Record<string, any>
): Promise<boolean> => {
  try {
    // Get existing relationships
    const relationships = await getRelationships();
    
    // Create new relationship
    const newRelationship: ReportRelationship = {
      originalFileId,
      originalBucket,
      parsedReportId,
      parsedBucket,
      patientId,
      createdAt: new Date().toISOString(),
      metadata,
    };
    
    // Add new relationship
    relationships.push(newRelationship);
    
    // Save updated relationships
    const saved = await saveRelationships(relationships);
    
    if (saved) {
      toast({
        title: 'Relationship Created',
        description: 'File relationship has been tracked successfully.',
      });
      return true;
    } else {
      toast({
        title: 'Tracking Error',
        description: 'Failed to track file relationship.',
        variant: 'destructive',
      });
      return false;
    }
  } catch (error) {
    console.error('Exception during relationship creation:', error);
    toast({
      title: 'Tracking Error',
      description: 'An unexpected error occurred while tracking relationship.',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Find relationships by original file ID
 * @param originalFileId ID or path of the original uploaded file
 * @returns Array of matching relationships or empty array if none found
 */
export const findByOriginalFile = async (originalFileId: string): Promise<ReportRelationship[]> => {
  const relationships = await getRelationships();
  return relationships.filter(rel => rel.originalFileId === originalFileId);
};

/**
 * Find relationships by parsed report ID
 * @param parsedReportId ID or path of the parsed lab report
 * @returns Array of matching relationships or empty array if none found
 */
export const findByParsedReport = async (parsedReportId: string): Promise<ReportRelationship[]> => {
  const relationships = await getRelationships();
  return relationships.filter(rel => rel.parsedReportId === parsedReportId);
};

/**
 * Find relationships by patient ID
 * @param patientId Patient ID
 * @returns Array of matching relationships or empty array if none found
 */
export const findByPatientId = async (patientId: string): Promise<ReportRelationship[]> => {
  const relationships = await getRelationships();
  return relationships.filter(rel => rel.patientId === patientId);
};

/**
 * Delete a relationship by original file ID and parsed report ID
 * @param originalFileId ID or path of the original uploaded file
 * @param parsedReportId ID or path of the parsed lab report
 * @returns true if successful, false otherwise
 */
export const deleteRelationship = async (
  originalFileId: string,
  parsedReportId: string
): Promise<boolean> => {
  try {
    // Get existing relationships
    const relationships = await getRelationships();
    
    // Filter out the relationship to delete
    const filteredRelationships = relationships.filter(
      rel => !(rel.originalFileId === originalFileId && rel.parsedReportId === parsedReportId)
    );
    
    // If no relationships were removed, return false
    if (filteredRelationships.length === relationships.length) {
      return false;
    }
    
    // Save updated relationships
    return await saveRelationships(filteredRelationships);
  } catch (error) {
    console.error('Exception during relationship deletion:', error);
    return false;
  }
};
