import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LabReportUploader } from "@/components/LabReportUploader";
import { getLabReport, listPatientLabReports, type LabReport } from "@/utils/labReportStorage";
import { findByPatientId, type ReportRelationship } from "@/utils/reportTracker";
import { ChevronLeft, FileText, LinkIcon, Calendar, User, UploadCloud } from "lucide-react";

const LabReports = () => {
  const { patientId, reportPath } = useParams<{ patientId: string; reportPath?: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("reports");
  const [labReports, setLabReports] = useState<string[]>([]);
  const [currentReport, setCurrentReport] = useState<LabReport | null>(null);
  const [relationships, setRelationships] = useState<ReportRelationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (patientId) {
        // Fetch all reports for this patient
        const reports = await listPatientLabReports(patientId);
        setLabReports(reports);
        
        // Fetch relationships for this patient
        const rels = await findByPatientId(patientId);
        setRelationships(rels);
        
        // If a report path is specified, load that report
        if (reportPath) {
          const report = await getLabReport(reportPath);
          if (report) {
            setCurrentReport(report);
          }
        } else if (reports.length > 0) {
          // Otherwise load the first report
          const report = await getLabReport(reports[0]);
          if (report) {
            setCurrentReport(report);
          }
        }
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [patientId, reportPath]);

  const handleReportSelect = async (path: string) => {
    navigate(`/lab-reports/${patientId}/${encodeURIComponent(path)}`);
  };

  const handleBack = () => {
    navigate("/");
  };

  const formatDate = (dateStr: string) => {
    try {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Helper function to render metric score color
  const getScoreColorClass = (color: string) => {
    switch (color?.toUpperCase()) {
      case 'RED': return 'bg-red-500';
      case 'YELLOW': return 'bg-yellow-500';
      case 'GREEN': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1F3366] to-[rgba(31,51,102,0.5)] flex flex-col">
      <DashboardHeader />
      <main className="flex-grow p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            className="text-white hover:text-blue-200 hover:bg-blue-900/20"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Lab Reports</CardTitle>
                <CardDescription>
                  {patientId ? `Patient ID: ${patientId}` : 'All Patients'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="reports" className="pt-4">
                    {isLoading ? (
                      <p>Loading reports...</p>
                    ) : labReports.length > 0 ? (
                      <ul className="space-y-2">
                        {labReports.map((reportPath, index) => {
                          const fileName = reportPath.split('/').pop() || '';
                          const timestamp = fileName.split('_')[1]?.split('.')[0];
                          const date = timestamp ? new Date(parseInt(timestamp)) : null;
                          
                          return (
                            <li key={reportPath}>
                              <Button
                                variant="ghost"
                                className={`w-full justify-start text-left ${reportPath === currentReport ? 'bg-blue-100' : ''}`}
                                onClick={() => handleReportSelect(reportPath)}
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                <div className="truncate">
                                  {date ? date.toLocaleDateString() : fileName}
                                </div>
                              </Button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No reports found for this patient.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="upload" className="pt-4">
                    <LabReportUploader />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content Area */}
          <div className="md:col-span-2">
            {currentReport ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{currentReport.PII.Name}</CardTitle>
                      <CardDescription>
                        DOB: {currentReport.PII.DOB} | Age: {currentReport.PII.Age} | Sex: {currentReport.PII.Sex}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div>Collected: {formatDate(currentReport.LR_Dates["Date Collected"])}</div>
                      <div>Reported: {formatDate(currentReport.LR_Dates["Date Reported"])}</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <h3 className="text-lg font-semibold mb-2">Report Summary</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Patient Information</h4>
                      <div className="text-sm">
                        <div>ID: {currentReport.PII["Patient ID"]}</div>
                        <div>Fasting: {currentReport.PII.Fasting === "Y" ? "Yes" : "No"}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Report Information</h4>
                      <div className="text-sm">
                        <div>Specimen #: {currentReport.LR_Ref["Specimen Number"]}</div>
                        <div>Status: {currentReport.LR_Ref["Report Status"]}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-semibold mb-4">Results</h3>
                  
                  <div className="space-y-6">
                    {currentReport.Results.map((group, groupIndex) => (
                      <div key={groupIndex} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{group.name}</h4>
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-2 ${getScoreColorClass(group.color)}`}></div>
                            <span className="text-sm">
                              Score: {group.score} / {group.max_score}
                            </span>
                          </div>
                        </div>
                        
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Test</th>
                              <th className="text-right py-2">Value</th>
                              <th className="text-right py-2">Units</th>
                              <th className="text-right py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.results.map((result, resultIndex) => (
                              <tr key={resultIndex} className="border-b last:border-b-0">
                                <td className="py-2">{result.N}</td>
                                <td className="text-right py-2">{result.V !== null ? result.V : '-'}</td>
                                <td className="text-right py-2">{result.U || '-'}</td>
                                <td className="text-right py-2">{result.D || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                  
                  {/* File Relationships Section */}
                  {relationships.length > 0 && (
                    <>
                      <Separator className="my-6" />
                      <h3 className="text-lg font-semibold mb-4">File Relationships</h3>
                      <div className="space-y-2 text-sm">
                        {relationships.map((rel, index) => (
                          <div key={index} className="border rounded p-3">
                            <div className="flex items-center mb-2">
                              <LinkIcon className="h-4 w-4 mr-2" />
                              <span className="font-medium">Relationship #{index + 1}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>Original File: {rel.originalFileId.split('/').pop()}</div>
                              <div>Bucket: {rel.originalBucket}</div>
                              <div>Created: {formatDate(rel.createdAt)}</div>
                              {rel.metadata?.originalFileName && (
                                <div>Original Name: {rel.metadata.originalFileName}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : activeTab === "upload" ? (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">Upload a Lab Report</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Use the uploader to process and store lab reports.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Report Selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isLoading 
                      ? "Loading reports..." 
                      : labReports.length > 0 
                        ? "Select a report from the list to view details." 
                        : "No reports found for this patient. Upload a new report."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LabReports;
