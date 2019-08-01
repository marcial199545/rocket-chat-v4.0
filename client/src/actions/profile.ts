import axios from "axios";
import { setAlert } from "./alert";
import { PROFILE_ERROR, UPDATE_PROFILE } from "./types";

//NOTE Update Profile Settings
export const updateProfileSettings = (formData: any) => async (dispatch: any) => {
    const profileSettings = {
        language: formData.language ? formData.language : "",
        socials: {
            facebook: formData.facebook ? formData.facebook : "",
            twitter: formData.twitter ? formData.twitter : "",
            instagram: formData.instagram ? formData.instagram : "",
            youtube: formData.youtube ? formData.youtube : "",
            linkedin: formData.linkedin ? formData.linkedin : ""
        }
    };
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        const res = await axios.put("/api/users/profile/update", profileSettings, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        });
        dispatch(setAlert("Profile Updated", "success", "profileSettings-alert-profileUpdated"));
    } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach((error: any) => dispatch(setAlert(error.msg, "danger")));
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        });
    }
};
