import Navbar from "../components/blocks/Navbar";
import { Hero1 } from "../components/blocks/Hero";
import Features from "../components/blocks/Features";
import Contact from "../components/blocks/Contact";
import Footer from "../components/blocks/Footer";
import { MarqueeDemo } from "../components/blocks/Testimonal";
import { Separator } from "@/components/ui/separator"
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

import React from 'react'

const Home = () => {
    return (
        <div className="flex min-h-vh flex-col items-center justify-center  md:mx-0 mx-4 overflow-x-hidden">
            <Navbar />
            <Separator />
            <Hero1 />
            <Features />

            <section className="w-full max-w-7xl mx-auto overflow-hidden px-4 py-12" id='testimonal'>
                <div className="py-4">
                    <h1 className="scroll-m-20 text-center text-3xl font-extrabold tracking-tight text-balance">
                        Testimonals
                    </h1>
                </div>
                <MarqueeDemo />

            </section>
            <Contact />
            <Separator />
            <Footer />
        </div>
    )
}

export default Home
