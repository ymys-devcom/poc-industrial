
import { FC } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "./ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: string;
}

export const ContentModal: FC<ContentModalProps> = ({
  isOpen,
  onClose,
  contentType
}) => {
  const getContent = () => {
    switch (contentType) {
      case "about":
        return {
          title: "About Us",
          content: (
            <>
              <p className="mb-4">
                Welcome to Robot Analytics Dashboard, a cutting-edge platform designed to monitor and optimize robot performance in healthcare settings.
              </p>
              <p className="mb-4">
                Our mission is to enhance healthcare operations by providing real-time insights into robotic performance, enabling hospitals to improve efficiency, reduce costs, and ultimately deliver better patient care.
              </p>
              <p className="mb-4">
                Founded in 2023, our team consists of healthcare professionals, data scientists, and robotics experts committed to revolutionizing hospital operations through advanced analytics and automation.
              </p>
              <p>
                Through our platform, hospitals can track critical metrics such as robot utilization, mission completion rates, error frequencies, and time saved by automated deliveries, all presented in an intuitive and actionable format.
              </p>
            </>
          )
        };
      case "privacy":
        return {
          title: "Privacy Policy",
          content: (
            <>
              <p className="mb-4">
                <strong>Effective Date: January 1, 2024</strong>
              </p>
              <p className="mb-4">
                At Robot Analytics Dashboard, we take your privacy seriously. This Privacy Policy outlines how we collect, use, store, and protect your information when you use our platform.
              </p>
              <h3 className="text-lg font-semibold mb-2">Information We Collect</h3>
              <p className="mb-4">
                We collect operational data related to robot performance, including utilization rates, task completion statistics, and system diagnostics. We do not collect personally identifiable patient information or protected health information (PHI).
              </p>
              <h3 className="text-lg font-semibold mb-2">How We Use Your Information</h3>
              <p className="mb-4">
                The collected data is used to generate performance analytics, optimize robot operations, and provide insights to improve healthcare delivery efficiency. Aggregated, anonymized data may be used for research and platform improvement.
              </p>
              <h3 className="text-lg font-semibold mb-2">Data Security</h3>
              <p>
                We implement robust security measures including encryption, access controls, and regular security audits to protect your data from unauthorized access or disclosure.
              </p>
            </>
          )
        };
      case "terms":
        return {
          title: "Terms of Service",
          content: (
            <>
              <p className="mb-4">
                <strong>Last Updated: January 1, 2024</strong>
              </p>
              <p className="mb-4">
                These Terms of Service ("Terms") govern your access to and use of the Robot Analytics Dashboard platform. By using our services, you agree to be bound by these Terms.
              </p>
              <h3 className="text-lg font-semibold mb-2">License and Use Restrictions</h3>
              <p className="mb-4">
                We grant you a limited, non-exclusive, non-transferable license to access and use the platform for your internal business purposes. You may not: (a) modify, copy, or create derivative works; (b) reverse engineer the platform; (c) access the platform to build a competitive product; or (d) use the platform for any illegal purpose.
              </p>
              <h3 className="text-lg font-semibold mb-2">Data Ownership</h3>
              <p className="mb-4">
                You retain all rights to your data. By using our platform, you grant us a license to process and analyze your data to provide and improve our services.
              </p>
              <h3 className="text-lg font-semibold mb-2">Termination</h3>
              <p>
                We reserve the right to terminate or suspend your access to the platform at any time for violations of these Terms or for any other reason at our sole discretion.
              </p>
            </>
          )
        };
      case "contact":
        return {
          title: "Contact Us",
          content: (
            <>
              <p className="mb-4">
                We're here to help! If you have any questions, concerns, or feedback about our Robot Analytics Dashboard, please don't hesitate to reach out using one of the methods below.
              </p>
              <h3 className="text-lg font-semibold mb-2">General Inquiries</h3>
              <p className="mb-4">
                Email: info@robotanalytics.example.com<br />
                Phone: (555) 123-4567<br />
                Hours: Monday-Friday, 9:00 AM - 5:00 PM EST
              </p>
              <h3 className="text-lg font-semibold mb-2">Technical Support</h3>
              <p className="mb-4">
                Email: support@robotanalytics.example.com<br />
                Phone: (555) 765-4321<br />
                Hours: 24/7 Emergency Support
              </p>
              <h3 className="text-lg font-semibold mb-2">Office Location</h3>
              <p>
                Robot Analytics Headquarters<br />
                123 Innovation Drive<br />
                Tech City, NY 10001<br />
                United States
              </p>
            </>
          )
        };
      default:
        return {
          title: "Information",
          content: <p>No content available.</p>
        };
    }
  };

  const { title, content } = getContent();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>{title}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <DialogDescription>
          <div className="py-4">
            {content}
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
