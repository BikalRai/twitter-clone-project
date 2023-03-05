import { Avatar } from '@mui/material';
import React from 'react';
import './follow.css';

const Follow = ({ users, user }) => {
    console.log(users, 'all users in follow');
    return (
        <div className="follow">
            <h3>Who to follow</h3>
            {users
                ?.filter((person) => {
                    return person.displayName !== user.displayName;
                })
                .map((user, index) => {
                    return (
                        <div className="follow__content" key={index}>
                            <Avatar src={user?.avatar?.img} />
                            <div className="follow__content__info">
                                <p>{user?.displayName}</p>
                                <p>{user?.username}</p>
                            </div>
                            <button className="follow__btn">Follow</button>
                        </div>
                    );
                })}
        </div>
    );
};

export default Follow;
