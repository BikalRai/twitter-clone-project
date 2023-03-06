import React, { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './search.css';
import Explore from '../../pages/explore/Explore';
import Follow from '../follow/Follow';

const Search = ({ users }) => {
    //state for search
    const [searchText, setSearchText] = useState('');
    console.log(users, ' users in search');

    //handle for search text
    const handleSearchText = ({ target: { value } }) => {
        setSearchText(value);
    };

    // search
    const search = (data) => {
        if (searchText === '') {
            return data;
        } else {
            return data?.filter(
                (item) =>
                    item?.username?.toLowerCase().includes(searchText) ||
                    item?.displayName?.toLowerCase().includes(searchText)
            );
        }
    };

    return (
        <>
            <div className="search">
                <SearchOutlinedIcon className="search__icon" />
                <input
                    type="search"
                    placeholder="Search Twitter"
                    onChange={handleSearchText}
                    value={searchText}
                />
            </div>
            <Follow users={search(users)} />
        </>
    );
};

export default Search;
