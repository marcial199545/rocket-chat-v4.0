import { Schema } from "mongoose";

const MessageSchema = new Schema({
    roomId: {
        type: String,
        required: true
    },
    messages: [
        {
            msg: { type: String, required: true },
            date: { type: Date, default: Date.now },
            sent: { type: Boolean, required: true },
            sender: {
                name: {
                    type: String,
                    required: true
                },
                email: {
                    type: String,
                    required: true
                },
                gravatar: {
                    type: String,
                    required: true
                }
            }
        }
    ]
});
export default MessageSchema;
