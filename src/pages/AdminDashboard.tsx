
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase, User } from "../contexts/DatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { FileSpreadsheet, LogOut, Upload, User as UserIcon } from "lucide-react";
import { EmployeeUpload } from "@/components/EmployeeUpload";

const AdminDashboard = () => {
  const { users } = useDatabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Check if user is logged in as admin
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("currentUserId");
    const userRole = sessionStorage.getItem("userRole");
    
    if (!storedUserId || userRole !== "admin") {
      toast({
        title: "Access Denied",
        description: "Please log in as an administrator",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    setCurrentUserId(Number(storedUserId));
  }, [navigate, toast]);
  
  const handleLogout = () => {
    sessionStorage.removeItem("currentUserId");
    sessionStorage.removeItem("userRole");
    navigate("/login");
  };

  const employees = users.filter(user => user.role === "employee");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-6xl mx-auto pt-6 pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <UserIcon className="mr-2 h-5 w-5 text-blue-500" />
                Total Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{employees.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <UserIcon className="mr-2 h-5 w-5 text-green-500" />
                Signed In
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {employees.filter(emp => emp.isSignedIn).length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setShowUploadModal(true)}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg text-blue-700">
                <Upload className="mr-2 h-5 w-5" />
                Upload Employee Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">
                Click to upload employee data from Excel file
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Employee Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Pickup Point</TableHead>
                    <TableHead>Dropoff Point</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No employees found. Upload employee data to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.employeeNumber || "—"}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.pickupPoint || "—"}</TableCell>
                        <TableCell>{employee.dropoffPoint || "—"}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.isSignedIn 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {employee.isSignedIn ? "Signed In" : "Signed Out"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {showUploadModal && (
        <EmployeeUpload onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;
