
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

export const DashboardHeader = () => {
  return (
    <header className="px-6 h-[62px] md:h-[73px] flex justify-between items-center bg-[#14294B]">
      <div className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/665baa1d-08bd-45f1-a8cd-acc5a37e2f0e.png" 
          alt="PolyForm Industries Logo" 
          className="h-[2.325rem] md:h-[2.7rem]"
        />
      </div>
      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 md:h-9 md:w-9 p-0 rounded-full focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:ring-0 data-[state=open]:outline-none">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F8963A]">
                  <span className="text-xs md:text-sm font-medium text-[#012D5A]">JD</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              fitToTriggerWidth 
              className="w-[200px] bg-[#526189] text-white"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem className="focus:bg-[#3E4F7C] hover:bg-[#3E4F7C] focus:text-white hover:text-white">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="truncate">Settings</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent 
                  className="bg-[#14294B] text-white border-white/10"
                  side="left"
                >
                  Settings
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuItem className="focus:bg-[#3E4F7C] hover:bg-[#3E4F7C] focus:text-white hover:text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="truncate">Log out</span>
                  </DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent 
                  className="bg-[#14294B] text-white border-white/10"
                  side="left"
                >
                  Log out
                </TooltipContent>
              </Tooltip>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipProvider>
      </div>
    </header>
  );
};
