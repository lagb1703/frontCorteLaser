import MaterialPage from "@/userModule/pages/materialPage";
import ThicknessPage from "@/userModule/pages/thicknessPage";
export const adminRoutes = [
    {
        path: "/material",
        element: <MaterialPage />
    },
    {
        path: "/thickness",
        element: <ThicknessPage />
    }
];