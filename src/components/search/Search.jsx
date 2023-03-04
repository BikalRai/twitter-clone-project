import React, { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import './search.css';

const Search = () => {
    // state for all users
    const [users, setUsers] = useState([]);

    //state for search
    const [searchText, setSearchText] = useState('');

    //handle for search text
    const handleSearchText = ({ target: { value } }) => {
        setSearchText(value);
    };

    // function to get all users
    const allUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(
            querySnapshot.docs.map((doc) => {
                return { ...doc.data() };
            })
        );
    };
    console.log(users, 'all users');

    useEffect(() => {
        allUsers();
    }, []);
    return (
        <div className="search">
            <SearchOutlinedIcon className="search__icon" />
            <input
                type="search"
                placeholder="Search Twitter"
                onChange={handleSearchText}
                value={searchText}
            />
        </div>
    );
};

export default Search;
