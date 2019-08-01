import { ADD_GROUP, CLEAR_GROUP } from "./types";
import { setAlert } from "./alert";
import axios from "axios";

export const addGroupConversation = (socket: any, data: any, history?: any) => async (dispatch: any): Promise<void> => {
    try {
        // eslint-disable-next-line
        let { participants, groupName } = data;
        if (participants.length === 0) {
            dispatch(setAlert("Add at least one participant", "warning", "addGroup-alert-oneParticipant"));
            return;
        }
        if (groupName.trim().length === 0) {
            dispatch(setAlert("Please Provide a valid Group Name", "warning", "addGroup-alert-validName"));
            return;
        }
        let currentUserInfo: any = await axios.get("/api/users/me");
        if (
            !participants.find((participant: any) => {
                return participant.email === currentUserInfo.data.email;
            })
        ) {
            participants.unshift(currentUserInfo.data);
        }
        await axios.post("/api/notifications/group/conversation", data);
        history.push("/dashboard");
    } catch (error) {
        console.log(error);
    }
};
export const addCurrentGroup = (group: any) => async (dispatch: any): Promise<void> => {
    try {
        await dispatch({
            type: ADD_GROUP,
            payload: group
        });
    } catch (error) {
        console.log(error);
    }
};
export const clearCurrentGroup = () => async (dispatch: any): Promise<void> => {
    try {
        await dispatch({
            type: CLEAR_GROUP
        });
    } catch (error) {
        console.log(error);
    }
};
export const editConversationGroup = (socket: any, data: any) => async (dispatch: any): Promise<void> => {
    try {
        const { participants, groupName, currentConversation, messages } = data;
        await axios.put("/api/notifications/group/conversation/edit", data);
        await axios.post("/api/notifications/group/conversation", {
            participants,
            groupName,
            currentConversation,
            messages
        });
    } catch (error) {
        console.log(error);
    }
};
