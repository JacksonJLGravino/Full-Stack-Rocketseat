import { BrowserRouter } from "react-router";
import { AuthRoutes } from "./authRoutes";

export function Routes() {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  );
}
