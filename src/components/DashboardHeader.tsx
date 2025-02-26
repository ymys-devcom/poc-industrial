
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
          <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 3L7 12V28L20 37L33 28V12L20 3ZM20 6.5L30 13.75V26.25L20 33.5L10 26.25V13.75L20 6.5Z" fill="white"/>
            <path d="M13 14V25L20 29.5L27 25V14L20 9.5L13 14ZM16 16.5L20 14L24 16.5V22.5L20 25L16 22.5V16.5Z" fill="white"/>
            <path d="M28.5 18.5V22.5L33 20.5L28.5 18.5ZM11.5 18.5L7 20.5L11.5 22.5V18.5Z" fill="white"/>
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
            <Button variant="ghost" className="relative h-9 w-9 p-0 rounded-full focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:ring-0 data-[state=open]:outline-none">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#F8963A]">
                <span className="text-sm font-medium text-[#012D5A]">JD</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-popover">
            <DropdownMenuItem className="focus:bg-accent hover:bg-accent">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-accent hover:bg-accent">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
