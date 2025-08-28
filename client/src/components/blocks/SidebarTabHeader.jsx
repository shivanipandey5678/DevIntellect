import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import logo from '../../assets/raglogo.png'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom"

const SidebarTabHeader = () => {
    const navigate = useNavigate();
    return (
        <div className='min-h-[30vh] mx-3 '>
            <div className='flex items-center p-3 justify-between'>
                    <FaArrowLeft className='cursor-pointer' onClick={()=>navigate('/')}/> 
                <img src={logo} alt="logo" className='w-[80%]' />
              
             
               

            </div>


            <Tabs defaultValue="youtube">
                <TabsList>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    <TabsTrigger value="website">Website</TabsTrigger>
                </TabsList>

                <TabsContent value="youtube">
                    <Card className="p-4">
                        <Input placeholder="Enter YouTube line" />
                        <Button className='cursor-pointer' >OK</Button>
                    </Card>
                </TabsContent>

                <TabsContent value="website">
                    <Card className="p-4">
                        <Input placeholder="Enter website link" />
                        <Button className='cursor-pointer'>OK</Button>
                    </Card>
                </TabsContent>
            </Tabs>


        </div>
    )
}

export default SidebarTabHeader
