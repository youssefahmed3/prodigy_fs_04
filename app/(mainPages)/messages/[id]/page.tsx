"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import ButtonWithLogo from "@/components/ButtonWithLogo";
import ArrowRightLogo from "@/assets/arrowRightLogo";
import { addMessageToChat, getChatById } from "@/lib/actions/chat.actions";
import { useSession } from "next-auth/react";
import MessageCard from "@/components/messageCard";
import { ChatType } from "@/lib/models/chat.model";
import { MessageType } from "@/lib/models/message.model";
import { getSocket } from "@/lib/socket";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface cardProps {
  username: string;
  status: string;
  avatar?: string;
}

function Page(props: cardProps) {
  const { id } = useParams();
  const { data: session } = useSession();
  const [chatData, setChatData] = useState<ChatType>({ messages: [] });
  const [joinedRoom, setJoinedRoom] = useState(false);
  const [message, setMessage] = useState("");
  const socket = getSocket();

  // Ref for the last message element
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const inputCustomStyle =
    "h-[40px] self-center bg-primary_colors-black_3 border-primary_colors-black_3 text-primary_colors-white_1 placeholder:text-primary_colors-white_1";

  useEffect(() => {
    if (id && session?.user?.id) {
      const joinRoom = () => {
        socket.emit("join_room", id);
        setJoinedRoom(true);

        const getChatDetails = async () => {
          const chat = await getChatById(id as string, session.user.id as string);
          setChatData(chat);
        };

        getChatDetails();

        return () => {
          socket.emit("leave_room", id);
          setJoinedRoom(false);
        };
      };

      if (!joinedRoom) {
        joinRoom();
      }
    }
  }, [session?.user?.id, id, socket, joinedRoom]);

  useEffect(() => {
    const handleMessageReceived = (messageObj) => {
      setChatData((prevChatData) => ({
        ...prevChatData,
        messages: [...prevChatData.messages, messageObj],
      }));
    };

    socket.on("received_message", handleMessageReceived);


    return () => {
      socket.off("received_message", handleMessageReceived);
    };
  }, [socket]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData.messages]);

  async function sendMessage() {
    if (!message.trim()) return; // Avoid sending empty messages

    const newMessage: MessageType = {
      chatId: id,
      senderId: session?.user?.id!,
      content: message,
      createdAt: new Date().toLocaleString(),
      id: `${Date.now()}`, // Temporary ID for frontend
    };

    // Emit the new message to the server
    socket.emit("send_message", newMessage);
        

    // Clear the input field
    setMessage("");

    // Save the message to the database
    await addMessageToChat(newMessage);
  }

  return (
    <div className="mr-4 my-2 flex flex-col gap-4">
      <div className="bg-primary_colors-black_1 flex justify-between py-2 px-3 rounded-sm gap-2 items-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary_colors-black_3">
              {chatData?.displayName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-xl font-bold">
              {chatData ? chatData.displayName : ""}
            </p>
            <p className="text-sm">{props.status}</p>
          </div>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <ButtonWithLogo
              variant="secondary"
              name="Members"
              classname="text-primary_colors-black_1"
            />
          </DrawerTrigger>
          <DrawerContent className="bg-primary_colors-black_2 border-primary_colors-black_2">
            <DrawerHeader>
              <DrawerTitle>Members</DrawerTitle>
              <DrawerClose />
            </DrawerHeader>
            <DrawerDescription className="px-4 mb-10 text-primary_colors-white_1">
              <div className="flex flex-col gap-2">
                {chatData.joined?.map((user, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary_colors-black_3">
                          {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p>{user.username}</p>
                    </div>
                    <p>{user.email}</p>
                  </div>
                ))}
              </div>
            </DrawerDescription>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="bg-primary_colors-black_1 flex flex-col flex-grow rounded-md items-center py-3">
        <ScrollArea className="w-full h-[565px] rounded-md">
          <div className="flex flex-col gap-3 flex-grow self-stretch px-4 overflow-auto">
            {chatData?.messages?.map((message: MessageType, index: number) => (
              <div
                key={message.id}
                ref={index === chatData.messages.length - 1 ? lastMessageRef : null}
                className={`flex ${
                  message.senderId === session?.user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <MessageCard
                  content={message.content}
                  createdAt={message.createdAt}
                  senderId={message.senderId === session?.user?.id ? "You" : message.senderId}
                  isCurrentUser={message.senderId === session?.user?.id}
                />
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-between px-4 py-2 self-stretch">
          <Input
            type="text"
            className={`${inputCustomStyle} w-[93%]`}
            placeholder="send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <ButtonWithLogo
            image={<ArrowRightLogo />}
            variant="secondary"
            onClick={sendMessage}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
