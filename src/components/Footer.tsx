
import { FC } from "react";
import { Button } from "./ui/button";

interface FooterProps {
  onButtonClick: (contentType: string) => void;
}

export const Footer: FC<FooterProps> = ({ onButtonClick }) => {
  return (
    <footer className="bg-mayo-primary text-white py-6 px-8 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Robot Analytics Dashboard</h3>
            <p className="text-sm text-gray-300 mt-1">Monitoring robot performance in healthcare</p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              onClick={() => onButtonClick("about")}
            >
              About Us
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              onClick={() => onButtonClick("privacy")}
            >
              Privacy Policy
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              onClick={() => onButtonClick("terms")}
            >
              Terms of Service
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10" 
              onClick={() => onButtonClick("contact")}
            >
              Contact
            </Button>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-300">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
};
