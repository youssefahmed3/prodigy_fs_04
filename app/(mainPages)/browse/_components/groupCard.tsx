"use client";
import LockLogo from "@/assets/lockLogo";
import UnlockLogo from "@/assets/unlockLogo";
import ButtonWithLogo from "@/components/ButtonWithLogo";
import { addUserToApproveList, joinChat } from "@/lib/actions/chat.actions";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

interface GroupCardProps {
  id?: string;
  name: string;
  protected: boolean;
  isUserInApproveList: boolean;
  members: number;
  disabled: boolean;
  userId: string;
}

function GroupCard(props: GroupCardProps) {
  const router = useRouter();
  
  const [buttonDisabled, setButtonDisabled] = useState(props.disabled);
  const [buttonText, setButtonText] = useState(
    props.disabled
      ? props.isUserInApproveList
        ? "Approval is sent"
        : "Already Joined"
      : "Join Group"
  );

  const handleJoinChat = async () => {
    console.log(`ChatId = ${props.id} , userId = ${props.userId}`);

    if (props.protected) {
      const resp = await addUserToApproveList(props.id as string, props.userId);
      if (resp) {
        toast("Approve sent to the Group");
        console.log("Approve sent to the Group");
        console.log(resp);
        setButtonText("Approval is sent");
        setButtonDisabled(true);
      }
    } else {
      const joined = await joinChat(props.id as string, props.userId);
      if (joined) {
        toast(`Successfully joined The Group <${props.name}>`);
        console.log(joined);
        setButtonText("Already Joined");
        setButtonDisabled(true);
      }
    }
  };

  return (
    <div className="bg-primary_colors-white_1 text-primary_colors-black_1 px-5 py-3 w-[300px] h-[120px] rounded-md flex flex-col justify-between ">
      <div className="flex justify-between items-center">
        <p className="font-bold">{props.name}</p>
        {props.protected ? <LockLogo /> : <UnlockLogo />}
      </div>

      <div className="flex justify-between items-center">
        <p className="font-bold">{props.members} Member/s</p>
        <ButtonWithLogo
          name={buttonText}
          type="Button"
          variant="primary"
          disabled={buttonDisabled}
          onClick={handleJoinChat}
        />
      </div>
    </div>
  );
}

export default GroupCard;
