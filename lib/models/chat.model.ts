"use server"

import mongoose from 'mongoose';
import { UserType } from './user.model';
import { MessageType } from './message.model';

export interface ChatType {
    id?: string;
    name: string;
    type: string;
    joined?: UserType[] | string[];
    approveList?: UserType[] | string[];
    messages?: MessageType[] | [],
    private: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const chatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    joined:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
        required: false
    }],
    approveList:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
        required: false
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
        required: false
    }],
    private: {
        type: Boolean,
        required: true,
    },
},
    { timestamps: true }
);

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);


export default Chat;