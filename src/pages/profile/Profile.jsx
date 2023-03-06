import React, { useContext, useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Modal,
    Tooltip,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { db, storage } from '../../firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import spin from '../../assests/spin.gif';
import './profile.css';

const Profile = ({ loading, setLoading }) => {
    // state for img
    const [img, setImg] = useState('');
    const [imgData, setImgData] = useState({});

    const { currentUser } = useContext(AuthContext);

    const [user, setUser] = useState();
    const navigate = useNavigate();

    // state to update profile
    const [updateDetails, setUpdateDetails] = useState({
        firstname: '',
        lastname: '',
        bio: '',
        avatar: {},
    });

    //state for all tweets
    const [allPosts, setAllPosts] = useState([]);

    // modal states and function
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
        setUpdateDetails((prev) => {
            return {
                ...prev,
                firstname: user?.firstname,
                lastname: user?.lastname,
                bio: user?.bio,
                avatar: user?.avatar,
            };
        });
    };
    const handleClose = () => setOpen(false);

    // handle for firstname
    const handleFirstName = ({ target: { value } }) => {
        setUpdateDetails((prev) => {
            return { ...prev, firstname: value };
        });
    };

    // handle for lastname
    const handleLastName = ({ target: { value } }) => {
        setUpdateDetails((prev) => {
            return { ...prev, lastname: value };
        });
    };

    //handle for bio
    const handleBio = ({ target: { value } }) => {
        setUpdateDetails((prev) => {
            return { ...prev, bio: value };
        });
    };

    // uploading img
    const uploadImg = () => {
        const name = new Date().getTime() + img.name;
        console.log(name, 'filename');
        const storageRef = ref(storage, img.name);
        const uploadTask = uploadBytesResumable(storageRef, img);

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
                    setImgData((prev) => {
                        return { ...prev, img: downloadURL };
                    });
                    setUpdateDetails((prev) => {
                        return { ...prev, avatar: imgData };
                    });
                });
            }
        );
    };

    // geting user data
    const getUser = async () => {
        setLoading(true);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setUser(docSnap.data());
            setLoading(false);
        } else {
            // doc.data() will be undefined in this case
            console.log('No such document!');
            setLoading(false);
        }
    };

    // user all tweet posts
    const posts = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, 'tweets'),
                where('uid', '==', currentUser?.uid)
            );

            setLoading(false);
            const querySnapshot = await getDocs(q);
            console.log(querySnapshot, 'querySNAP');
            setAllPosts(
                querySnapshot.docs.map((doc) => {
                    return { ...doc.data() };
                })
            );
        } catch (error) {
            console.log(error.message);
            setLoading(false);
        }
    };

    // update data
    const updateData = async (e) => {
        e.preventDefault();
        const userRef = doc(db, 'users', currentUser.uid);

        await updateDoc(userRef, {
            ...updateDetails,
            avatar: imgData,
        });
        setUpdateDetails((prev) => {
            return { ...prev, firstname: '', lastname: '', bio: '' };
        });
        setImg('');
        setImgData({});
        setOpen(false);
    };

    // home on click
    const handleBack = () => {
        navigate('/');
    };

    console.log(user, 'which user');
    console.log(updateDetails);

    useEffect(() => {
        img && uploadImg();
    }, [img]);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        posts();
    }, []);
    return (
        <>
            {loading ? (
                <div className="loader">
                    <img src={spin} alt="spinning loading" />
                </div>
            ) : (
                <div className="profile">
                    <div className="top">
                        <div className="left">
                            <IconButton onClick={handleBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </div>
                        <div className="right">
                            <h3 className="profile__name">
                                {user?.firstname && user?.lastname
                                    ? `${user?.firstname} ${user?.lastname}`
                                    : user?.displayName}
                            </h3>
                            <p>{`${allPosts?.length} tweets`}</p>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="left">
                            <Tooltip title="Upload image">
                                <label htmlFor="upload__avatar">
                                    <Avatar
                                        src={
                                            img
                                                ? URL.createObjectURL(img)
                                                : user?.avatar?.img
                                        }
                                        className="profile__avatar"
                                        size="large"
                                    />
                                </label>
                            </Tooltip>
                            <input
                                type="file"
                                id="upload__avatar"
                                style={{ display: 'none' }}
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        </div>
                        <div className="right">
                            <Button
                                className="profile__editBtn"
                                onClick={handleOpen}
                                variant="outlined"
                            >
                                Edit Profile
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <form onSubmit={updateData}>
                                        <div className="form__input">
                                            <label htmlFor="firstname">
                                                First name:{' '}
                                            </label>
                                            <input
                                                type="text"
                                                id="firstname"
                                                className="profile__input"
                                                placeholder="Firstname"
                                                value={updateDetails?.firstname}
                                                onChange={handleFirstName}
                                            />
                                        </div>
                                        <div className="form__input">
                                            <label htmlFor="lastname">
                                                Lastname:
                                            </label>
                                            <input
                                                type="text"
                                                id="lastname"
                                                className="profile__input"
                                                placeholder="Lastname"
                                                value={updateDetails?.lastname}
                                                onChange={handleLastName}
                                            />
                                        </div>
                                        <div className="form__input">
                                            <label htmlFor="bio">Bio:</label>
                                            <textarea
                                                name="bio"
                                                id="bio"
                                                className="profile__input"
                                                onChange={handleBio}
                                                value={updateDetails?.bio}
                                            ></textarea>
                                        </div>

                                        <button className="profile__btn">
                                            Update
                                        </button>
                                    </form>
                                </Box>
                            </Modal>
                        </div>
                    </div>
                    <div className="profile__info">
                        <h3>{`${user?.firstname} ${user?.lastname}`}</h3>
                        <p>{user?.username}</p>
                        <p>{user?.bio}</p>
                        <p className="profile__infoFollow">
                            <span>
                                {' '}
                                <span className="profile__infoFollowNum">
                                    {user?.following?.length}
                                </span>{' '}
                                following
                            </span>

                            <span>
                                <span className="profile__infoFollowNum">
                                    {user?.followers?.length}
                                </span>{' '}
                                followers
                            </span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
