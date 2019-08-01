import { CONTACTS_LOADED, CLEAR_CONTACTS, GROUPS_LOADED, EMPTY_GROUPS } from "../actions/types";
const initialState: any = {
    contacts: null,
    showingGroups: false
};

export default function(state = initialState, action: any) {
    const { type, payload } = action;
    switch (type) {
        case CONTACTS_LOADED:
            return {
                ...state,
                showingGroups: false,
                contacts: [...payload]
            };

        case GROUPS_LOADED:
            return {
                ...state,
                contacts: [...payload],
                showingGroups: true
            };
        case EMPTY_GROUPS:
            return {
                ...state,
                contacts: [],
                showingGroups: true
            };

        case CLEAR_CONTACTS:
            return {
                contacts: null
            };
        // case REMOVE_ALERT:
        //     return state.filter((alert: any) => alert.id !== payload);
        default:
            return state;
    }
}
