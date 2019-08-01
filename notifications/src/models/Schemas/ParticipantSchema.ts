import { Schema } from "mongoose";

const ParticipantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
});
export default ParticipantSchema;
