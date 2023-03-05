import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { db } from '../../firebase';
import Follow from '../follow/Follow';
import Navbar from '../navbar/Navbar';
import Search from '../search/Search';
import Trend from '../trend/Trend';
import './layout.css';

const Layout = ({ children }) => {
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

    useEffect(() => {
        allUsers();
    }, []);

    useEffect(() => {
        getUser();
    }, []);
    return (
        <div className="layout">
            {currentUser && (
                <div className="layout__left">
                    <Navbar user={user} />
                </div>
            )}

            <div className="layout__center">{children}</div>
            {currentUser && (
                <div className="layout__right">
                    <Search />
                    <Trend />
                    <Follow users={users} user={user} />
                </div>
            )}
        </div>
    );
};

export default Layout;
