import { Avatar } from '@mui/material';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { db } from '../../firebase';
import Search from '../search/Search';
import './follow.css';

const Follow = ({ users, user }) => {
    console.log(users, 'all users in follow');
    const { currentUser } = useContext(AuthContext);

    // handle to follow
    const handleFollow = async (details) => {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
            following: arrayUnion(details),
        });
    };

    return (
        <>
            <Search />
            <div className="follow">
                <h3>Who to follow</h3>
                {users
                    ?.filter((person) => {
                        return person?.displayName !== user?.displayName;
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
