import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

export const setAlert = (msg: string, alertType: string, idIntl: string = "", time = 2000) => (dispatch: any) => {
    const id = uuid.v4();
    const payload = {
        msg,
        alertType,
        id,
        idIntl
    };
    dispatch({
        type: SET_ALERT,
        payload
    });
    setTimeout(() => {
        dispatch({
            type: REMOVE_ALERT,
            payload: id
        });
    }, time);
};
