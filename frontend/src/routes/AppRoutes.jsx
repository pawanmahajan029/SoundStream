import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSongs } from '../store/musicSlice'
import Home from '../pages/listener/Home'
import Search from '../pages/listener/Search'
import Rooms from '../pages/listener/Rooms'
import Leaderboard from '../pages/listener/Leaderboard'
import UploadMusic from '../pages/creator/UploadMusic'
import CreatorDashboard from '../pages/creator/CreatorDashboard'
import Layout from '../components/shared/Layout'
import Landing from '../pages/auth/Landing'

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

const CreatorRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    const userRole = user?.role || localStorage.getItem('userRole') || 'listener';
    return userRole === 'creator' ? children : <Navigate to="/home" replace />;
};

const appRoutes = [
    {
        path: '/',
        element: <Landing />
    },
    {
        path: '/home',
        element: <PrivateRoute><Layout><Home /></Layout></PrivateRoute>
    },
    {
        path: '/search',
        element: <PrivateRoute><Layout><Search /></Layout></PrivateRoute>
    },
    {
        path: '/rooms',
        element: <PrivateRoute><Layout><Rooms /></Layout></PrivateRoute>
    },
    {
        path: '/creator-dashboard',
        element: <PrivateRoute><CreatorRoute><Layout><CreatorDashboard /></Layout></CreatorRoute></PrivateRoute>
    },
    {
        path: '/upload-music',
        element: <PrivateRoute><CreatorRoute><Layout><UploadMusic /></Layout></CreatorRoute></PrivateRoute>
    },
    {
        path: '/leaderboard',
        element: <PrivateRoute><Layout><Leaderboard /></Layout></PrivateRoute>
    }
]

const AppRoutes = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSongs());
    }, [dispatch]);

    return (
        <Routes>
            {appRoutes.map((route) => (
                <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                />
            ))}
        </Routes>
    )
}

export default AppRoutes
