import { Avatar } from '@mui/material';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { db } from '../../firebase';
import Search from '../search/Search';
import './follow.css';

const Follow = ({ users }) => {
    console.log(users, 'all users in follow');
    const [user, setUser] = useState({});
    const { currentUser } = useContext(AuthContext);

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

    // handle to follow
    const handleFollow = async (details) => {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            following: arrayUnion(details),
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    console.log(user, 'user??');
    return (
        <>
            <div className="follow">
                <h3>Who to follow</h3>
                {users
                    ?.filter((person) => {
                        return person?.username !== user?.username;
                    })
                    .map((user, index) => {
                        return (
                            <div className="follow__content" key={index}>
                                <Avatar src={user?.avatar?.img} />
                                <div className="follow__content__info">
                                    <p>{user?.displayName}</p>
                                    <p>{user?.username}</p>
                                </div>
                                <button
                                    className="follow__btn"
                                    onClick={() => handleFollow(user)}
                                >
                                    Follow
                                </button>
                            </div>
                        );
                    })}
            </div>
        </>
    );
};

export default Follow;
