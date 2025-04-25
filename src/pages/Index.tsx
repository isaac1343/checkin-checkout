
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, LogOut } from "lucide-react";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mt-8 mb-2">
          Employee Check-In System
        </h1>
        <p className="text-gray-600 text-center">
          Track who's in and out of the office with our simple sign-in system
        </p>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <LogIn className="mr-2 h-6 w-6 text-blue-500" />
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              Arriving at work? Sign in to record your arrival time.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-green-500 hover:bg-green-600">
              <Link to="/select-user/signin">Sign In Now</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-center">
              <LogOut className="mr-2 h-6 w-6 text-blue-500" />
              Sign Out
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600">
              Leaving for the day? Sign out to record your departure time.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-red-500 hover:bg-red-600">
              <Link to="/select-user/signout">Sign Out Now</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="w-full">
        <Dashboard />
      </div>
    </div>
  );
};

export default Index;
