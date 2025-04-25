
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDatabase } from "../contexts/DatabaseContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function SignInConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { getUser, signIn } = useDatabase();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const user = id ? getUser(Number(id)) : undefined;

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    
    // Sign in the user when component mounts
    signIn(user.id);
    toast({
      title: "Signed In Successfully",
      description: `${user.name} has been signed in.`,
      duration: 3000,
    });
  }, [user, signIn, navigate, toast]);

  if (!user) {
    return null;
  }

  const isVendorView = sessionStorage.getItem("userRole") === "vendor";
  const returnRoute = isVendorView ? "/vendor-dashboard" : "/home";

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border-green-500 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-center flex flex-col items-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            Signed In Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center pb-2">
          <h2 className="text-xl font-bold">{user.name}</h2>
          {user.employeeNumber && (
            <p className="text-sm text-gray-600 mb-2">Employee #{user.employeeNumber}</p>
          )}
          <p className="text-gray-600">{user.position}</p>
          <p className="text-gray-500">{user.department}</p>
          
          {(user.pickupPoint || user.dropoffPoint) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md flex flex-col items-center">
              {user.pickupPoint && (
                <div className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm">Pickup: <strong>{user.pickupPoint}</strong></span>
                </div>
              )}
              
              {user.dropoffPoint && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm">Dropoff: <strong>{user.dropoffPoint}</strong></span>
                </div>
              )}
            </div>
          )}
          
          <p className="text-sm mt-4">
            Time: {new Date().toLocaleTimeString()}
          </p>
          <p className="text-sm">
            Date: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={() => navigate(returnRoute)}
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
