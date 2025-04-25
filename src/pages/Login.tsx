
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase } from "../contexts/DatabaseContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, ShieldCheck, Car } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { users } = useDatabase();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple login logic (in a real app, would have proper authentication)
    const user = users.find(u => 
      (u.role === "admin" || u.role === "vendor") && 
      u.name.toLowerCase() === username.toLowerCase()
    );
    
    if (user) {
      // Store logged in user ID in session storage
      sessionStorage.setItem("currentUserId", user.id.toString());
      sessionStorage.setItem("userRole", user.role);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${user.name}!`,
      });
      
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/vendor-dashboard");
      }
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Employee Transport System</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex justify-center space-x-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-blue-100 mb-2">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 mb-2">
                  <Car className="h-8 w-8 text-green-600" />
                </div>
                <span className="text-sm font-medium">Transport Vendor</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                Demo: Use "Admin User" or "Vendor User" as username and any password
              </p>
            </div>
            <Button type="submit" className="w-full" size="lg">
              <LogIn className="mr-2 h-4 w-4" /> Log In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
