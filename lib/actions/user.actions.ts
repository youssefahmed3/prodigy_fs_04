"use server"
import connectToDb from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { UserType } from "@/lib/models/user.model";
import { hashPassword } from "@/lib/isValidPassword";
import { createChat } from "./chat.actions";

export async function createUser(userData: UserType) {
    let hashedPassword;
    if (userData.password) hashedPassword = await hashPassword(userData.password as string);

    try {
        await connectToDb();
        console.log(User);

        const user = await User.create({
            username: userData.username,
            email: userData.email,
            password: hashedPassword ?? '',
            provider: userData.provider,
            avatar: userData.avatar || ''
        });
        console.log(user);
        return { user: user, error: null };

    } catch (error: any) {
        console.log(error.message);
        return { user: null, error: error.message };
    }
};

export async function getUserByEmail(email: string) {
    try {
        await connectToDb();
        const user = await User.findOne({ email }).lean();
        if (user) {
            // If user is found, transform the user object as needed:
            user.id = user._id.toString();
            user.createdAt = user.createdAt.toLocaleString();
            user.updatedAt = user.updatedAt.toLocaleString();
            // delete user._id;
            console.log(user);

            return user;
        }
        return null

    } catch (error: unknown) {
        console.error('Error fetching user by email:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}

export async function getUserById(id: string): Promise<UserType | null> {
    try {
        await connectToDb();
        const user = await User.findById(id).lean();
        return user as unknown as UserType;

    } catch (error: unknown) {
        console.error('Error fetching user by email:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}

export async function updateUserById(id: string, user: UserType) {
    try {
        await connectToDb();
        const updatedUser = await User.findByIdAndUpdate(id, user, { new: true }).lean();
        return true;
    } catch (error: any) {
        console.error('Error updating user by id:', error instanceof Error? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}

export async function updateUserProviderByEmail(email: string, provider: string) {
    try {
        await connectToDb();
        const user = await User.findOneAndUpdate({ email: email }, { provider: provider }, { new: true }).lean();
        return user;
    } catch (error: any) {
        console.error('Error updating Order status by id:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}

export async function sendFriendRequest(currentUserEmail: string, Friendemail: string) {
    // add current user id to friend's friend request List if not email is already present in friend request list of the friend 
    const user = await getUserByEmail(currentUserEmail);
    if (!user) {
        console.log('User not found.');
        return null;
    }
    const existingFriendRequest = await User.findOne({ email: Friendemail, friendRequests: user.id });
    if (existingFriendRequest) {
        console.log('Friend request already exists.');
        return null;
    }

    try {
        await connectToDb();
        await User.updateOne(
            { email: Friendemail },
            { $push: { friendRequests: user.id } },
            { upsert: true }
        );
        console.log('Friend request sent successfully.');
        return true;
    } catch (error: any) {
        console.error('Error sending friend request:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }

}

export async function AcceptFriendRequest(userEmail: string, friendEmail: string) {
    try {
        await connectToDb();

        // Get the user and friend
        const user = await User.findOne({ email: userEmail });
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            console.log('User or friend not found.');
            return;
        }

        // Remove the friend request from the user's friend requests list
        await User.updateOne(
            { email: userEmail },
            { $pull: { friendRequests: friend.id } }
        );

        // Add the user to the friend's friends list
        await User.updateOne(
            { email: friendEmail },
            { $push: { friends: user.id } }
        );

        console.log('Friend request accepted successfully.');

        const chat = await createChat({ name: `${user.id}-${friend.id}`, type: "messages", joined: [user.id, friend.id], private: false })
        console.log('Chat created successfully : ', chat);

    } catch (error: any) {
        console.error('Error accepting friend request:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}
export async function DenyFriendRequest(userEmail: string, friendEmail: string) {
    try {
        await connectToDb();

        // Get the user and friend
        const user = await User.findOne({ email: userEmail });
        const friend = await User.findOne({ email: friendEmail });

        if (!user || !friend) {
            console.log('User or friend not found.');
            return;
        }

        // Remove the friend request from the user's friend requests list
        await User.updateOne(
            { email: userEmail },
            { $pull: { friendRequests: friend.id } }
        );
        console.log('Friend request accepted successfully.');


    } catch (error: any) {
        console.error('Error accepting friend request:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}

export async function getUserWithFriendRequests(userId: string) {
    return await User.findById(userId)
        .populate('friendRequests', 'username email avatar')
        .lean();
}

export async function getUsernameById(userId: string) {
    try {
        await connectToDb();
        const user = await User.findById(userId).lean();
        return user?.username;

    } catch (error: unknown) {
        console.error('Error fetching user by email:', error instanceof Error ? error.message : error);
        throw error; // Rethrow or handle as needed
    }
}