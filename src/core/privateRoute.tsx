import { Navigate } from "react-router";
import { type ReactNode } from "react";

export default function PrivateRoute({ children, isAuthenticated }: { children: ReactNode, isAuthenticated: boolean }) {
    console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};