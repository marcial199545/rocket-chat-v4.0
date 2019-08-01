import mongoose, { Schema, model } from "mongoose";
import MessageSchema from "./Schemas/MessageSchema";
const MessagesCollectionSchema = new Schema({
    messages: [MessageSchema]
});
const MessagesCollection = model("messages", MessagesCollectionSchema);
export default MessagesCollection;
