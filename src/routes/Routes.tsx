import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { HomePage, ProfilePage } from '@pages/index'

export function AppRoutes (): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={ <HomePage /> }
                />
                <Route
                    path="/profile/:id"
                    element={ <ProfilePage /> }
                />
                <Route
                    path="*"
                    element={ (
                        <Navigate
                            to="/"
                            replace
                        />
                    ) }
                />
            </Routes>
        </BrowserRouter>
    )
}