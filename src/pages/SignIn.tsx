
import React from "react";
import { SignInConfirmation } from "@/components/SignInConfirmation";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <SignInConfirmation />
    </div>
  );
};

export default SignIn;
