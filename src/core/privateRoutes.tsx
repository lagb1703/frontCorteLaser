import UserPage from '../userModule/pages/userPage';
import MaterialPage from '../userModule/pages/materialPage';
import QuoterPage from '@/fileService/pages/quoterPage';
import UpdatePage from '@/fileService/pages/updatePage';
import FilesPage from '@/fileService/pages/filesPage';
import PaymentPage from '@/paymentModule/pages/paymentPage';

export const PrivateRoutes = [
    {
        path: "/user",
        element: <UserPage />
    },
    {
        path: "/quoter/:fileId",
        element: <QuoterPage />
    },
    {
        path: "/update",
        element: <UpdatePage />
    },
    {
        path: "/files",
        element: <FilesPage />
    },
    {
        path: "/payments",
        element: <PaymentPage />
    },
];