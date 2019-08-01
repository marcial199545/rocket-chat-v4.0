import { Schema } from "mongoose";
import ParticipantSchema from "./ParticipantSchema";
const ConversationSchema = new Schema(
    {
        participants: [ParticipantSchema],
        roomId: {
            type: String,
            required: true
        },
        groupName: {
            type: String,
            default: "none"
        },
        flag: {
            type: String,
            default: "private"
        },
        avatar: {
            type: String
        }
    },
    {
        _id: false
    }
);
export default ConversationSchema;
