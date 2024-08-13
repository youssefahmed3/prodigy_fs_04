"use client";
import React, { useEffect, useRef, useState } from "react";
import ButtonWithLogo from "./ButtonWithLogo";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddLogo from "@/assets/addLogo";
import PeopleAddLogo from "@/assets/peopleAddLogo";
import SignOutLogo from "@/assets/signOutLogo";
import SettingsLogo from "@/assets/settingsLogo";
import ChatCard from "./chatCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getChatsForUser } from "@/lib/actions/chat.actions";
import { ChatType } from "@/lib/models/chat.model";
import { getSocket } from "@/lib/socket";
import WorldLogo from "@/assets/worldLogo";
import Link from "next/link";

function Sidebar() {
  const [userChats, setUserChats] = useState<ChatType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadMessages, setUnreadMessages] = useState<{ [key: string]: number }>({});
  const activeChatIdRef = useRef<string | null>(null);

  const customTabStyle = "rounded-full text-primary_colors-blue_2 active:bg-primary_colors-blue_2 data-[state=active]:bg-primary_colors-blue_2 data-[state=active]:text-primary_colors-white_2";
  const inputCustomStyle = "h-[30px] self-center bg-primary_colors-black_3 border-primary_colors-black_3 text-primary_colors-white_1 placeholder:text-primary_colors-white_1";
  const TabsContentCustomStyle = "bg-primary_colors-black_3 px-2 py-2 rounded-sm flex-grow w-full h-full ";

  const { data: session } = useSession();
  const router = useRouter();
  const socket = getSocket();

  useEffect(() => {
    socket.connect();

    async function getChatMessages() {
      if (session?.user?.id) {
        const chats = await getChatsForUser(session.user.id);
        setUserChats(chats);
      }
    }

    getChatMessages();

    socket.on("received_message", (messageObj) => {
      setUnreadMessages((prevUnreadMessages) => {
        const chatId = messageObj.chatId;

        // Only increment unread count if the chat is not active
        if (chatId !== activeChatIdRef.current) {
          return {
            ...prevUnreadMessages,
            [chatId]: (prevUnreadMessages[chatId] || 0) + 1,
          };
        }
        return prevUnreadMessages;
      });
    });

    return () => {
      socket.off("received_message");
    };
  }, [session?.user?.id, socket]);

  const clearUnreadMessages = (chatId: string) => {
    activeChatIdRef.current = chatId;

    setUnreadMessages((prevUnreadMessages) => {
      const updatedUnreadMessages = { ...prevUnreadMessages };
      delete updatedUnreadMessages[chatId];
      return updatedUnreadMessages;
    });
  };

  const filteredChats = userChats.filter((chat) =>
    chat.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-primary_colors-black_1 grid grid-cols-[max] grid-rows-[auto_1fr_auto] px-4 py-4 rounded-r-md gap-4 h-screen">
      {/* Top SideBar */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <Link href={"/"} className="text-2xl font-bold">
            Chat App
          </Link>
          <div className="flex gap-2">
            <ButtonWithLogo
              variant="primary"
              image={<WorldLogo />}
              onClick={() => router.push("/browse")}
            />
            <ButtonWithLogo
              variant="primary"
              image={<AddLogo />}
              onClick={() => router.push("/creategroup")}
            />
            <ButtonWithLogo
              variant="secondary"
              image={<PeopleAddLogo />}
              onClick={() => router.push("/addfriends")}
            />
          </div>
        </div>
        <Input
          type="text"
          placeholder="Filter By Name of Chat or Group...."
          className={inputCustomStyle}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Middle SideBar */}
      <Tabs defaultValue="all_chats" className="flex flex-col items-center">
        <TabsList className="bg-primary_colors-black_1 text-primary_colors-white_1 gap-4">
          <TabsTrigger value="all_chats" className={customTabStyle}>
            All Chats
          </TabsTrigger>
          <TabsTrigger value="messages" className={customTabStyle}>
            Messages
          </TabsTrigger>
          <TabsTrigger value="groups" className={customTabStyle}>
            Groups
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all_chats" className={TabsContentCustomStyle}>
          <ScrollArea className="w-full h-[450px] rounded-md">
            <div className="flex gap-2 flex-col">
              {filteredChats.map((chat: ChatType) => (
                <ChatCard
                  key={chat._id}
                  chatId={chat._id}
                  type={chat.type}
                  username={chat.displayName}
                  lastMessage={
                    chat.messages.length
                      ? chat.messages[chat.messages.length - 1].content
                      : "New Chat, No Messages"
                  }
                  unreadCount={unreadMessages[chat._id] || 0}
                  onClick={() => clearUnreadMessages(chat._id)}
                  isActive={activeChatIdRef.current === chat._id}
                />
              ))}
              <p className="text-sm text-center font-mono">No More Chats</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="messages" className={TabsContentCustomStyle}>
          <ScrollArea className="w-full h-[450px] rounded-md">
            <div className="flex gap-2 flex-col">
              {filteredChats.map((chat: ChatType) => {
                return chat.type === "messages" ? (
                  <ChatCard
                    key={chat._id}
                    chatId={chat._id}
                    type={chat.type}
                    username={chat.displayName}
                    lastMessage={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].content
                        : "New Chat, No Messages"
                    }
                    unreadCount={unreadMessages[chat._id] || 0}
                    onClick={() => clearUnreadMessages(chat._id)}
                    isActive={activeChatIdRef.current === chat._id}
                  />
                ) : null;
              })}
              <p className="text-sm text-center font-mono">No More Messages</p>
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="groups" className={TabsContentCustomStyle}>
          <ScrollArea className="w-full h-[450px] rounded-md">
            <div className="flex gap-2 flex-col">
              {filteredChats.map((chat: ChatType) => {
                return chat.type === "groups" ? (
                  <ChatCard
                    key={chat._id}
                    type={chat.type}
                    chatId={chat._id}
                    username={chat.displayName}
                    lastMessage={
                      chat.messages.length
                        ? chat.messages[chat.messages.length - 1].content
                        : "New Chat, No Messages"
                    }
                    unreadCount={unreadMessages[chat._id] || 0}
                    onClick={() => clearUnreadMessages(chat._id)}
                    isActive={activeChatIdRef.current === chat._id}
                  />
                ) : null;
              })}
              <p className="text-sm text-center font-mono">No More Groups</p>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Bottom SideBar */}
      <div className="bg-primary_colors-black_3 flex justify-between items-center px-2 py-2 rounded-md">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={session?.user?.avatar} />
            <AvatarFallback className="bg-primary_colors-black_2">
              {session?.user!.username.slice(0, 2).toUpperCase() ||
                session?.user!.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="text-sm font-bold">
              {session?.user?.name || session?.user!.username}
            </p>
            <p className="text-sm font-mono">{session?.user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <ButtonWithLogo
            variant="secondary"
            image={<SettingsLogo />}
            onClick={() => router.push(`/settings/${session?.user?.id}`)}
          />
          <ButtonWithLogo
            variant="danger"
            image={<SignOutLogo />}
            onClick={() => signOut()}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
