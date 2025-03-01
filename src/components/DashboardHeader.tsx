
import { Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DashboardHeader = () => {
  return (
    <header className="px-6 h-[73px] flex justify-between items-center bg-[#14294B]">
      <div className="flex items-center space-x-3">
        <img 
          src="/lovable-uploads/9c9cf929-efe0-4eae-8878-4f85be2b59dd.png" 
          alt="Mayo Clinic Logo" 
          className="h-[3.6rem]"
        />
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 p-0 rounded-full focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:ring-0 data-[state=open]:outline-none">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F8963A]">
                <span className="text-sm font-medium text-[#012D5A]">JD</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            alignOffset={0}
            className="w-[200px] bg-[#526189] text-white"
            sideOffset={8}
          >
            <DropdownMenuItem className="focus:bg-[#3E4F7C] hover:bg-[#3E4F7C] focus:text-white hover:text-white">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-[#3E4F7C] hover:bg-[#3E4F7C] focus:text-white hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
