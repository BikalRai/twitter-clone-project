import React from 'react';
import Compose from '../../components/compose/Compose';
import ContentReplies from '../../components/contentReplies/ContentReplies';
import Contents from '../../components/contents/Contents';
import './home.css';

const Home = ({ user }) => {
    return (
        <div className="home">
            <Compose user={user} />
            {/* <ContentReplies user={user} /> */}
            <Contents user={user} />
        </div>
    );
};

export default Home;
