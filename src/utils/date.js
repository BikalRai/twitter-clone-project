export const calcDate = (date) => {
    let status = '';

    //current time
    const now = new Date().getTime();

    //calculation to minutes
    const timeDiff = Math.floor((now - date) / (1000 * 60));
    console.log(timeDiff, ' diff');

    const hours = Math.floor(timeDiff / 60);
    const days = Math.floor(timeDiff / (60 * 24));
    const weeks = Math.floor(timeDiff / (60 * 7 * 24));
    const months = Math.floor(timeDiff / (60 * 4 * 24 * 7));
    console.log(hours, ' hours');

    if (timeDiff < 1) {
        status = 'now';
    } else if (timeDiff >= 1 && timeDiff < 60) {
        status = `${timeDiff} minutes`;
    } else if (timeDiff >= 60 && timeDiff < 1440) {
        status = `${hours} hour(s)`;
    } else if (timeDiff >= 1440 && timeDiff < 10080) {
        status = `${days} day(s)`;
    } else if (timeDiff >= 10080 && timeDiff < 40320) {
        status = `${weeks} week(s)`;
    } else if (timeDiff >= 1 && timeDiff < 4) {
        status = `${months} month(S)`;
    } else {
        status = `${new Date().getMonth()}`;
    }

    return status;
};
