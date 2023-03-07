import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
            </Routes>
        </BrowserRouter>
    )
}