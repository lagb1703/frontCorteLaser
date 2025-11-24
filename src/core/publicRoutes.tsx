import { Navigate, Route, Routes } from 'react-router';
import LoginPage from '../autentification/pages/loginPage';
import RegisterPage from '../userModule/pages/registerPage';

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<h1>home</h1>} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
};
