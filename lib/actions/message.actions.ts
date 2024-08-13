"use server"
import Message, { MessageType } from "../models/message.model";
import connectToDb from "../mongodb";

export async function createMessage(messageData: MessageType) {

    try {
        await connectToDb();
        const message = await Message.create({
            chatId: messageData.chatId,
            senderId: messageData.senderId,
            content: messageData.content
        });

        return {
            ...message.toObject(), // Convert Mongoose document to plain object
            id: message._id.toString(),
            chatId: message.chatId.toString(),
            senderId: message.senderId.toString(),
        };
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Error creating message");
    }
}