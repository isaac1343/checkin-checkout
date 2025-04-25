
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase, User, PickupDropoffPoint } from "../contexts/DatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Search, LogOut, MapPin, User as UserIcon, CheckCircle, XCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PICKUP_POINTS: PickupDropoffPoint[] = ["Caltex", "Tajmall", "CBD", "Jogoo Road"];

const LocationTab = ({ location, onSignIn, onSignOut }: { 
  location: PickupDropoffPoint, 
  onSignIn: (employee: User) => void,
  onSignOut: (employee: User) => void
}) => {
  const { users, findEmployeeByNumber } = useDatabase();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter an employee number",
        variant: "destructive",
      });
      return;
    }

    const employee = findEmployeeByNumber(searchQuery.trim());
    if (employee) {
      setSearchResult(employee);
    } else {
      toast({
        title: "Not Found",
        description: "No employee found with that number",
        variant: "destructive",
      });
      setSearchResult(null);
    }
  };

  // Get employees for this location (either pickup or dropoff)
  const locationEmployees = users.filter(user => 
    user.role === "employee" && 
    (user.pickupPoint === location || user.dropoffPoint === location)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Search Employee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Enter employee number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={handleSearch}>Search</Button>
          </div>

          {searchResult && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{searchResult.name}</h3>
                  <p className="text-sm text-gray-600">{searchResult.employeeNumber}</p>
                  <p className="text-sm text-gray-600">
                    Pickup: {searchResult.pickupPoint} | Dropoff: {searchResult.dropoffPoint}
                  </p>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    disabled={searchResult.isSignedIn}
                    onClick={() => onSignIn(searchResult)}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    disabled={!searchResult.isSignedIn}
                    onClick={() => onSignOut(searchResult)}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Employees at {location}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationEmployees.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No employees assigned to this location</p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee #</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.employeeNumber}</TableCell>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          employee.isSignedIn 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {employee.isSignedIn ? "Signed In" : "Signed Out"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {employee.pickupPoint === location ? "Pickup" : "Dropoff"}
                      </TableCell>
                      <TableCell>
                        <div className="space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-2 text-green-700"
                            disabled={employee.isSignedIn}
                            onClick={() => onSignIn(employee)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 px-2 text-red-700"
                            disabled={!employee.isSignedIn}
                            onClick={() => onSignOut(employee)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const VendorDashboard = () => {
  const { signIn, signOut, getUser } = useDatabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Check if user is logged in as vendor
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("currentUserId");
    const userRole = sessionStorage.getItem("userRole");
    
    if (!storedUserId || userRole !== "vendor") {
      toast({
        title: "Access Denied",
        description: "Please log in as a transport vendor",
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

  const handleSignIn = (employee: User) => {
    signIn(employee.id);
    toast({
      title: "Employee Signed In",
      description: `${employee.name} has been successfully signed in`,
      variant: "default",
    });
  };

  const handleSignOut = (employee: User) => {
    signOut(employee.id);
    toast({
      title: "Employee Signed Out",
      description: `${employee.name} has been successfully signed out`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-6xl mx-auto pt-6 pb-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Transport Vendor Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Log Out
          </Button>
        </div>

        <Tabs defaultValue="Caltex">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            {PICKUP_POINTS.map(point => (
              <TabsTrigger key={point} value={point}>{point}</TabsTrigger>
            ))}
          </TabsList>

          {PICKUP_POINTS.map(point => (
            <TabsContent key={point} value={point}>
              <LocationTab 
                location={point} 
                onSignIn={handleSignIn} 
                onSignOut={handleSignOut} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;
