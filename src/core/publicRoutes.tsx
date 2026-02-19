import LoginPage from '../autentification/pages/loginPage';
import RegisterPage from '../userModule/pages/registerPage';
import HomePage from '@/utilities/pages/homePage';
import Shapes from '@/shapeModule/pages/shapesPage';
import AboutUs from '@/utilities/pages/aboutUs';

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
    },
    {
        path: "token/:token",
        element: <h1>Token Page</h1>
    },
    {
        path: "/shapes",
        element: <Shapes />
    },
    {
        path: "/about-us",
        element: <AboutUs />
    }
];
