
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
    <header className="px-6 py-4 flex justify-between items-center bg-[#14294B]">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.0001 0C13.0726 0 10.2147 0.938383 7.85571 2.69649C5.49667 4.45459 3.7577 6.95345 2.88246 9.87706C2.00722 12.8007 2.03439 15.9399 2.96052 18.8433C3.88665 21.7467 5.66897 24.2112 8.06097 25.9262C8.35923 26.1385 8.75579 26.1657 9.07961 25.9956C9.40343 25.8256 9.60001 25.4871 9.60001 25.12V17.92C9.60001 17.5051 9.78429 17.1068 10.1118 16.8193C10.4393 16.5318 10.8805 16.3703 11.3334 16.3703C11.7863 16.3703 12.2275 16.5318 12.555 16.8193C12.8825 17.1068 13.0667 17.5051 13.0667 17.92V25.12C13.0667 25.4871 13.2633 25.8256 13.5871 25.9956C13.911 26.1657 14.3075 26.1385 14.6058 25.9262C15.3708 25.3894 16.0698 24.7651 16.6933 24.064C17.044 23.6563 17.1648 23.1016 17.0195 22.5812C16.8742 22.0609 16.4783 21.6454 15.9733 21.4773C15.0163 21.1749 14.1821 20.5911 13.5875 19.8057C12.9928 19.0203 12.6685 18.0726 12.6667 17.0987V14.9333C12.6667 14.5185 12.851 14.1202 13.1785 13.8327C13.506 13.5452 13.9471 13.3837 14.4 13.3837C14.8529 13.3837 15.2941 13.5452 15.6216 13.8327C15.9491 14.1202 16.1334 14.5185 16.1334 14.9333V17.0773C16.1334 17.7867 16.4143 18.4671 16.9144 18.9672C17.4145 19.4673 18.0949 19.7483 18.8043 19.7483C19.5137 19.7483 20.1941 19.4673 20.6942 18.9672C21.1943 18.4671 21.4753 17.7867 21.4753 17.0773V14.9333C21.4753 14.5185 21.6596 14.1202 21.9871 13.8327C22.3145 13.5452 22.7557 13.3837 23.2086 13.3837C23.6615 13.3837 24.1027 13.5452 24.4302 13.8327C24.7577 14.1202 24.942 14.5185 24.942 14.9333V17.0987C24.9401 18.0726 24.6159 19.0203 24.0212 19.8057C23.4265 20.5911 22.5923 21.1749 21.6353 21.4773C21.1304 21.6454 20.7344 22.0609 20.5891 22.5812C20.4438 23.1016 20.5647 23.6563 20.9153 24.064C21.5389 24.7651 22.2379 25.3894 23.0028 25.9262C23.3011 26.1385 23.6977 26.1657 24.0215 25.9956C24.3453 25.8256 24.542 25.4871 24.942 25.12V17.92C24.942 17.5051 25.1262 17.1068 25.4537 16.8193C25.7812 16.5318 26.2224 16.3703 26.6753 16.3703C27.1282 16.3703 27.5693 16.5318 27.8968 16.8193C28.2243 17.1068 28.4086 17.5051 28.4086 17.92V25.12C28.4086 25.4871 28.6052 25.8256 28.929 25.9956C29.2529 26.1657 29.6494 26.1385 29.9477 25.9262C32.3397 24.2112 34.122 21.7467 35.0481 18.8433C35.9743 15.9399 36.0014 12.8007 35.1262 9.87706C34.251 6.95345 32.512 4.45459 30.153 2.69649C27.7939 0.938383 24.936 0 22.0086 0H16.0001Z" fill="white"/>
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
