import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useGetToken } from "@/utilities/hooks"
import { PrivateRoutes } from "@/core/privateRoutes"
import PrivateRoute from "@/core/privateRoute"
import { PublicRoutes } from "@/core/publicRoutes"

export const AppRouter = () => {
    const token = useGetToken();
    console.log("Token in AppRouter:", token, Boolean(token));
    return (
        <BrowserRouter>
            <Routes>
                {
                    PrivateRoutes.map((route, index) => {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <PrivateRoute isAuthenticated={Boolean(token)}>
                                        {route.element}
                                    </PrivateRoute>
                                }
                            />
                        )
                    })
                }
                {PublicRoutes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </BrowserRouter>
    )
}
