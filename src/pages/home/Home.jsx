import React from 'react';
import Compose from '../../components/compose/Compose';
import Contents from '../../components/contents/Contents';
import './home.css';

const Home = ({ user, loading, setLoading }) => {
    return (
        <div className="home">
            <Compose user={user} loading={loading} setLoading={setLoading} />
            {/* <ContentReplies user={user} /> */}
            <Contents user={user} loading={loading} setLoading={setLoading} />
        </div>
    );
};

export default Home;
