"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ButtonWithLogo from "@/components/ButtonWithLogo";
import {
  AcceptFriendRequest,
  getUserWithFriendRequests,
  sendFriendRequest,
  DenyFriendRequest, // Ensure this import is added
} from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

function Page() {
  const [email, setEmail] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchFriendRequests() {
      if (session?.user?.id) {
        const user = await getUserWithFriendRequests(session.user.id);
        setFriendRequests(user.friendRequests);
      }
    }

    fetchFriendRequests();
  }, [session?.user]);

  const inputCustomStyle =
    "h-[40px] bg-primary_colors-white border-primary_colors-black_3 text-primary_colors-black_1 placeholder:text-primary_colors-black_1";

  async function handleAdd() {
    console.log(email);

    const response = await sendFriendRequest(
      session?.user?.email as string,
      email
    );
    if (response) {
      toast(`Friend Request sent Successfully to <${email}>`);
      console.log(response);
    }
  }

  async function accept(RequestEmail) {
    const response = await AcceptFriendRequest(
      session?.user?.email as string,
      RequestEmail
    );
    if (response) {
      toast(`Friend Request Accepted from ${RequestEmail}`);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.email !== RequestEmail)
      );
      console.log(response);
    }
  }

  async function deny(RequestEmail) {
    const response = await DenyFriendRequest(
      session?.user?.email as string,
      RequestEmail
    );
    if (response) {
      toast(`Friend Request Denied from ${RequestEmail}`);
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.email !== RequestEmail)
      );
      console.log(response);
    }
  }

  return (
    <div className="flex flex-col mx-5 my-4 gap-4">
      <h1 className="text-3xl font-bold">Add Friends Through Email</h1>
      <div className="flex justify-between">
        <Input
          type="text"
          className={`${inputCustomStyle} w-[90%]`}
          placeholder="Enter User's Email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <ButtonWithLogo variant="primary" name="Add" onClick={handleAdd} />
      </div>

      <hr />
      <h1>
        Friend Requests{" "}
        <span>({friendRequests ? friendRequests.length : "0"})</span>
      </h1>
      {friendRequests.length > 0 ? (
        friendRequests.map((request) => {
          return (
            <div
              key={request._id}
              className="flex justify-between items-center border px-2 py-2 rounded-md"
            >
              <div className="flex gap-2">
                <p>{request.username}</p>
                <p>{request.email}</p>
              </div>
              <div className="flex gap-3">
                <ButtonWithLogo
                  variant="primary"
                  name="Accept"
                  onClick={() => accept(request.email)}
                />
                <ButtonWithLogo
                  variant="primary"
                  name="Deny"
                  onClick={() => deny(request.email)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <p className="font-mono font-bold text-center">
          No Friend Requests Available
        </p>
      )}
    </div>
  );
}

export default Page;
