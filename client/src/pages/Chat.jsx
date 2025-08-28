import React from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Chatright } from "../components/blocks/Chatright"
import Navbar from "../components/blocks/Navbar"
import ChatLeft from "@/components/blocks/ChatLeft"

const Chat = () => {
    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex h-screen w-[100vw]">
                {/* Left Sidebar */}
              
                    <Chatright />
      

                {/* Right Main Content */}
                <main className="flex-1 p-4 border-2  overflow-auto flex flex-col ">
                   
                    <ChatLeft/>
                </main>
            </div>
        </SidebarProvider>
    )
}

export default Chat
