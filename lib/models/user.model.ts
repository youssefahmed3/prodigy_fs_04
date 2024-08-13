"use server"

import mongoose from 'mongoose';
import { ChatType } from './chat.model';

export interface UserType {
    id?: string;
    username: string;
    email: string;
    avatar?: string;
    friendRequest?: UserType[] | string;
    friends?: UserType[] | string;
    groups?: ChatType[] | string;
    password?: string;
    provider?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
        required: false,
    },
    friendRequests: {
        ref: 'User',
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    friends: {
        ref: 'User',
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    groups: {
        ref: 'Chat',
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
        required: false
    },
    password: {
        type: String,
        required: false,
        unique: false
    },
    provider: {
        type: String,
        default: 'credentials',
    }
},
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);


export default User;