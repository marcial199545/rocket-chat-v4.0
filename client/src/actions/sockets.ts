import { SOCKET_LEAVE_ROOM, SOCKET_JOIN_ROOM, ADD_MESSAGE } from "./types";
import { setAlert } from "./alert";
import axios from "axios";
import { autoScroll } from "../helpers";
export const leaveRoom = (socket: any, joinedRoom: any) => async (dispatch: any) => {
    try {
        dispatch({ type: SOCKET_LEAVE_ROOM });
        await socket.emit(SOCKET_LEAVE_ROOM, joinedRoom);
    } catch (error) {
        console.log(error);
    }
};
export const joinRoom = (socket: any, roomId: any) => async (dispatch: any) => {
    try {
        dispatch({ type: SOCKET_JOIN_ROOM, payload: roomId });
        await socket.emit(SOCKET_JOIN_ROOM, roomId);
        socket.removeAllListeners();
        socket.on("ROOM_JOINED", (data: any) => {
            dispatch(setAlert(`User joined`, "success", "socket-alert-socketJoined"));
        });
    } catch (error) {
        console.log(error);
    }
};
export const joinAllRooms = (socket: any, contacts: any, showingGroups?: boolean) => async (dispatch: any) => {
    try {
        if (showingGroups) {
            return console.log("TCL: joinAllRooms -> groups", contacts);
        }
        console.log("TCL: joinAllRooms -> contacts", contacts);
        // dispatch({ type: SOCKET_JOIN_ROOM, payload: roomId });
        // await socket.emit(SOCKET_JOIN_ROOM, roomId);
        // socket.removeAllListeners();
        // socket.on("ROOM_JOINED", (data: any) => {
        //     dispatch(setAlert(`User joined`, "success"));
        // });
    } catch (error) {
        console.log(error);
    }
};

export const sendMessage = (socket: any, data: any) => async (dispatch: any) => {
    try {
        let currentUserInfo: any = await axios.get("/api/users/me");
        data.currentUserInfo = currentUserInfo.data;
        let messageRes = await axios.post("/api/notifications/message", data);
        await socket.emit("SEND_MESSAGE", messageRes.data);
        await socket.removeAllListeners();
        await socket.on("NEW_MESSAGE", (data: any) => {
            if (data.sender === currentUserInfo.data._id) {
                console.log("sender");
                dispatch({
                    type: ADD_MESSAGE,
                    payload: data.messageSender
                });
                autoScroll();
            } else {
                console.log("receiver");
                dispatch({
                    type: ADD_MESSAGE,
                    payload: data.messageReceiver
                });
                autoScroll();
            }
        });
    } catch (error) {
        console.log(error);
    }
};
export const sendGroupMessage = (socket: any, data: any) => async (dispatch: any): Promise<void> => {
    try {
        let currentUserInfo: any = await axios.get("/api/users/me");
        data.currentUserInfo = currentUserInfo.data;
        let messageRes = await axios.post("api/notifications/group/mesage", data);
        await socket.emit("SEND_MESSAGE", messageRes.data);
        await socket.removeAllListeners();
        await socket.on("NEW_MESSAGE", (data: any) => {
            if (data.sender === currentUserInfo.data._id) {
                console.log("sender");
                dispatch({
                    type: ADD_MESSAGE,
                    payload: data.messageSender
                });
                autoScroll();
            } else {
                console.log("receiver");
                dispatch({
                    type: ADD_MESSAGE,
                    payload: data.messageReceiver
                });
                autoScroll();
            }
        });
    } catch (error) {
        console.log(error);
    }
};
