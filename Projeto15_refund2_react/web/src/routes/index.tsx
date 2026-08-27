import { BrowserRouter } from "react-router";
import { AuthRoutes } from "./authRoutes";
import { EmployeeRoutes } from "./employeeRoutes";

export function Routes() {
  return (
    <BrowserRouter>
      <EmployeeRoutes />
    </BrowserRouter>
  );
}

// <AuthRoutes />
