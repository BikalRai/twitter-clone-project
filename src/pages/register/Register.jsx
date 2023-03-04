import React, { useReducer, useState } from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DnsIcon from '@mui/icons-material/Dns';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    registerDetails,
    registerReducer,
} from '../../context/registerReducer';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import './register.css';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const Register = () => {
    // state to handle password visibility
    const [visible, setVisible] = useState(false);

    // registration details
    const [registrationDetails, dispatch] = useReducer(
        registerReducer,
        registerDetails
    );

    const {
        displayName,
        username,
        email,
        password,
        confirmPassword,
        tweets,
        following,
        followers,
    } = registrationDetails;

    console.log(registrationDetails, 'registraion details');

    const navigate = useNavigate();

    // function to handle password visibility
    const handleVisible = () => {
        setVisible(!visible);
    };

    // function to handle registration
    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            await setDoc(doc(db, 'users', res.user.uid), {
                displayName,
                username,
                email,
                tweets,
                following,
                followers,
                timeStamp: serverTimestamp(),
            });

            console.log(res.user.uid, 'RES');
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <div className="register">
            <form className="register__form" onSubmit={handleRegistration}>
                {/* twitter icon */}
                <TwitterIcon className="twitter__icon" />
                <h1 className="register__title">Join Twitter today</h1>
                <div className="register__input">
                    <input
                        type="text"
                        placeholder="Display name"
                        onChange={(e) =>
                            dispatch({
                                type: 'displayname',
                                value: e.target.value,
                            })
                        }
                        value={displayName}
                    />
                    <DnsIcon className="register__icon" />
                </div>
                <div className="register__input">
                    <input
                        type="text"
                        placeholder="User name"
                        onChange={(e) =>
                            dispatch({
                                type: 'username',
                                value: e.target.value,
                            })
                        }
                        value={username}
                    />
                    <BadgeIcon className="register__icon" />
                </div>
                <div className="register__input">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) =>
                            dispatch({
                                type: 'email',
                                value: e.target.value,
                            })
                        }
                        value={email}
                    />
                    <EmailIcon className="register__icon" />
                </div>
                <div className="register__input">
                    <input
                        type={visible ? 'text' : 'password'}
                        placeholder="Password"
                        onChange={(e) =>
                            dispatch({
                                type: 'password',
                                value: e.target.value,
                            })
                        }
                        value={password}
                    />
                    <button type="button" onClick={handleVisible}>
                        {visible ? (
                            <VisibilityOffIcon className="register__icon" />
                        ) : (
                            <VisibilityIcon className="register__icon" />
                        )}
                    </button>
                </div>
                <div className="register__input">
                    <input
                        type={visible ? 'text' : 'password'}
                        placeholder="Confirm password"
                        onChange={(e) =>
                            dispatch({
                                type: 'cpassword',
                                value: e.target.value,
                            })
                        }
                        value={confirmPassword}
                    />
                    <button type="button" onClick={handleVisible}>
                        {visible ? (
                            <VisibilityOffIcon className="register__icon" />
                        ) : (
                            <VisibilityIcon className="register__icon" />
                        )}
                    </button>
                </div>
                <button className="register__btn">Sign up</button>
                <Typography>
                    Already have an account?{' '}
                    <Typography
                        component={Link}
                        className="form__link"
                        to="/login"
                    >
                        Log in
                    </Typography>
                </Typography>
            </form>
        </div>
    );
};

export default Register;
