import { Navigate, Route, Routes } from 'react-router';

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<h1>home</h1>} />
            <Route path='/login' element={<h1>Login Route</h1>} />
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
};
