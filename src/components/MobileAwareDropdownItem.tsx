
import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface MobileAwareDropdownItemProps 
  extends React.ComponentPropsWithoutRef<typeof DropdownMenuItem> {
  tooltipContent?: React.ReactNode;
  truncateText?: boolean;
}

export const MobileAwareDropdownItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuItem>,
  MobileAwareDropdownItemProps
>(({ 
  className, 
  children, 
  tooltipContent, 
  truncateText = true,
  ...props 
}, ref) => {
  const isMobile = useIsMobile();
  
  if (isMobile || !tooltipContent) {
    return (
      <DropdownMenuItem
        ref={ref}
        className={className}
        {...props}
      >
        {truncateText && typeof children === 'string' ? (
          <span className="truncate">{children}</span>
        ) : children}
      </DropdownMenuItem>
    );
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenuItem
          ref={ref}
          className={cn(
            "overflow-hidden",
            className
          )}
          {...props}
        >
          {truncateText && typeof children === 'string' ? (
            <span className="truncate">{children}</span>
          ) : children}
        </DropdownMenuItem>
      </TooltipTrigger>
      <TooltipContent 
        className="bg-[#14294B] text-white border-white/10"
        side="right"
      >
        {tooltipContent}
      </TooltipContent>
    </Tooltip>
  );
});

MobileAwareDropdownItem.displayName = "MobileAwareDropdownItem";
