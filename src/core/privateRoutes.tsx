import UserPage from '../userModule/pages/userPage';
import QuoterPage from '@/fileService/pages/quoterPage';
import UpdatePage from '@/fileService/pages/updatePage';
import FilesPage from '@/fileService/pages/filesPage';
import PaymentPage from '@/paymentModule/pages/paymentPage';
import QuoterManyPage from '@/fileService/pages/quoterManyPage';
import DrawPage from '@/drawModule/pages/drawPage';

export const PrivateRoutes = [
    {
        path: "/user",
        element: <UserPage />
    },
    {
        path: "/quoter",
        element: <QuoterManyPage />
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
    {
        path: "/draw",
        element: <DrawPage />
    }
];