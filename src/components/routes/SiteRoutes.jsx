import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Register from '../../pages/register/Register';
import Login from '../../pages/login/Login';
import { AuthContext } from '../../context/authContext';
import Home from '../../pages/home/Home';
import Profile from '../../pages/profile/Profile';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import Explore from '../../pages/explore/Explore';

const SiteRoutes = () => {
    const { currentUser } = useContext(AuthContext);

    // state for userdetails
    const [user, setUser] = useState({});

    // state for all users
    const [users, setUsers] = useState([]);

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

    // getting all users
    const allUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(
            querySnapshot.docs.map((doc) => {
                return { ...doc.data() };
            })
        );
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
                <Route
                    path="/explore"
                    element={
                        <LoggedIn>
                            <Explore users={users} />
                        </LoggedIn>
                    }
                />
            </Routes>
        </>
    );
};

export default SiteRoutes;
