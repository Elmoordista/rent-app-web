// useDelete.js
import moment from 'moment';

export const getTimeDif = (date) => {
    const data_val = moment(date).fromNow();
    // return data_val;
    return data_val.replace('minutes', 'min');
};
export const addDays = (date, days) => {
    const data_val = moment(date).add(days, 'days')
    return data_val;
};

export const changeFormatReplyAt = (date) => {
    const data_val = moment(date).format('ddd, MMM D, Y [at] h:mm A');
    return data_val;
};

export const changeFormat = (date) => {
    const data_val = moment(date).format('MMM D, Y h:mm a');
    return data_val;
};

export const changeDateFormat = (date) => {
    const data_val = moment(date).format('MMM D, Y');
    return data_val;
};

export const getResponseTimeDiff = (start, end) => {
    if(!start  || !end){
        return '';
    }
    const data_val = moment(start).from(end);
    return data_val.replace(' ago', ''); 
};
export const isMoreThanADayAgo = (date) => {
    const daysDifference = moment().diff(date, 'days');
    return daysDifference > 1 ;
}

