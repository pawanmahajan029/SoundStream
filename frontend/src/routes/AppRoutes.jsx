import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSongs } from '../store/musicSlice'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Rooms from '../pages/Rooms'
import UploadMusic from '../pages/UploadMusic'
import Layout from '../components/Layout'
import Landing from '../pages/Landing'

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    return isAuthenticated ? children : <Navigate to="/" replace />;
};

const ArtistRoute = ({ children }) => {
    const userRole = localStorage.getItem('userRole') || 'listener';
    return userRole === 'artist' ? children : <Navigate to="/home" replace />;
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
        path: '/upload-music',
        element: <PrivateRoute><ArtistRoute><Layout><UploadMusic /></Layout></ArtistRoute></PrivateRoute>
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
