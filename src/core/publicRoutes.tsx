import LoginPage from '../autentification/pages/loginPage';
import RegisterPage from '../userModule/pages/registerPage';

export const PublicRoutes = [
    {
        path: "/",
        element: <h1>home</h1>
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
