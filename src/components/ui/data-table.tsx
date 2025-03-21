
import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

export interface RobotData {
  id: string;
  serialNumber: string;
  missionType: string;
  metricValue: number | string;
  isOnline: boolean;
  facility: string;
  lastActive?: string;
}

interface DataTableProps {
  data: RobotData[];
  metricName: string;
  isPercentage: boolean;
}

export function DataTable({ data, metricName, isPercentage }: DataTableProps) {
  const isMobile = useIsMobile();

  const tableContent = (
    <Table>
      <TableHeader>
        <TableRow className="border-white/10 bg-white/5">
          <TableHead className="text-white w-1/5">Serial Number</TableHead>
          <TableHead className="text-white w-1/5">Mission Type</TableHead>
          <TableHead className="text-white w-1/5">Facility</TableHead>
          <TableHead className="text-white text-left w-1/5">{metricName}</TableHead>
          <TableHead className="text-white text-left w-1/5">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center text-white/60">
              No robots found
            </TableCell>
          </TableRow>
        ) : (
          data.map((robot) => (
            <TableRow key={robot.id} className="border-white/10 hover:bg-white/5">
              <TableCell className="font-medium text-white/80">
                {robot.serialNumber}
              </TableCell>
              <TableCell className="text-white/80">{robot.missionType}</TableCell>
              <TableCell className="text-white/80">{robot.facility}</TableCell>
              <TableCell className="text-left text-white/80 font-medium">
                {isPercentage ? `${robot.metricValue}%` : robot.metricValue}
              </TableCell>
              <TableCell className="text-left">
                <div className="flex items-center gap-2">
                  {robot.isOnline ? (
                    <>
                      <span className="text-green-400">Online</span>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    </>
                  ) : (
                    <>
                      <span className="text-red-400">Offline</span>
                      <XCircle className="h-4 w-4 text-red-400" />
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="rounded-md border border-white/10 bg-mayo-card backdrop-blur-md overflow-hidden max-w-full">
      {isMobile ? (
        <div className="overflow-x-auto max-w-[100vw]">
          <div className="min-w-[600px]">{tableContent}</div>
        </div>
      ) : (
        tableContent
      )}
    </div>
  );
}
