import { Home, Loader2} from "lucide-react"
import SidebarTabHeader from "./SidebarTabHeader"
import { Separator } from "@/components/ui/separator"
import {  useState } from "react"
import {AppContext} from '../../context/AppContext.jsx'

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
import { useContext } from "react"





export function Chatright() {
  const { open } = useSidebar();
  const [loadingFiles, setLoadingFiles] = useState([]); 
  const formData = new FormData();
  const {currentContext, setCurrentContext} = useContext(AppContext)
  
  const handleFileChange = (event) => {
    const fileinput = event.target.files[0];
    
    if (fileinput) {
      formData.append("CsvPath", fileinput)
    

      // Add file to loading state
      setLoadingFiles((prev) => [...prev, fileinput.name]);
    
      console.log("Selected fileinput:", fileinput);
      console.log("Selected formData:", formData);
      async function sendFile(){
        try {
          const res= await fetch('http://localhost:5000/api/load-csv',{
            method: 'POST',
            body: formData
          });

          if (!res.ok) {
            throw new Error("Server error");
          }
           
  
          const data = await res.json();
          console.log("Server response:", data);

          setLoadingFiles((prev)=>prev.filter((name)=> name !== fileinput.name))
          setCurrentContext((prev)=>[ ...prev,fileinput.name])
        } catch (error) {
          console.log(error,'❌error at chatright');
          setLoadingFiles((prev) => prev.filter((name) => name !== fileinput.name));
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
                {loadingFiles.length === 0 && currentContext.length===0 ? (<p>No Data available</p>) : [...loadingFiles,...currentContext].reverse().map((item, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton asChild >

                      <div className="flex items-center gap-2">

                       
                        {loadingFiles.includes(item)?(
                          <>
                          <Loader2 className="animate-spin text-gray-500" size={16} />
                          <p  className=" truncate max-w-[200px] block">{item}</p>
                          </>
                        ):( 
                        <>
                          <input type="checkbox" />
                          <span className="truncate max-w-[150px] block">{item}</span>
                        </>)}
                       
                      </div>

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
                    type="file" name="CsvPath" encType="multipart/form-data"
                    hidden
                    onChange={handleFileChange}
                    disabled={loadingFiles.length > 0}
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