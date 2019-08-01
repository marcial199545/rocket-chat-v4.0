import axios from "axios";

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    CLEAR_PROFILE,
    LOGOUT,
    SOCKET_LEAVE_ROOM,
    CLEAR_MESSAGES
} from "./types";
import { clearContacts } from "./contacts";
// import { leaveRoom } from "./sockets";
import { setAlert } from "./alert";

// NOTE Register User
export const registerUser = ({
    name,
    email,
    password,
    socket
}: {
    name: string;
    email: string;
    password: string;
    socket: any;
}) => async (dispatch: any) => {
    const config: any = {
        "Content-Type": "application/json"
    };
    const body = { name, email, password };
    try {
        let res = await axios.post("/api/users", body, config);
        // TODO add the request to add the same user in the notification service, the response from the las request contains the same Object id
        await axios.post("/api/notifications", res.data, config);
        dispatch({
            type: REGISTER_SUCCESS
        });

        dispatch(loadUser());
        socket.connect();
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error: any) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({ type: REGISTER_FAIL });
        dispatch(logout());
    }
};
// NOTE Login User
export const login = (email: string, password: string, socket: any) => async (dispatch: any) => {
    const config: any = {
        "Content-Type": "application/json"
    };
    const body = { email, password };
    try {
        await axios.post("/api/auth", body, config);
        dispatch({
            type: LOGIN_SUCCESS
        });
        dispatch(loadUser());
        socket.connect();
    } catch (error) {
        const errors = error.response.data.errors;
        if (errors) {
            errors.forEach((error: any) => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({ type: LOGIN_FAIL });
        dispatch(logout());
    }
};
// NOTE Logout User
export const logout = (socket?: any) => async (dispatch: any) => {
    try {
        await axios.delete("/api/auth");
        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: LOGOUT });
        dispatch({ type: SOCKET_LEAVE_ROOM });
        dispatch(clearContacts());
        dispatch({
            type: CLEAR_MESSAGES
        });
        socket.disconnect();
    } catch (error) {
        console.log(error);
    }
};
//NOTE Load User
export const loadUser = () => async (dispatch: any) => {
    try {
        const res = await axios.get("/api/auth");
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        });
    }
};
