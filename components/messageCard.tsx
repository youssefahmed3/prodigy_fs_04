"use client"
import { getUsernameById } from "@/lib/actions/user.actions";
import { MessageType } from "@/lib/models/message.model";
import React, { useEffect, useState } from "react";

interface MessageProps extends MessageType {
    isCurrentUser: boolean
}

function MessageCard(props: MessageProps) {
  const [username, SetUsername] = useState("");
  useEffect(() => {
    async function getUsername() {
      if(props.senderId !== "You") {
        const user = await getUsernameById(props.senderId as string);
        SetUsername(user)
      }
    }
    getUsername();
  },[props.senderId])

  const currentUsercustomStyles = "bg-primary_colors-white_1 px-2 rounded-sm py-1 text-primary_colors-black_1"
  const otherCustomStyles = "bg-primary_colors-blue_1 px-2 rounded-sm py-1 "
  return (
    <div className={`flex flex-col gap-1 w-max`}>
      <div className={`${props.isCurrentUser ? currentUsercustomStyles: otherCustomStyles}`}>{props.content}</div>
      <div className="flex justify-between gap-5">
        <p>{props.senderId !== "You" ? username : props.senderId }</p>
        <p>{props.createdAt?.toLocaleString()}</p>
      </div>
    </div>  
  );
}

export default MessageCard;
