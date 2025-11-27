import UserPage from '../userModule/pages/userPage';
import MaterialPage from '../userModule/pages/materialPage';
import { QuoterPage } from '@/fileService/pages/quoterPage';

export const PrivateRoutes = [
    {
        path: "/user",
        element: <UserPage />
    },
    {
        path: "/material",
        element: <MaterialPage />
    },
    {
        path: "/quoter/:fileId",
        element: <QuoterPage />
    }
];