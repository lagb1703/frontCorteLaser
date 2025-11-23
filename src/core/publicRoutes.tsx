import { Navigate, Route, Routes } from 'react-router';

export const PublicRoutes = () => {
    return (
        <Routes>
            <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
    );
};
