
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info, FileText, MessageSquare, HelpCircle } from "lucide-react";

export const Footer = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const handleOpenChange = (open: boolean, dialogId: string) => {
    if (open) {
      setOpenDialog(dialogId);
    } else if (openDialog === dialogId) {
      setOpenDialog(null);
    }
  };

  return (
    <footer className="bg-[#012D5A] text-white py-3 px-6 mt-auto flex justify-between items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/036be44f-66bd-4ac5-8b63-f64bf8579ff2.png" 
          alt="Powered By CHANG ROBOTICS" 
          className="h-6" 
        />
      </div>
      <div className="flex space-x-4">
        {/* About Dialog */}
        <Dialog open={openDialog === "about"} onOpenChange={(open) => handleOpenChange(open, "about")}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1 text-xs">
              <Info className="h-3.5 w-3.5" />
              About
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>About Us</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="space-y-4 text-left">
                <p>Chang Robotics is a leader in healthcare automation solutions. Our mission is to enhance healthcare delivery through innovative robotic technologies.</p>
                
                <h3 className="text-lg font-semibold">Our Vision</h3>
                <p>We envision a future where healthcare professionals can focus more on patient care by automating routine tasks with our reliable robotic solutions.</p>
                
                <h3 className="text-lg font-semibold">What We Do</h3>
                <p>Chang Robotics develops autonomous mobile robots (AMRs) that assist healthcare facilities with various tasks including:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Medication and supply delivery</li>
                  <li>Equipment transportation</li>
                  <li>Waste management</li>
                  <li>Environmental monitoring</li>
                </ul>
                
                <h3 className="text-lg font-semibold">Our Commitment</h3>
                <p>We are committed to creating solutions that improve operational efficiency while maintaining the highest standards of safety and reliability in healthcare environments.</p>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
        
        {/* Terms Dialog */}
        <Dialog open={openDialog === "terms"} onOpenChange={(open) => handleOpenChange(open, "terms")}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1 text-xs">
              <FileText className="h-3.5 w-3.5" />
              Terms & Conditions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Terms & Conditions</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="space-y-4 text-left">
                <p>Last Updated: June 1, 2023</p>
                
                <h3 className="text-lg font-semibold">1. Acceptance of Terms</h3>
                <p>By accessing and using the Chang Robotics Dashboard, you accept and agree to be bound by the terms and provisions of this agreement.</p>
                
                <h3 className="text-lg font-semibold">2. Use License</h3>
                <p>Permission is granted to temporarily use the Dashboard for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                
                <h3 className="text-lg font-semibold">3. Disclaimer</h3>
                <p>The materials on the Chang Robotics Dashboard are provided on an 'as is' basis. Chang Robotics makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                
                <h3 className="text-lg font-semibold">4. Limitations</h3>
                <p>In no event shall Chang Robotics or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Dashboard.</p>
                
                <h3 className="text-lg font-semibold">5. Revisions</h3>
                <p>Chang Robotics may revise these terms of service for its Dashboard at any time without notice. By using the Dashboard, you are agreeing to be bound by the then current version of these terms of service.</p>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
        
        {/* Contacts Dialog */}
        <Dialog open={openDialog === "contacts"} onOpenChange={(open) => handleOpenChange(open, "contacts")}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1 text-xs">
              <MessageSquare className="h-3.5 w-3.5" />
              Contacts
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contact Us</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="space-y-4 text-left">
                <p>We're here to help! Please find our contact information below:</p>
                
                <h3 className="text-lg font-semibold">Corporate Headquarters</h3>
                <p>Chang Robotics, Inc.<br />
                123 Innovation Drive<br />
                San Francisco, CA 94107<br />
                United States</p>
                
                <h3 className="text-lg font-semibold">Customer Support</h3>
                <p>Email: support@changrobotics.com<br />
                Phone: +1 (800) 555-0123<br />
                Hours: Monday-Friday, 8am-6pm PT</p>
                
                <h3 className="text-lg font-semibold">Sales Inquiries</h3>
                <p>Email: sales@changrobotics.com<br />
                Phone: +1 (800) 555-0145</p>
                
                <h3 className="text-lg font-semibold">Media Relations</h3>
                <p>Email: media@changrobotics.com<br />
                Phone: +1 (800) 555-0167</p>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
        
        {/* Support Dialog */}
        <Dialog open={openDialog === "support"} onOpenChange={(open) => handleOpenChange(open, "support")}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-1 text-xs">
              <HelpCircle className="h-3.5 w-3.5" />
              Support
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Support Center</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <div className="space-y-4 text-left">
                <p>Our support team is ready to assist you with any questions or issues you may encounter with our products and services.</p>
                
                <h3 className="text-lg font-semibold">FAQs</h3>
                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium">How do I reset my dashboard password?</h4>
                    <p>Click on the "Forgot Password" link on the login page and follow the instructions sent to your registered email.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">What should I do if a robot goes offline?</h4>
                    <p>Check the robot's power supply and network connection. If issues persist, contact technical support.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">How often are metrics updated?</h4>
                    <p>Dashboard metrics are updated in real-time with a refresh interval of approximately 5 minutes.</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold">Technical Support</h3>
                <p>For technical issues, please contact us at:<br />
                Email: techsupport@changrobotics.com<br />
                Phone: +1 (800) 555-0199<br />
                Hours: 24/7 support available</p>
                
                <h3 className="text-lg font-semibold">Training Resources</h3>
                <p>Access our online training portal at training.changrobotics.com for video tutorials, user guides, and best practices.</p>
              </div>
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
};
