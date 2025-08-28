import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import SidebarTabHeader from "./SidebarTabHeader"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

import { useState } from "react";


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
  SidebarFooter,
  useSidebar,
  SidebarTrigger
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
 
]

export function Chatright() {
  const { open } = useSidebar();
  const [file, setFile] = useState(null);
  const handleFileChange = (event) => {
    const fileinput = event.target.files[0];
    setFile(fileinput)
    if (fileinput) {
      console.log("Selected file:", fileinput);
      async function sendFile(){
        const res= await fetch('http://localhost:5000/api/file',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: file })
        });

        const data = await res.json();
        
        setMessages([...messages, { role: 'user', content: file }, { role: 'ai', content: data.reply }]);
        setInput('');
      }
      sendFile()
    }
  };

  return (
    <>
      <Sidebar collapsible="icon" variant="floating"   >
        <SidebarHeader className={open ? "p-2" : "hidden"}>
          <SidebarMenu>
            <SidebarMenuItem>

              <SidebarTabHeader />



            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>



        {/* //main content */}
        <SidebarContent >
          <SidebarGroup className='px-3 py-4 ' >
            <SidebarGroupLabel className='text-lg font-bold '>Context</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu >
                {items.length === 0 ? (<p>No Data available</p>) : items.reverse().map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton asChild >

                      <a href="">

                        <input type="checkbox" />
                        <span>{item.title}</span>
                      </a>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <Separator />
        {/* footer */}
        <SidebarFooter className={open ? "p-2" : "hidden"}>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="rounded-2xl flex-1 px-4 py-5 bg-[var(--primary)] flex items-center justify-center text-white cursor-pointer hover:bg-[var(--primary)] hover:text-white ">
                {/* label button ban gaya */}
                <label >
                  Upload
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>

              </SidebarMenuButton>

            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>



    </>
  )
}