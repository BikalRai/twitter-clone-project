import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Register from '../../pages/register/Register';
import Login from '../../pages/login/Login';
import { AuthContext } from '../../context/authContext';
import Home from '../../pages/home/Home';
import Profile from '../../pages/profile/Profile';
import {
    getDoc,
    doc,
    getDocs,
    collection,
    onSnapshot,
} from 'firebase/firestore';
import { db } from '../../firebase';
import Explore from '../../pages/explore/Explore';

const SiteRoutes = ({ loading, setLoading }) => {
    const { currentUser } = useContext(AuthContext);
    console.log(currentUser, 'current user in site');

    // state for userdetails
    const [user, setUser] = useState({});

    // state for all users
    const [users, setUsers] = useState([]);

    // geting user data
    const getUser = async () => {
        setLoading(true);
        const docRef = doc(db, 'users', currentUser?.uid);
        await onSnapshot(docRef, (snapshot) => {
            setUser(snapshot.data());
            setLoading(false);
        });
    };

    // getting all users
    const allUsers = async () => {
        setLoading(true);
        await onSnapshot(collection(db, 'users'), (snapshot) => {
            setUsers(
                snapshot?.docs?.map((doc) => {
                    return { ...doc.data() };
                })
            );
            setLoading(false);
        });
    };

    const LoggedIn = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    useEffect(() => {
        allUsers();
    }, []);
    useEffect(() => {
        getUser();
    }, []);
    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                    loading={loading}
                    setLoading={setLoading}
                />
                <Route
                    path="/register"
                    element={<Register />}
                    loading={loading}
                    setLoading={setLoading}
                />
                <Route
                    path="/"
                    element={
                        <LoggedIn>
                            <Home
                                user={user}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        </LoggedIn>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <LoggedIn>
                            <Profile
                                user={user}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        </LoggedIn>
                    }
                />
                <Route
                    path="/explore"
                    element={
                        <LoggedIn>
                            <Explore
                                users={users}
                                loading={loading}
                                setLoading={setLoading}
                            />
                        </LoggedIn>
                    }
                />
            </Routes>
        </>
    );
};

export default SiteRoutes;
