
import { Navigate, Route, Routes } from 'react-router';

export const PrivateRoutes = () => {
    return (
        <Routes>
            <Route path='/privada' element={<h1>Private Route</h1>} />
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    );
};