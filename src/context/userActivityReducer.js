export const ActivityReducer = (state, action) => {
    switch (action.type) {
        case 'SUCCESS_POST':
            return { ...state, tweets: state.tweets + action.value };
        case 'ADD_FOLLOWING':
            return { ...state, following: state + 1 };
        case 'ADD_FOllOWERS':
            return { ...state, followers: state + 1 };
        default:
            return state;
    }
};
