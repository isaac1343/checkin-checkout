
import React, { useState } from "react";
import { useDatabase, PickupDropoffPoint } from "../contexts/DatabaseContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { FileSpreadsheet, Upload } from "lucide-react";

interface EmployeeUploadProps {
  onClose: () => void;
}

interface EmployeeData {
  name: string;
  position: string;
  department: string;
  employeeNumber: string;
  pickupPoint: PickupDropoffPoint;
  dropoffPoint: PickupDropoffPoint;
}

export function EmployeeUpload({ onClose }: EmployeeUploadProps) {
  const { addEmployees } = useDatabase();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // In a real app, we would process the Excel file
    // For this demo, we'll simulate processing with sample data
    setTimeout(() => {
      // Sample data that would come from Excel file
      const sampleEmployees: EmployeeData[] = [
        {
          name: "John Smith",
          position: "Developer",
          department: "Engineering",
          employeeNumber: "EMP101",
          pickupPoint: "Caltex",
          dropoffPoint: "CBD"
        },
        {
          name: "Sarah Johnson",
          position: "Sales Manager",
          department: "Sales",
          employeeNumber: "EMP102",
          pickupPoint: "Tajmall",
          dropoffPoint: "Jogoo Road"
        },
        {
          name: "Robert Chen",
          position: "Accountant",
          department: "Finance",
          employeeNumber: "EMP103",
          pickupPoint: "CBD",
          dropoffPoint: "Caltex"
        }
      ];

      addEmployees(sampleEmployees);
      
      setIsUploading(false);
      toast({
        title: "Upload Successful",
        description: `${sampleEmployees.length} employees have been added to the system`,
      });
      
      onClose();
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "Employee upload template has been downloaded to your device",
    });
    
    // In a real app, this would trigger a download of an Excel template
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Employee Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <p className="text-sm text-gray-500">
              First time? Download our Excel template
            </p>
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file">Upload Excel File</Label>
            <Input 
              id="file" 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              onChange={handleFileChange} 
            />
            <p className="text-sm text-gray-500">
              Only Excel files (.xlsx, .xls) or CSV files are supported
            </p>
          </div>
          
          {file && (
            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
              <p className="text-sm font-medium flex items-center">
                <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                {file.name}
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
            className={isUploading ? "opacity-80" : ""}
          >
            {isUploading ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
