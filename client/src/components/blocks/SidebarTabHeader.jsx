import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import logo from '../../assets/raglogo.png'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"


const SidebarTabHeader = () => {
    const navigate = useNavigate();
    const [yLink,setYLink]=useState('');
    const [websiteLnk,setWebsiteLink]=useState('');

    const handleYoutubeLink = async() => {
        try {
            const res = await fetch("http://localhost:5000/api/youtubelink", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ youtubeLink: yLink})
            });

            const data = await res.json();
            console.log(data)
            setYLink('')
        } catch (error) {
            console.log(error,"issue in handleYoutubeLink")
        }
    }

    const handleWebsiteLink = async() => {
        try {
            const res = await fetch("http://localhost:5000/api/websitelink", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ websiteLnk: websiteLnk})
            });

            const data = await res.json();
            console.log(data)
            setYLink('')
        } catch (error) {
            console.log(error,"issue in handlewebsitelink")
        }
    }
    return (
        <div className='min-h-[30vh] mx-3 '>
            <div className='flex items-center  justify-between'>
                    <FaArrowLeft className='cursor-pointer' onClick={()=>navigate('/')}/> 
                <img src={logo} alt="logo" className='w-[80%]' />
              
             
               

            </div>


            <Tabs defaultValue="youtube" >
                <TabsList className='w-[100%]  '>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    <TabsTrigger value="website">Website</TabsTrigger>
                </TabsList>

                <TabsContent value="youtube">
                    <Card className="p-4">
                        <Input placeholder="Enter YouTube line" value={yLink} onChange={(e)=>setYLink(e.target.value)}/>
                        <Button className='cursor-pointer' onClick={handleYoutubeLink}>OK</Button>
                    </Card>
                </TabsContent>

                <TabsContent value="website">
                    <Card className="p-4">
                        <Input placeholder="Enter website link"  value={websiteLnk} onChange={(e)=>setWebsiteLink(e.target.value)}/>
                        <Button className='cursor-pointer' onClick={handleWebsiteLink}>OK</Button>
                    </Card>
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default SidebarTabHeader
