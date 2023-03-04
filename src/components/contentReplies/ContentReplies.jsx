import { Avatar, Button, Menu, Tooltip } from '@mui/material';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { BsChat } from 'react-icons/bs';
import { FiBarChart2 } from 'react-icons/fi';
import { RxShare2 } from 'react-icons/rx';
import { AuthContext } from '../../context/authContext';
import { db } from '../../firebase';
import { calcDate } from '../../utils/date';

const ContentReplies = ({ user }) => {
    const [replies, setReplies] = useState([]);

    const { currentUser } = useContext(AuthContext);

    // geting user data
    const getReplies = async () => {
        try {
            const q = query(
                collection(db, 'replies'),
                where('uid', '==', currentUser.uid)
            );

            const querySnapshot = await getDocs(q);
            setReplies(
                querySnapshot.docs.map((snap) => {
                    return { ...snap.data(), id: snap.id };
                })
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getReplies();
    }, []);

    console.log(replies, 'replies ');

    return (
        <>
            {replies?.map((reply) => {
                return (
                    <div className="contents" key={reply?.id}>
                        <Avatar
                            src={user?.avatar?.img}
                            className="contents__avatar"
                        />
                        <div className="contents__container">
                            <div className="contents__Options">
                                <div className="contents__userDetails">
                                    <span>{user?.displayName}</span>
                                    <span>{`@ ${user?.username} - `}</span>
                                    <span>
                                        {calcDate(reply?.timeStamp?.toMillis())}
                                    </span>
                                </div>

                                <div className="contents__userDetailsOptions">
                                    {/* <Button
                                        id="demo-positioned-button"
                                        aria-controls={
                                            open
                                                ? 'demo-positioned-menu'
                                                : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                            open ? 'true' : undefined
                                        }
                                        onClick={handleClick}
                                    >
                                        <MoreHorizOutlinedIcon />
                                        {reply?.id}
                                    </Button>
                                    <Menu
                                        className="more__menu"
                                        id="demo-positioned-menu"
                                        aria-labelledby="demo-positioned-button"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <MenuItem
                                            onClick={(e) =>
                                                handleDelete(tweet?.id)
                                            }
                                        >
                                            Delete
                                            {tweet?.id}
                                        </MenuItem>
                                    </Menu> */}
                                </div>
                            </div>
                            <p>{`Replying to @ ${reply?.repliedTo}`}</p>
                            <div className="contents__message">
                                <p>{reply?.body}</p>
                                {reply?.img && <img src={reply?.img} alt="" />}
                            </div>
                            <div className="contents__tweetOptions">
                                <Tooltip title="Reply">
                                    <button
                                        className="contents__tweetOptionsBtn reply"
                                        onClick={() => console.log(reply.id)}
                                        // onClick={handleOpenModal}
                                    >
                                        <BsChat className="contents__tweetOptionsIcon" />
                                        <span>{reply?.replies}</span>
                                        {/* <Reply
                                            openModal={openModal}
                                            user={user}
                                            setOpenModal={setOpenModal}
                                        /> */}
                                    </button>
                                </Tooltip>
                                <Tooltip title="Retweet">
                                    <button className="contents__tweetOptionsBtn retweet">
                                        <AiOutlineRetweet className="contents__tweetOptionsIcon" />
                                        <span>{reply?.retweets}</span>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Likes">
                                    <button className="contents__tweetOptionsBtn likes">
                                        <AiOutlineHeart className="contents__tweetOptionsIcon" />
                                        <span>{reply?.likes}</span>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Views">
                                    <button className="contents__tweetOptionsBtn views">
                                        <FiBarChart2 className="contents__tweetOptionsIcon" />
                                        <span>{reply?.views}</span>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Share">
                                    <button className="contents__tweetOptionsBtn share">
                                        <RxShare2 className="contents__tweetOptionsIcon" />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ContentReplies;
