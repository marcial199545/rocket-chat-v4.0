import { ADD_GROUP, CLEAR_GROUP } from "../actions/types";
const initialState: any = {
    currentGroup: null,
    loading: true
};

export default function(state = initialState, action: any) {
    const { type, payload } = action;
    switch (type) {
        case ADD_GROUP:
            return {
                ...state,
                currentGroup: payload,
                loading: false
            };

        case CLEAR_GROUP:
            return {
                ...state,
                contacts: null,
                loading: false
            };
        default:
            return state;
    }
}
