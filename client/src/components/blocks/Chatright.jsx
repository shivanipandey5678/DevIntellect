import { Home} from "lucide-react"
import SidebarTabHeader from "./SidebarTabHeader"
import { Separator } from "@/components/ui/separator"

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
 
 
 
]

export function Chatright() {
  const { open } = useSidebar();
  const formData = new FormData();
  const handleFileChange = (event) => {
    const fileinput = event.target.files[0];
    
    if (fileinput) {
      formData.append("file", fileinput)
      console.log("Selected file:", fileinput);
      async function sendFile(){
        try {
          const res= await fetch('http://localhost:5000/api/fileUpload',{
            method: 'POST',
           
            body: formData
          });
  
          const data = await res.json();
          console.log("Server response:", data);
         
        } catch (error) {
          console.log(error,'❌error at chatright')
        }
       
   
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