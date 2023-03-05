import React, { useContext, useEffect, useState } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import {
    Avatar,
    Button,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from '@mui/material';
import './navbar.css';
import { Twitter } from '@mui/icons-material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { AuthContext } from '../../context/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';

const Navbar = ({ user }) => {
    //state for menu
    const [openMenu, setOpenMenu] = useState(null);
    const open = Boolean(openMenu);

    //function to open menu
    const handleOpenMenu = (e) => {
        setOpenMenu(e.currentTarget);
    };

    //function to close menu
    const handleCloseMenu = () => {
        setOpenMenu(null);
    };

    const { dispatch, currentUser } = useContext(AuthContext);
    const navigate = useNavigate;

    console.log(currentUser, 'USER IN NAV');

    // function to handle logout
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                dispatch({ type: 'LOGOUT', payload: null });
                navigate('/login');
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    // js to handle active
    useEffect(() => {
        const links = document.querySelectorAll('.navbar__link');
        links.forEach((link) => {
            link.addEventListener('click', () => {
                document.querySelector('.active')?.classList.remove('active');
                link.classList.add('active');
            });
        });
    }, []);
    return (
        <div className="navbar">
            <Twitter className="navbar__icon twitter__icon" />
            <nav className="navbar__container">
                <Tooltip title="Home">
                    <Typography
                        component={Link}
                        className="navbar__link active"
                        to="/"
                    >
                        <HomeOutlinedIcon />
                        <span className="navbar__linkText">Home</span>
                    </Typography>
                </Tooltip>
                <Tooltip title="Explore">
                    <Typography
                        component={Link}
                        className="navbar__link"
                        to="/explore"
                    >
                        <TagIcon />
                        <span className="navbar__linkText">Explore</span>
                    </Typography>
                </Tooltip>
                <Tooltip title="Notifications">
                    <Typography component={Link} className="navbar__link">
                        <NotificationsNoneOutlinedIcon />
                        <span className="navbar__linkText">Notifications</span>
                    </Typography>
                </Tooltip>
                <Tooltip title="Messages">
                    <Typography component={Link} className="navbar__link">
                        <EmailOutlinedIcon />
                        <span className="navbar__linkText">Messages</span>
                    </Typography>
                </Tooltip>
                <Tooltip title="Bookmarks">
                    <Typography component={Link} className="navbar__link">
                        <BookmarkOutlinedIcon />
                        <span className="navbar__linkText">Bookmarks</span>
                    </Typography>
                </Tooltip>
                <Tooltip title="Lists">
                    <Typography component={Link} className="navbar__link">
                        <ViewListOutlinedIcon />
                        <span className="navbar__linkText">List</span>
                    </Typography>
                </Tooltip>
                <Tooltip title="Profile">
                    <Typography
                        component={Link}
                        className="navbar__link"
                        to="/profile"
                    >
                        <Person2OutlinedIcon />
                        <span className="navbar__linkText">Profile</span>
                    </Typography>
                </Tooltip>
            </nav>

            <div className="navbar__userOption">
                <Tooltip title="Accounts">
                    <Button
                        id="navbar__accountBtn"
                        className="navbar__account"
                        aria-controls={open ? 'navbar__accountMenu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleOpenMenu}
                    >
                        <Avatar src={user?.avatar?.img} />
                        <div className="navbar__accountDetails">
                            <div className="displayname">
                                {user?.displayName}
                            </div>
                            <div className="username">{`@${user?.username}`}</div>
                        </div>
                    </Button>
                </Tooltip>
                <Menu
                    id="navbar__accountMenu"
                    className="navbar__accountMenu"
                    anchorEl={openMenu}
                    open={open}
                    MenuListProps={{
                        'aria-labelledby': 'navbar__accountBtn',
                    }}
                    onClose={handleCloseMenu}
                >
                    <MenuItem onClick={handleLogout}>Logout </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default Navbar;
