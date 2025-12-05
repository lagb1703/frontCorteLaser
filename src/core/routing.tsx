import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useGetToken } from "@/utilities/hooks"
import { PrivateRoutes } from "@/core/privateRoutes"
import PrivateRoute from "@/core/privateRoute"
import { PublicRoutes } from "@/core/publicRoutes"
import { adminRoutes } from "@/core/adminRoutes"
import { useGetUser } from "@/userModule/hooks"
import Header from "@/utilities/components/header"
import Footer from "@/utilities/components/footer"
import { useEffect } from "react"

export const AppRouter = () => {
    const { token, initialized } = useGetToken();
    const { data: user, isLoading, refetch } = useGetUser();
    useEffect(() => {
        console.log("Token changed, refetching user");
        refetch();
    }, [token, refetch]);
    return (
        <BrowserRouter>
            <div
                className="grid h-screen grid-rows-[auto_1fr_auto]">
                <Header user={user} token={token} />
                <Routes>
                    {
                        adminRoutes.map((route, index) => {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <PrivateRoute isAuthenticated={Boolean(token && user?.isAdmin)} isReady={!isLoading}>
                                            {route.element}
                                        </PrivateRoute>
                                    }
                                />
                            )
                        })
                    }
                    {
                        PrivateRoutes.map((route, index) => {
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <PrivateRoute isAuthenticated={Boolean(token)} isReady={initialized}>
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
                <Footer />
            </div>
        </BrowserRouter>
    )
}
