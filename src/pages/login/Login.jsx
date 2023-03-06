import React, { useContext, useState } from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../context/authContext';
import { auth } from '../../firebase';
import './login.css';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ loading }) => {
    // state for email field and password field
    const [loginDetails, setLoginDetails] = useState({
        email: '',
        password: '',
        passwordHidden: true,
    });

    const { email, password, passwordHidden } = loginDetails;

    const { dispatch } = useContext(AuthContext);

    // state to change type of password
    const [type, setType] = useState('password');

    //state for login error
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    // function to handle email
    const handleEmail = ({ target: { value } }) => {
        setLoginDetails((prev) => {
            return { ...prev, email: value };
        });
    };

    //function to handle password
    const handlePassword = ({ target: { value } }) => {
        setLoginDetails((prev) => {
            return { ...prev, password: value };
        });
    };

    // function to handle password visibility
    const handleVisiblitiy = () => {
        setLoginDetails((prev) => {
            return { ...prev, passwordHidden: !prev.passwordHidden };
        });
        type === 'password' ? setType('text') : setType('password');
    };

    //function to handle login
    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                dispatch({ type: 'LOGIN', payload: user });
                console.log(user);
                navigate('/');
            })
            .catch((error) => {
                setError(true);
            });
    };

    console.log(loginDetails);

    return (
        <>
            {loading ? (
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <div className="login">
                    <form className="login__form" onSubmit={handleLogin}>
                        {/* logo */}
                        <TwitterIcon className="twitter__icon" />
                        {/* title */}
                        <h1 className="logo__title">Sign in to Twitter</h1>
                        {/* form inputs */}
                        <div className="login__input">
                            <input
                                type="email"
                                placeholder="Email"
                                onChange={handleEmail}
                                value={email}
                            />
                            <PersonIcon className="login__inputBtn" />
                        </div>
                        <div className="login__input">
                            <input
                                type={type}
                                placeholder="Password"
                                onChange={handlePassword}
                                value={password}
                            />
                            <button
                                type="button"
                                className="login__visibilityBtn"
                                onClick={handleVisiblitiy}
                            >
                                {passwordHidden ? (
                                    <VisibilityIcon className="login__inputBtn" />
                                ) : (
                                    <VisibilityOffIcon className="login__inputBtn" />
                                )}
                            </button>
                        </div>
                        {/* form button */}
                        <button type="submit" className="login__button">
                            Login
                        </button>
                        {error && <span>Wrong email or password</span>}
                        {/* link to register page */}
                        <Typography>
                            Don't have an account?{' '}
                            <Typography
                                to="/register"
                                className="form__link"
                                component={Link}
                            >
                                Sign up
                            </Typography>
                        </Typography>
                    </form>
                </div>
            )}
        </>
    );
};

export default Login;
