import { Navigate } from "react-router";
import { type ReactNode } from "react";

export default function PrivateRoute({ children, isAuthenticated, isReady = true }: { children: ReactNode, isAuthenticated: boolean, isReady?: boolean }) {
    if (!isReady) {
        // todavía no sabemos si el token es válido; evita redirect prematuro
        return null;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};