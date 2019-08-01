import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    REMOVE_USER,
    UPDATE_PROFILE
} from "../actions/types";
const initialState: any = {
    isAuthenticated: false,
    loading: true,
    user: null
};

export default function(state = initialState, action: any) {
    const { type, payload } = action;
    switch (type) {
        case REGISTER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false
            };
        case LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false
            };
        case UPDATE_PROFILE:
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            };
        case REGISTER_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                loading: false
            };
        case LOGIN_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                loading: false
            };

        case LOGOUT:
            return {
                ...state,
                isAuthenticated: false,
                loading: false
            };
        case AUTH_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        case REMOVE_USER:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                user: null
            };
        default:
            return state;
    }
}
