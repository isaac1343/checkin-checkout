
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the user types and roles
export type UserRole = "admin" | "vendor" | "employee";
export type PickupDropoffPoint = "Caltex" | "Tajmall" | "CBD" | "Jogoo Road";

// Define the user type
export interface User {
  id: number;
  name: string;
  role: UserRole;
  position: string;
  department: string;
  isSignedIn: boolean;
  lastSignIn?: Date;
  lastSignOut?: Date;
  employeeNumber?: string;
  pickupPoint?: PickupDropoffPoint;
  dropoffPoint?: PickupDropoffPoint;
}

// Initial users data with roles
const initialUsers: User[] = [
  { 
    id: 1, 
    name: "Admin User", 
    role: "admin", 
    position: "System Administrator", 
    department: "IT", 
    isSignedIn: false 
  },
  { 
    id: 2, 
    name: "Vendor User", 
    role: "vendor", 
    position: "Transport Coordinator", 
    department: "Logistics", 
    isSignedIn: false 
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    role: "employee", 
    position: "UX Designer", 
    department: "Design", 
    isSignedIn: false,
    employeeNumber: "EMP001",
    pickupPoint: "CBD",
    dropoffPoint: "Tajmall" 
  },
  { 
    id: 4, 
    name: "Emily Johnson", 
    role: "employee", 
    position: "Marketing Specialist", 
    department: "Marketing", 
    isSignedIn: false,
    employeeNumber: "EMP002",
    pickupPoint: "Caltex",
    dropoffPoint: "Jogoo Road"
  },
  { 
    id: 5, 
    name: "David Lee", 
    role: "employee", 
    position: "HR Manager", 
    department: "Human Resources", 
    isSignedIn: false,
    employeeNumber: "EMP003",
    pickupPoint: "Tajmall",
    dropoffPoint: "CBD"
  },
];

interface DatabaseContextType {
  users: User[];
  signIn: (id: number) => void;
  signOut: (id: number) => void;
  getUser: (id: number) => User | undefined;
  addEmployees: (employees: Omit<User, "id" | "isSignedIn" | "lastSignIn" | "lastSignOut" | "role">[]) => void;
  findEmployeeByNumber: (employeeNumber: string) => User | undefined;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  // Load users from localStorage or use initial data
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const signIn = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, isSignedIn: true, lastSignIn: new Date() } 
        : user
    ));
  };

  const signOut = (id: number) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, isSignedIn: false, lastSignOut: new Date() } 
        : user
    ));
  };

  const getUser = (id: number) => {
    return users.find(user => user.id === id);
  };

  const addEmployees = (employees: Omit<User, "id" | "isSignedIn" | "lastSignIn" | "lastSignOut" | "role">[]) => {
    const nextId = Math.max(...users.map(u => u.id)) + 1;
    
    const newEmployees = employees.map((emp, index) => ({
      ...emp,
      id: nextId + index,
      role: "employee" as UserRole,
      isSignedIn: false
    }));
    
    setUsers([...users, ...newEmployees]);
  };

  const findEmployeeByNumber = (employeeNumber: string) => {
    return users.find(user => 
      user.role === "employee" && 
      user.employeeNumber === employeeNumber
    );
  };

  return (
    <DatabaseContext.Provider value={{ 
      users, 
      signIn, 
      signOut, 
      getUser, 
      addEmployees,
      findEmployeeByNumber
    }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error("useDatabase must be used within a DatabaseProvider");
  }
  return context;
}
