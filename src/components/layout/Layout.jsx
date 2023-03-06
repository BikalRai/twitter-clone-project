import {
    collection,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
} from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { db } from '../../firebase';
import Follow from '../follow/Follow';
import Navbar from '../navbar/Navbar';
import Search from '../search/Search';
import Trend from '../trend/Trend';
import spin from '../../assests/spin.gif';
import './layout.css';

const Layout = ({ children, loading, setLoading }) => {
    const { currentUser } = useContext(AuthContext);

    // state for userdetails
    const [user, setUser] = useState({});

    // state for all users
    const [users, setUsers] = useState([]);

    // geting user data
    // const getUser = async () => {
    //     const docRef = doc(db, 'users', currentUser?.uid);
    //     const docSnap = await getDoc(docRef);
    //     if (docSnap?.exists()) {
    //         setUser(docSnap?.data());
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log('No such document!');
    //     }
    // };
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
                snapshot.docs.map((doc) => {
                    return { ...doc.data() };
                })
            );
            setLoading(false);
        });
    };

    useEffect(() => {
        allUsers();
    }, []);

    useEffect(() => {
        getUser();
    }, []);
    return (
        <>
            {loading ? (
                <div className="loader">
                    <img src={spin} alt="" />
                </div>
            ) : (
                <div className="layout">
                    {currentUser && (
                        <div className="layout__left">
                            <Navbar user={user} />
                        </div>
                    )}

                    <div className="layout__center">{children}</div>
                    {currentUser && (
                        <div className="layout__right">
                            <Search users={users} />
                            {/* <Follow users={users} user={user} /> */}
                            <Trend />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default Layout;
