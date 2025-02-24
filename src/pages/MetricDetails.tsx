
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

const MetricDetails = () => {
  const { metricId } = useParams();
  const navigate = useNavigate();

  const getMetricDetails = (id: string) => {
    const metrics: Record<string, { title: string; description: string }> = {
      "utilization": {
        title: "Utilization Rate",
        description: "Detailed analysis of robot utilization patterns and efficiency metrics.",
      },
      "active-time": {
        title: "Active Time",
        description: "Comprehensive breakdown of operational hours and activity periods.",
      },
      "error-rate": {
        title: "Error Rate",
        description: "In-depth analysis of system errors and their frequency.",
      },
      "battery": {
        title: "Battery Health",
        description: "Detailed battery performance metrics and health indicators.",
      },
    };
    return metrics[id] || { title: "Unknown Metric", description: "No details available." };
  };

  const metricDetails = getMetricDetails(metricId || "");

  return (
    <div className="min-h-screen bg-background p-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">{metricDetails.title}</h1>
        <p className="text-muted-foreground mb-6">{metricDetails.description}</p>

        <div className="space-y-6">
          {/* Add more detailed statistics and charts here */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Today's Statistics</h3>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Weekly Trend</h3>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MetricDetails;

