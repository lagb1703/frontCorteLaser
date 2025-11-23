import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { useState } from "react"
import { PrivateRoutes } from "@/core/privateRoutes"
import { PublicRoutes } from "@/core/publicRoutes"

type Status = 'checking' | 'authenticated' | 'no-authenticated'

export const AppRouter = () => {

    const [status, _] = useState<Status>('authenticated')

    if (status === 'checking') return <div className="loading">Checking credentials...</div>

    return (
        <BrowserRouter>
            <Routes>
                {
                    status === 'authenticated'
                        ? <Route path="/*" element={<PrivateRoutes />} />
                        : <Route path="/*" element={<PublicRoutes />} />
                }

                <Route path='*' element={<Navigate to='/login' replace />} />

            </Routes>
        </BrowserRouter>
    )
}
