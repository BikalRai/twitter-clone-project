import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button, IconButton, Tooltip } from '@mui/material';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {
    collection,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { AuthContext } from '../../context/authContext';
import { db } from '../../firebase';
import './reply.css';
import SinglePost from '../singlePost/SinglePost';

const Reply = ({ user, id, setOpenModal }) => {
    const { currentUser } = useContext(AuthContext);
    const { uid } = currentUser;

    console.log(id, 'id in reply');

    // state to save the retrieved post
    const [post, setPost] = useState({});

    // state for replies
    const [reply, setReply] = useState({
        body: '',
        likes: 0,
        replies: 0,
        retweets: 0,
        views: 0,
    });

    //function to handle reply
    const handleReply = ({ target: { value } }) => {
        setReply((prev) => {
            return { ...prev, body: value };
        });
    };

    // get particular data
    const getPost = async () => {
        const docRef = doc(db, 'tweets', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('Document data:', docSnap.data());
            setPost(docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
        }
    };

    // posting reply
    const postReply = async () => {
        try {
            // const newReply = doc(collection(db, 'tweets'));
            // await setDoc(newReply, {
            //     repliedBy: user?.displayName,
            //     ...reply,
            //     repliedTo: post?.displayName,
            //     uid,
            //     timeStamp: serverTimestamp(),
            // });

            const tweetDocRef = doc(db, 'tweets', id);
            await updateDoc(tweetDocRef, {
                replies: [
                    ...post?.replies,
                    {
                        repliedBy: user?.displayName,
                        reply: reply,
                        repliedTo: post?.displayName,
                        timeStamp: new Date().getTime(),
                    },
                ],
            });
            setReply((prev) => {
                return { ...prev, body: '' };
            });

            setOpenModal(false);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getPost();
    }, []);

    console.log(reply, 'reply');
    console.log(post, 'POST!!');
    return (
        <>
            <SinglePost post={post} />

            <div className="reply">
                <Avatar className="reply__avatar" src={user?.avatar?.img} />

                <div className="reply__container">
                    <textarea
                        className="reply__tweet"
                        name="reply__tweet"
                        id="reply__tweet"
                        rows="5"
                        placeholder={`What's happening?`}
                        value={reply?.body}
                        onChange={handleReply}
                    ></textarea>
                    {/* <img
            className="reply__img"
            src={file ? URL.createObjectURL(file) : ''}
            alt=""
        /> */}
                    <div className="reply__options">
                        <div className="reply__optionsMedia">
                            <Tooltip title="Media">
                                <div className="file">
                                    <label htmlFor="media">
                                        {/* <IconButton> */}
                                        <PermMediaOutlinedIcon className="reply__icons" />
                                        {/* </IconButton> */}
                                    </label>
                                    {/* <input
                            id="media"
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => setFile(e.target.files[0])}
                        /> */}
                                </div>
                            </Tooltip>
                            <Tooltip title="GIF">
                                <IconButton>
                                    <GifBoxOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Poll">
                                <IconButton>
                                    <BallotOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Emoji">
                                <IconButton>
                                    <EmojiEmotionsOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Schedule">
                                <IconButton>
                                    <WorkHistoryOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip>
                                <IconButton>
                                    <LocationOnOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="reply__optionInfo">
                            <Button
                                className="reply__btn"
                                variant="contained"
                                disabled={
                                    reply?.body?.length < 1 ? true : false
                                }
                                onClick={postReply}
                            >
                                Reply
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reply;
