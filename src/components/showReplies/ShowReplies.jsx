import React from 'react';
import { calcDate } from '../../utils/date';
import './showreplies.css';
const ShowReplies = ({ tweets }) => {
    return tweets?.map((tweet, index) => {
        return (
            <div className="showReplies" key={index}>
                {tweet?.replies?.map((reply, i) => {
                    return (
                        <div className="showReplies__body" key={i}>
                            <p>
                                {`${reply?.repliedBy} @ ${reply?.repliedTo}`}
                                {' - '}
                                {calcDate(reply?.timeStamp)}
                            </p>
                            <p>{reply?.reply?.body}</p>
                        </div>
                    );
                })}
            </div>
        );
    });
};

export default ShowReplies;
