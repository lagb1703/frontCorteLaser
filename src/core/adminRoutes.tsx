import MaterialPage from "@/userModule/pages/materialPage";
import ThicknessPage from "@/userModule/pages/thicknessPage";
import MtPage from "@/userModule/pages/mtPage";
import SetPriceCalculatorPage from "@/costModule/pages/setPriceCalculatorPage";

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
    },
    {
        path: "/price",
        element: <SetPriceCalculatorPage />
    }
];