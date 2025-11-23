import { Navigate, Route, Routes } from 'react-router';
import LoginPage from '../autentification/pages/loginPage';

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<h1>home</h1>} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
};
