import { Avatar } from '@mui/material';
import React, { useContext } from 'react';
import Search from '../../components/search/Search';
import Follow from '../../components/follow/Follow';
import './explore.css';
import { AuthContext } from '../../context/authContext';

const Explore = ({ data }) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <>
            <div className="explore">
                <Follow users={data} />
            </div>
        </>
    );
};

export default Explore;
