
import React from "react";
import { useDatabase } from "../contexts/DatabaseContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, UserX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Dashboard() {
  const { users } = useDatabase();
  
  const signedInUsers = users.filter(user => user.isSignedIn);
  const signedOutUsers = users.filter(user => !user.isSignedIn);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5 text-green-500" />
              <span>Currently Signed In</span>
              <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {signedInUsers.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signedInUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">No users are currently signed in</p>
            ) : (
              <ul className="divide-y">
                {signedInUsers.map(user => (
                  <li key={user.id} className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.department}</p>
                      </div>
                      {user.lastSignIn && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(user.lastSignIn), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <UserX className="mr-2 h-5 w-5 text-red-500" />
              <span>Currently Signed Out</span>
              <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {signedOutUsers.length}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signedOutUsers.length === 0 ? (
              <p className="text-gray-500 text-sm">All users are currently signed in</p>
            ) : (
              <ul className="divide-y">
                {signedOutUsers.map(user => (
                  <li key={user.id} className="py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.department}</p>
                      </div>
                      {user.lastSignOut && (
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(user.lastSignOut), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
