
import { Navigate, Route, Routes } from 'react-router';

export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};