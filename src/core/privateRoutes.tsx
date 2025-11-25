
import UserPage from '../userModule/pages/userPage';
import MaterialPage from '../userModule/pages/materialPage';

export const PrivateRoutes = [
    {
        path: "/user",
        element: <UserPage />
    },
    {
        path: "/material",
        element: <MaterialPage />
    }
];