
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDatabase, User } from "../contexts/DatabaseContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UserSelectionProps {
  mode: "signin" | "signout";
}

export function UserSelection({ mode }: UserSelectionProps) {
  const { users } = useDatabase();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Filter users based on the mode (signin/signout) and search term
  const filteredUsers = users.filter(user => {
    // For signin, show users who are not signed in
    // For signout, show users who are signed in
    const statusMatch = mode === "signin" ? !user.isSignedIn : user.isSignedIn;
    // Filter by name if search term exists
    const searchMatch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                        user.department.toLowerCase().includes(search.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleUserSelect = (user: User) => {
    if (mode === "signin") {
      navigate(`/signin/${user.id}`);
    } else {
      navigate(`/signout/${user.id}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {mode === "signin" ? "Sign In" : "Sign Out"}
        </h1>
        <p className="text-gray-600">
          {mode === "signin" 
            ? "Select your name from the list below to sign in" 
            : "Select your name from the list below to sign out"}
        </p>
      </div>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          className="pl-10"
          placeholder="Search by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">
            {mode === "signin"
              ? "No users available for sign in"
              : "No users currently signed in"}
          </p>
          <Button 
            variant="ghost" 
            className="mt-4" 
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleUserSelect(user)}
            >
              <CardHeader className="pb-2">
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-gray-600">{user.position}</p>
                <p className="text-xs text-gray-500">{user.department}</p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={mode === "signin" ? "default" : "destructive"} 
                  size="sm" 
                  className="w-full"
                >
                  {mode === "signin" ? "Sign In" : "Sign Out"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
