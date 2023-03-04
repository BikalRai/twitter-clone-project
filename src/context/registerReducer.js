const registerDetails = {
    displayName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    followers: [],
    following: [],
};

const registerReducer = (state, action) => {
    switch (action.type) {
        case 'displayname':
            return { ...state, displayName: action.value };
        case 'username':
            return { ...state, username: action.value };
        case 'email':
            return { ...state, email: action.value };
        case 'password':
            return { ...state, password: action.value };
        case 'cpassword':
            return { ...state, confirmPassword: action.value };
        default:
            return state;
    }
};

export { registerDetails, registerReducer };
