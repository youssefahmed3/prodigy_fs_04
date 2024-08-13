"use server"
import mongoose from "mongoose";
import { hashPassword } from "../isValidPassword";
import Chat, { ChatType } from "../models/chat.model";
import { MessageType } from "../models/message.model";
import connectToDb from "../mongodb";
import { createMessage } from "./message.actions";

export async function createChat(chatData: ChatType) {


    try {
        await connectToDb();
        const chat = await Chat.create({
            name: chatData.name,
            type: chatData.type,
            joined: chatData.joined!.map(id => new mongoose.Types.ObjectId(id as string)),
            private: chatData.private,

        });

        return true;
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Error creating chat");
    }
}

export async function addMessageToChat(messageData: MessageType) {

    try {
        await connectToDb();
        const message = await createMessage({ chatId: messageData.chatId, senderId: messageData.senderId, content: messageData.content })

        console.log(`message is created : ${message}`);

        const chat = await Chat.findByIdAndUpdate(
            messageData.chatId,
            { $push: { messages: message.id } },
            { new: true }
        )

        console.log(`chat is updated : ${chat}`);


        return true;
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Error adding message to chat");
    }

}

export async function joinChat(chatId: string, userId: string) {
    // add userid to chat in joined if not the user already in the chat
    try {
        await connectToDb();
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { joined: userId } },
            { new: true }
        )
        console.log(`chat is updated : ${chat}`);
        return true;
    }
    catch (error: any) {
        console.log(error.message);
        throw new Error("Error joining chat");
    }
}

export async function addUserToApproveList(chatId: string, userId: string) {
    try {
        await connectToDb();

        const chat = await Chat.findById(chatId);

        if (!chat) {
            throw new Error("Chat not found");
        }

        // Check if the user is already in the joined list
        const isUserJoined = chat.joined.some(member => String(member) === userId);
        if (isUserJoined) {
            throw new Error("User is already in the Group");
        }

        // Check if the user is already in the approve list
        const isUserInApproveList = chat.approveList.some(member => String(member) === userId);
        if (isUserInApproveList) {
            throw new Error("User already sent an approval request");
        }

        // Add the user to the approve list
        chat.approveList.push(userId);
        await chat.save();

        console.log(`Chat is updated: ${chat}`);
        return true;
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Error adding user to approveList");
    }
}

export async function acceptUserAprroval(userId: string, chatId: string) {
    // update the chat status to active and remove the user from approve list
    try {
        await connectToDb();

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { joined: userId }, $pull: { approveList: userId } },
            { new: true }
        )
        console.log(`chat is updated : ${chat}`);

        return true;
        
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Error accepting user approval");
    }
}

export async function denyUserAprroval(userId: string, chatId: string) {
    // update the chat status to active and remove the user from approve list
    try {
        await connectToDb();

        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { approveList: userId } },
            { new: true }
        )
        console.log(`chat is updated : ${chat}`);

        return true;
        
    } catch (error: any) {
        console.log(error.message);
        throw new Error("Error accepting user approval");
    }
}

export async function getChatsForUser(userId: string) {
    try {
        await connectToDb();

        const chats = await Chat.find({ joined: userId }).populate('joined', 'username email avatar').populate('messages', 'senderId content createdAt').lean();

        const customizedChats = await Promise.all(chats.map(async chat => {
            //handle if there is group chat keep the name of it if not group chat then displayName of the other User

            if (chat.type === 'groups') {
                return {
                    ...chat,
                    displayName: chat.name
                }
            } else {
                const otherUser = chat.joined.find(user => user._id.toString() !== userId);
                const displayName = otherUser ? otherUser.username : chat.name;

                return {
                    ...chat,
                    displayName,
                };
            }
        }));

        return customizedChats;
    } catch (error) {
        console.error('Error fetching chats for user:', error.message);
        throw error;
    }
}

export async function getChatById(chatId: string, userId: string) {
    try {
        await connectToDb();

        // Find the chat by its ID and populate the necessary fields
        const chat = await Chat.findById(chatId)
            .populate('joined', 'username email avatar')
            .populate('approveList', 'username email avatar')
            .populate('messages', 'senderId content createdAt')
            .lean();

        if (!chat) {
            throw new Error('Chat not found');
        }

        if (chat.type === 'groups') {
            return {
                ...chat,
                displayName: chat.name
            }
        } else {
            const otherUser = chat.joined.find(user => user._id.toString() !== userId);
            const displayName = otherUser ? otherUser.username : chat.name;

            return {
                ...chat,
                displayName,
            };
        }

        /* // Find the other user in the chat
        const otherUser = chat.joined.find(user => user._id.toString() !== userId);
        const displayName = otherUser ? otherUser.username : chat.name;

        // Customize the chat object with the display name
        const customizedChat = {
            ...chat,
            displayName,
        }; */

        /* return customizedChat; */
    } catch (error: any) {
        console.error('Error fetching chat by id:', error.message);
        throw error;
    }
}

export async function FetchAllGroups() {
    try {
        await connectToDb();
        const groups = await Chat.find({ type: 'groups' }).populate('joined', 'username email avatar').populate('approveList', 'username email avatar').populate('messages', 'senderId content createdAt').lean();
        return groups;
    } catch (error: any) {
        console.error('Error fetching all groups:', error.message);
        throw error;
    }
}



/* Testing and adding Fields */
export async function updateAllChats() {
    try {
        await connectToDb();

        const result = await Chat.updateMany(
            {},
            { $unset: { password: "" } } // Use $unset to remove the field
        );

        console.log('Documents updated', result);
        return result
    } catch (error) {
        console.error(`Error updating documents: ${error}`);
    }
}

export async function updateAllChatsWithApprove() {
    try {
        await connectToDb();

        const result = await Chat.updateMany(
            {},
            { $set: { approveList: [] } } // Use $unset to remove the field
        );

        console.log('Documents updated', result);
        return result
    } catch (error) {
        console.error(`Error updating documents: ${error}`);
    }
}