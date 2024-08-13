"use client";
import { Input } from "@/components/ui/input";
import { FetchAllGroups } from "@/lib/actions/chat.actions";
import React, { useEffect, useState } from "react";
import GroupCard from "./_components/groupCard";
import { useSession } from "next-auth/react";
import { ChatType } from "@/lib/models/chat.model";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";

function Page() {
  const [groups, setGroups] = useState<ChatType[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { data: session } = useSession();

  useEffect(() => {
    async function getGroups() {
      const response = await FetchAllGroups();
      setGroups(response);
    }
    getGroups();
  }, []);

  function isUserJoined(group: ChatType): boolean {
    if (!session?.user?.id) return false;
    /*  console.log(`user Is already Joined  : ${group.name}`, group?.joined.some(member => member._id === session.user.id)); */
    //  console.log(`user joined : ${group?.joined.some(member => member._id === session.user!.id)}`);

    return group?.joined.some((member) => member._id === session.user.id);
  }

  function isUserInApproveList(group: ChatType): boolean {
    if (!session?.user?.id) return false;
    if (group?.approveList) {
      /* console.log(`user in approve List : ${group.name}`, group?.approveList.some(member => String(member._id) === String(session.user.id)));
      console.log(`${group.approveList} === ${session.user.id}`); */
      // console.log(`user approve send : ${group?.approveList.some(member => member._id === session.user!.id)}`);

      return group?.approveList.some(
        (member) => member._id === session.user.id
      );
    } else {
      return false;
    }
  }

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ml-4 my-2 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        Browse Public and Private Conversations
      </h1>
      <Input
        placeholder="Search By Name..."
        className="w-[30%] text-primary_colors-black_1"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query state
      />
      <ScrollArea className="w-full h-[550px] rounded-md">
      <div className="flex flex-wrap gap-5">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupCard
              key={group._id}
              id={group._id}
              name={`${group.name}`}
              members={group.joined.length}
              protected={group.private}
              isUserInApproveList={isUserInApproveList(group)}
              disabled={isUserJoined(group) || isUserInApproveList(group)}
              userId={session?.user.id}
            />
          ))
        ) : (
          <p>No groups found</p>
        )}
      </div>
      </ScrollArea>
      
    </div>
  );
}

export default Page;
