import MaterialPage from "@/userModule/pages/materialPage";
import ThicknessPage from "@/userModule/pages/thicknessPage";
import MtPage from "@/userModule/pages/mtPage";

export const adminRoutes = [
    {
        path: "/material",
        element: <MaterialPage />
    },
    {
        path: "/thickness",
        element: <ThicknessPage />
    },
    {
        path: "/mt",
        element: <MtPage />
    }
];