"use server"

import mongoose from 'mongoose';
import { UserType } from './user.model';
import { ChatType } from './chat.model';

export interface MessageType {
    id?: string;
    chatId?: ChatType | string;
    senderId: UserType | string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const messageSchema = new mongoose.Schema({
    chatId: {
        ref: 'Chat',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senderId: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);


export default Message;