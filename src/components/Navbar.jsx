import React from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'
const Navbar = () => {
  return (
    <div 
    className='flex flex-row h-[60px] place-content-evenly items-center text-3xl font-bold text-white
    bg-[#4a4a4a]'>
      <div className='font-sans hover:text-[#292323]'>
        <NavLink to="/">
          Home
        </NavLink>
      </div>
    
      <div className='font-sans hover:text-[#292323]'>
        <NavLink to="/pastes">
          Pastes
        </NavLink>
      </div>
    </div>
  )
}

export default Navbar
