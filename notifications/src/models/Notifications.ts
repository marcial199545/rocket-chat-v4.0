import mongoose, { Schema, model } from "mongoose";
import ContactSchema from "./Schemas/ContactSchema";
import ConversationSchema from "./Schemas/ConversationSchema";
import MessageSchema from "./Schemas/MessageSchema";
const UserNotificationSchema = new Schema({
    contacts: [ContactSchema],
    conversations: [ConversationSchema]
});
const UserNotification = model("user", UserNotificationSchema);
export default UserNotification;
