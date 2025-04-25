
import React from "react";
import { SignOutConfirmation } from "@/components/SignOutConfirmation";

const SignOut = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <SignOutConfirmation />
    </div>
  );
};

export default SignOut;
