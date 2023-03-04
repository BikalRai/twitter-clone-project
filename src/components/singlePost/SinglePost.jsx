import { Avatar, StepConnector, StepLabel } from '@mui/material';
import React from 'react';
import { calcDate } from '../../utils/date';
import './singlepost.css';

const SinglePost = ({ post }) => {
    return (
        <div className="singlepost">
            <Avatar src={post?.avatar?.img} className="contents__avatar" />

            <div className="contents__container">
                <div className="contents__Options">
                    <div className="contents__userDetails">
                        <span>{post?.displayName}</span>
                        <span>{`@ ${post?.username} - `}</span>
                        <span>{calcDate(post?.timeStamp?.toMillis())}</span>
                    </div>
                </div>
                <div className="contents__message">
                    <p>{post?.body}</p>
                    {post?.img && <img src={post?.img} alt="" />}
                </div>
                <p>
                    Replying to <span>@ {post?.username}</span>
                </p>
            </div>
        </div>
    );
};

export default SinglePost;
