import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import './trend.css';

const Trend = () => {
    // state for trends
    const [trends, setTrends] = useState([]);

    // getting the trends
    const getTrends = async () => {
        const querySnapshot = await getDocs(collection(db, 'trends'));
        setTrends(
            querySnapshot.docs.map((doc) => {
                return { ...doc.data() };
            })
        );
    };

    console.log(trends, 'trend!!');

    useEffect(() => {
        getTrends();
    }, []);
    return (
        <div className="trend">
            <h3>Trends for you</h3>
            {trends?.map((trend, i) => {
                return (
                    <div className="trend__content" key={i}>
                        <p>
                            {trend?.category} - {trend?.trending && 'trending'}
                        </p>
                        <h5>{trend?.tag}</h5>
                        <p>{trend?.tweets} tweets</p>
                    </div>
                );
            })}
        </div>
    );
};

export default Trend;
