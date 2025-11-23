import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useGetToken } from "@/utilities/hooks"
import { PrivateRoutes } from "@/core/privateRoutes"
import { PublicRoutes } from "@/core/publicRoutes"

export const AppRouter = () => {
    const token = useGetToken();
    return (
        <BrowserRouter>
            <Routes>
                {
                    token
                        ? <Route path="/*" element={<PrivateRoutes />} />
                        : <Route path="/*" element={<PublicRoutes />} />
                }
                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        </BrowserRouter>
    )
}
