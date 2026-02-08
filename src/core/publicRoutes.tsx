import LoginPage from '../autentification/pages/loginPage';
import RegisterPage from '../userModule/pages/registerPage';
import HomePage from '@/utilities/pages/homePage';
import Shapes from '@/shapeModule/pages/shapesPage';
import ShapeRenderPage from '@/shapeModule/pages/shapeRenderPage';

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
        path: "/shapes/:shapeId",
        element: <ShapeRenderPage />
    }
];
