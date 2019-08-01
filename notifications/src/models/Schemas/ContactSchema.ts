import { Schema } from "mongoose";
const ContactSchema = new Schema(
    {
        contactProfile: {
            name: {
                type: String
            },
            email: {
                type: String
            },
            avatar: {
                type: String
            },
            roomId: {
                type: String
            },
            _id: {
                type: Schema.Types.ObjectId,
                ref: "users"
            }
        },
        status: {
            type: String,
            default: "pending"
        }
    },
    { _id: false }
);
export default ContactSchema;
