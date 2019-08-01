import { MESSAGES_LOADED, CLEAR_MESSAGES } from "./types";
import { setAlert } from "./alert";
import axios from "axios";
import { autoScroll } from "../helpers";

export const loadMessages = (contact: any) => async (dispatch: any) => {
    try {
        let currentUserInfo: any = await axios.get("/api/users/me");
        let contactInfo: any = await axios.post("/api/users/contact", { email: contact.email });
        let body = {
            currentUserProfile: currentUserInfo.data,
            contactProfile: contactInfo.data.contact,
            roomId: contact.roomId
        };
        let messagesReq = await axios.post("/api/notifications/contact/conversation", body);
        //NOTE load the messages using the roomId and set the messages state with the return value of fetching the messages
        const payload = {
            messages: messagesReq.data.messages[0].messages,
            participants: messagesReq.data.participantsCurrentUser,
            roomId: messagesReq.data.roomId
        };
        dispatch({
            type: CLEAR_MESSAGES
        });
        dispatch({
            type: MESSAGES_LOADED,
            payload
        });

        setTimeout(() => {
            autoScroll();
        }, 200);
    } catch (error) {
        console.log(error);
        const errors = error.response.data.errors ? error.response.data.errors : undefined;
        if (errors) {
            errors.forEach((error: any) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};
export const loadGroupMessages = (conversation: any) => async (dispatch: any): Promise<void> => {
    try {
        const currentUser = await axios.get("/api/users/me");
        const body = {
            id: currentUser.data._id,
            roomId: conversation.roomId
        };
        let messages = await axios.post(`/api/notifications/group/conversation/messages`, body);
        const payload = {
            messages: messages.data,
            participants: conversation.participants,
            roomId: conversation.roomId
        };
        dispatch({
            type: CLEAR_MESSAGES
        });
        dispatch({
            type: MESSAGES_LOADED,
            payload
        });

        setTimeout(() => {
            autoScroll();
        }, 200);
    } catch (error) {
        console.log(error);
    }
};
export const clearMessages = () => async (dispatch: any): Promise<void> => {
    try {
        dispatch({
            type: CLEAR_MESSAGES
        });
    } catch (error) {
        console.log(error);
    }
};
