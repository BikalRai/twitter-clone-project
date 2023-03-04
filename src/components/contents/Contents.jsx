import React, { useContext, useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    IconButton,
    Menu,
    MenuItem,
    Modal,
    Tooltip,
    Typography,
} from '@mui/material';
import { BsChat } from 'react-icons/bs';
import { AiOutlineRetweet, AiOutlineHeart } from 'react-icons/ai';
import { FiBarChart2 } from 'react-icons/fi';
import { RxShare2 } from 'react-icons/rx';
import { AuthContext } from '../../context/authContext';
import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
    setDoc,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import Reply from '../reply/Reply';
import { calcDate } from '../../utils/date';
import { useNavigate } from 'react-router-dom';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import './contents.css';
import ShowReplies from '../showReplies/ShowReplies';

const Contents = ({ user }) => {
    // state and function to handle menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // state for reply
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const { currentUser } = useContext(AuthContext);

    // state to store data that was retrived
    const [tweets, setTweets] = useState([]);

    // state for click
    const [clickedVal, setClickedVal] = useState('');

    // style for modal
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 550,
        bgcolor: '#fff',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    // function to get  tweets
    const getTweets = async () => {
        try {
            const q = query(
                collection(db, 'tweets'),
                where('uid', '==', currentUser.uid)
            );

            const querySnapshot = await getDocs(q);
            console.log(querySnapshot, 'snap');

            setTweets(
                querySnapshot.docs.map((snapshot) => {
                    return { ...snapshot.data(), id: snapshot.id };
                })
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    //function to delete
    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'tweets', id));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getTweets();
    }, []);

    console.log(clickedVal, 'clicked Value');

    return (
        <>
            {tweets?.map((tweet, index) => {
                return (
                    <div className="contents" key={tweet?.id} id={tweet?.id}>
                        <Avatar
                            src={user?.avatar?.img}
                            className="contents__avatar"
                        />
                        <div className="contents__container">
                            <div className="contents__Options">
                                <div className="contents__userDetails">
                                    <span>{tweet?.displayName}</span>
                                    <span>{`@ ${tweet?.username} - `}</span>
                                    <span>
                                        {calcDate(tweet?.timeStamp?.toMillis())}
                                    </span>
                                </div>

                                <div className="contents__userDetailsOptions">
                                    <Button
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
                                        {tweet?.id}
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
                                    </Menu>
                                </div>
                            </div>
                            <div className="contents__message">
                                <p>{tweet?.body}</p>
                                {tweet?.img && <img src={tweet.img} alt="" />}
                            </div>
                            <div className="contents__tweetOptions">
                                <Tooltip title="Reply">
                                    <button
                                        className="contents__tweetOptionsBtn reply"
                                        onClick={() => {
                                            setClickedVal(() => {
                                                handleOpenModal();
                                                return tweet.id;
                                            });
                                        }}
                                    >
                                        <BsChat className="contents__tweetOptionsIcon" />
                                        <span>
                                            {tweet?.replies?.length
                                                ? tweet.replies.length
                                                : 0}
                                        </span>
                                    </button>
                                </Tooltip>
                                <Modal
                                    open={openModal}
                                    onClose={handleCloseModal}
                                >
                                    <Box sx={style}>
                                        <IconButton onClick={handleCloseModal}>
                                            <CloseSharpIcon />
                                        </IconButton>
                                        <Reply
                                            id={clickedVal}
                                            user={user}
                                            setOpenModal={setOpenModal}
                                        />
                                    </Box>
                                </Modal>

                                <Tooltip title="Retweet">
                                    <button className="contents__tweetOptionsBtn retweet">
                                        <AiOutlineRetweet className="contents__tweetOptionsIcon" />
                                        <span>{tweet?.retweets}</span>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Likes">
                                    <button className="contents__tweetOptionsBtn likes">
                                        <AiOutlineHeart className="contents__tweetOptionsIcon" />
                                        <span>{tweet?.likes}</span>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Views">
                                    <button className="contents__tweetOptionsBtn views">
                                        <FiBarChart2 className="contents__tweetOptionsIcon" />
                                        <span>{tweet?.views}</span>
                                    </button>
                                </Tooltip>
                                <Tooltip title="Share">
                                    <button className="contents__tweetOptionsBtn share">
                                        <RxShare2 className="contents__tweetOptionsIcon" />
                                    </button>
                                </Tooltip>
                            </div>
                            {tweet?.replies?.length > 0 && <h5>Replies:</h5>}
                            {tweet?.replies?.length > 0 ? (
                                <ShowReplies tweets={tweets} />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Contents;
