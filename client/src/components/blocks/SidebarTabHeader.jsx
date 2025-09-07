import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import logo from '../../assets/raglogo.png'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"
import {AppContext} from '../../context/AppContext.jsx'
import { useContext } from "react"
import { Loader2 } from 'lucide-react'


const SidebarTabHeader = () => {
    const navigate = useNavigate();
    const [yLink,setYLink]=useState('');
    const [websiteLnk,setWebsiteLink]=useState('');
    const [loadingLink, setLoadingLink] = useState(false); 
    const {setCurrentContext} = useContext(AppContext)

    const handleYoutubeLink = async() => {
        try {
            setLoadingLink(true)
            if(!yLink || !yLink.trim()){
                console.log("plz provide link first!")
                setLoadingLink(false)
                return null
            }
           
            const res = await fetch("http://localhost:5000/api/youtubelink", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ youtubeLink: yLink})
            });
            setYLink('')
            setLoadingLink(false)
            const data = await res.json();
            console.log("👩‍💻👩‍💻👩‍💻👩‍💻👩‍💻👩‍💻⏳",data.data[0].metadata.title)
            setCurrentContext((prev)=>[ ...prev,data.data[0].metadata.title])
           
        } catch (error) {
            setLoadingLink(false)
            console.log(error,"issue in handleYoutubeLink")
        }
    }

    const handleWebsiteLink = async() => {
        try {
            setLoadingLink(true)
            if(!websiteLnk || !websiteLnk.trim()){
                console.log("plz provide link first!")
                return null
            }
            
            const res = await fetch("http://localhost:5000/api/websitelink", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ websiteLnk: websiteLnk})
            });

            const data = await res.json();
            setLoadingLink(false)
            if (data.success) {
                console.log("✅ Website indexed:", data.websiteName);
                // context update karo
                setCurrentContext((prev) => [...prev, data.websiteName]);
            } else {
                console.log("❌ Error:", data.message);
            }
    
            setWebsiteLink('') // input clear
        } catch (error) {
            setLoadingLink(false)
            console.log(error,"issue in handlewebsitelink")
        }
    }
    return (
        <div className='min-h-[30vh] mx-3 '>
            <div className='flex items-center  justify-between'>
                <img src={logo} alt="logo" className='w-[80%]' />
                    <FaArrowLeft className='cursor-pointer' onClick={()=>navigate('/')}/> 
              
             
               

            </div>


            <Tabs defaultValue="youtube" >
                <TabsList className='w-[100%]  '>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    <TabsTrigger value="website">Website</TabsTrigger>
                </TabsList>

                <TabsContent value="youtube">
                    <Card className="p-4">
                        <Input placeholder="Enter YouTube link" value={yLink} onChange={(e)=>setYLink(e.target.value)}/>
                        {
                            loadingLink?(
                                <Button className='cursor-pointer flex justify-center '  disabled={loadingLink} >  <Loader2 className="animate-spin text-white" size={16} />OK</Button>
                            ):(
                                <Button className='cursor-pointer flex justify-center ' onClick={handleYoutubeLink}> OK</Button>
                            )
                        }
                       
                    </Card>
                </TabsContent>

                <TabsContent value="website">
                    <Card className="p-4">
                        <Input placeholder="Enter website link"  value={websiteLnk} onChange={(e)=>setWebsiteLink(e.target.value)}/>
                        
                        {
                            loadingLink?(
                                <Button className='cursor-pointer flex justify-center '  disabled={loadingLink} >  <Loader2 className="animate-spin text-white" size={16} />OK</Button>
                            ):(
                                <Button className='cursor-pointer flex justify-center ' onClick={handleWebsiteLink}> OK</Button>
                            )
                        }
                    </Card>
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default SidebarTabHeader
