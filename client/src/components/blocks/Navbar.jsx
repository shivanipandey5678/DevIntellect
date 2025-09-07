import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Button
} from "@/components/ui/button"
import raglogo from '../../assets/raglogo.png';
import { useNavigate } from "react-router-dom"
import { AnimatedThemeToggler } from "./animated-theme-toggler.jsx";



// import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler"


const Navbar = () => {
   const navigate = useNavigate();
  return (
    <div className='flex w-[100vw] px-10% p-5 justify-between md:px-4 px-px-2   items-center font-medium text-gray-600 sticky top-0 z-50 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md '>
      <img src={raglogo} alt="raglogo" className=' sm:w-[20%]   md:w-[17%] cursor-pointer  w-[30%]' />
      <ul className='md:flex  hidden w-[30%] justify-evenly dark:text-white dark:hover:text-[var(--primary)]'>
        <li className='cursor-pointer hover:text-gray-800 dark:text-white dark:hover:text-[var(--primary)]'>  <a href="#Features">Features</a></li>
        <li className='cursor-pointer hover:text-gray-800 dark:text-white dark:hover:text-[var(--primary)]'>     <a href="#about">About</a>
        </li>
        <li className='cursor-pointer hover:text-gray-800 dark:text-white dark:hover:text-[var(--primary)]'>     <a href="#contact">Contact</a>
        </li>
      </ul>
      <ul className='flex flex-row md:w-[15%]  w-[40%] justify-evenly items-center'>

        <AnimatedThemeToggler className='cursor-pointer w-8 h-6 dark:text-white ' />


        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={()=>navigate('/chat')} className='dark:border-gray-400 dark:text-white'>Get Started</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>You can start without signup</p>
          </TooltipContent>
        </Tooltip>
        </ul>


    </div>
  )
}

export default Navbar
