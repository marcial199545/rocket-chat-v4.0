import { SOCKET_JOIN_ROOM, SOCKET_LEAVE_ROOM } from "../actions/types";
const initialState: any = {
    currentRoom: null
};

export default function(state = initialState, action: any) {
    const { type, payload } = action;
    switch (type) {
        case SOCKET_JOIN_ROOM:
            return {
                ...state,
                currentRoom: payload
            };
        case SOCKET_LEAVE_ROOM:
            return {
                ...state,
                currentRoom: null
            };
        default:
            return state;
    }
}
