
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { UserSelection } from "@/components/UserSelection";

const SelectUser = () => {
  const { mode } = useParams<{ mode: "signin" | "signout" }>();
  const navigate = useNavigate();

  if (mode !== "signin" && mode !== "signout") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto pt-6 pb-10">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <UserSelection mode={mode} />
      </div>
    </div>
  );
};

export default SelectUser;
