import { Avatar, Button, IconButton, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import GifBoxOutlinedIcon from '@mui/icons-material/GifBoxOutlined';
import BallotOutlinedIcon from '@mui/icons-material/BallotOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import WorkHistoryOutlinedIcon from '@mui/icons-material/WorkHistoryOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import './compose.css';
import { AuthContext } from '../../context/authContext';
import {
    serverTimestamp,
    addDoc,
    collection,
    doc,
    getDoc,
    setDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

const Compose = ({ user }) => {
    // compose states
    const [tweet, setTweet] = useState({
        body: '',
        replies: 0,
        retweets: 0,
        likes: 0,
        views: 0,
    });

    const { currentUser } = useContext(AuthContext);
    const { uid } = currentUser;
    const { displayName, username } = user;

    // state for media file
    const [file, setFile] = useState('');
    const [fileData, setFileData] = useState({});

    console.log(fileData, 'FILE DATA');

    const allData = {
        ...tweet,
        displayName,
        username,
        uid,
        ...fileData,
    };

    console.log(allData, 'all data');

    // function to handle text
    const handleTweet = ({ target: { value } }) => {
        setTweet((prev) => {
            return { ...prev, body: value };
        });
    };
    console.log(tweet.body, 'composing');

    console.log(file, 'this is file');

    // function to upload file
    const uploadFile = () => {
        const name = new Date().getTime() + file.name;
        console.log(name, 'filename');
        const storageRef = ref(storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    default:
                        break;
                }
            },
            (error) => {
                console.log(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFileData((prev) => {
                        return { ...prev, img: downloadURL };
                    });
                });
            }
        );
    };

    // function to handle compose submit
    const handleSubmit = async () => {
        try {
            const newTweetRef = doc(collection(db, 'tweets'));
            await setDoc(newTweetRef, {
                ...tweet,
                displayName,
                username,
                ...fileData,
                uid,
                timeStamp: serverTimestamp(),
                replies: [],
            });
            setTweet((prev) => {
                return { ...prev, body: '' };
            });
            setFile('');
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        file && uploadFile();
    }, [file]);

    console.log(user, 'USer!!!');

    return (
        <div className="compose">
            <Avatar className="compose__avatar" src={user?.avatar?.img} />
            <div className="compose__container">
                {/* <TextField
                    className="compose__box"
                    multiline
                    rows={5}
                    fullWidth
                    variant="standard"
                    placeholder={`What's happening?`}
                /> */}
                <textarea
                    className="compose__tweet"
                    name="compose__tweet"
                    id="compose__tweet"
                    rows="5"
                    placeholder={`What's happening?`}
                    value={tweet.body}
                    onChange={handleTweet}
                ></textarea>
                <img
                    className="compose__img"
                    src={file ? URL.createObjectURL(file) : ''}
                    alt=""
                />
                <div className="compose__options">
                    <div className="compose__optionsMedia">
                        <Tooltip title="Media">
                            <div className="file">
                                <label htmlFor="media">
                                    {/* <IconButton> */}
                                    <PermMediaOutlinedIcon className="compose__icons" />
                                    {/* </IconButton> */}
                                </label>
                                <input
                                    id="media"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
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
                    <div className="compose__optionInfo">
                        <Button
                            className="compose__btn"
                            variant="contained"
                            disabled={tweet.body.length < 1 ? true : false}
                            onClick={handleSubmit}
                        >
                            Tweet
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Compose;
