
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
    <header className="px-6 py-4 flex justify-between items-center bg-[#012D5A]">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M7 8.5h26M7 31.5h26M13.5 8.5v23M26.5 8.5v23M16.5 8.5L20 31.5M23.5 8.5L20 31.5" stroke="white" strokeWidth="2"/>
            <path d="M7 8.5C7 8.5 10 15.5 20 15.5C30 15.5 33 8.5 33 8.5" stroke="white" strokeWidth="2"/>
            <path d="M7 31.5C7 31.5 10 24.5 20 24.5C30 24.5 33 31.5 33 31.5" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
        <div className="text-left">
          <h1 className="text-white text-lg font-semibold">Mayo Clinic</h1>
          <p className="text-white/80 text-sm">Jacksonville, FL</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <div className="flex h-full w-full items-center justify-center bg-white/10 rounded-full">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-popover">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
