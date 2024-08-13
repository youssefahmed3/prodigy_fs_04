"use client";

import { updateAllChats, updateAllChatsWithApprove } from '@/lib/actions/chat.actions';
import { useSession } from 'next-auth/react';
import React from 'react'
function Page() {
  const {data: session} = useSession()

  /* async function update() {
    const resp = await updateAllChatsWithApprove();
    console.log(resp);
    
  } */

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='text-center font-bold text-3xl'>Welcome To Chat App</h1>
      <h1 className='text-center font-bold text-3xl'>Meet People Online and Start Chatting...</h1>
      {/* <button onClick={update}>update Chats</button> */}
    </div>
  )
}

export default Page