import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Register from '../../pages/register/Register';
import Login from '../../pages/login/Login';
import { AuthContext } from '../../context/authContext';
import Home from '../../pages/home/Home';
import Profile from '../../pages/profile/Profile';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const SiteRoutes = () => {
    const { currentUser } = useContext(AuthContext);

    // state for userdetails
    const [user, setUser] = useState({});

    // geting user data
    const getUser = async () => {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUser(docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }
    };

    const LoggedIn = ({ children }) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    useEffect(() => {
        getUser();
    }, []);
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        <LoggedIn>
                            <Home user={user} />
                        </LoggedIn>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <LoggedIn>
                            <Profile user={user} />
                        </LoggedIn>
                    }
                />
            </Routes>
        </>
    );
};

export default SiteRoutes;
