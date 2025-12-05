import LoginPage from '../autentification/pages/loginPage';
import RegisterPage from '../userModule/pages/registerPage';
import HomePage from '@/utilities/pages/homePage';

export const PublicRoutes = [
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    }
];
