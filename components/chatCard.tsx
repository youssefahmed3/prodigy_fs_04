"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface chatCardProps {
  chatId: string;
  username: string;
  lastMessage: string;
  type: string;
  unreadCount: number;
  onClick: (chatId: string) => void;
  isActive: boolean; // New prop to indicate if this chat is currently active
}

function ChatCard(props: chatCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    props.onClick(props.chatId);

    if (props.type === "messages") {
      router.push(`/messages/${props.chatId}`);
    } else {
      router.push(`/groups/${props.chatId}`);
    }
  };

  return (
    <div
      className="flex gap-4 rounded-sm bg-primary_colors-black_1 w-full px-4 py-2 items-center justify-between hover:cursor-pointer hover:bg-primary_colors-black_2"
      onClick={handleCardClick}
    >
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage />
          <AvatarFallback className="bg-primary_colors-black_3">
            {props.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-1">
          <p className="text-md">{props.username}</p>
          <p
            className={`text-sm ${
              props.lastMessage
                ? "text-primary_colors-blue_2"
                : "text-primary_colors-red_1"
            }`}
          >
            {props.lastMessage}
          </p>
        </div>
      </div>
      {!props.isActive && props.unreadCount > 0 && (
        <div className="text-primary_colors-white_1 text-xs bg-primary_colors-red_1 px-3 py-2 rounded-full text-center">
          {props.unreadCount}
        </div>
      )}
    </div>
  );
}

export default ChatCard;
