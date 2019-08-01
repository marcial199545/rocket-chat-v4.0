import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import uuid = require("uuid");
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    contactId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    profileSettings: {
        language: {
            type: String,
            default: "en"
        },
        socials: {
            twitter: {
                type: String,
                default: "twitter"
            },
            facebook: {
                type: String,
                default: "facebook",
                trim: true
            },
            instagram: {
                type: String,
                default: "instagram"
            }
        }
    }
});

UserSchema.pre("save", async function(next) {
    const user: any = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = model("user", UserSchema);

export default User;
