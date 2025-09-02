import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Header = () => {
  const {userData}=useContext(AppContext)
  return (
    <div className='flex flex-col items-center justify-center text-center p-8 rounded-lg shadow-md 
    space-y-4 mt-16 px-4 text-gray-800'>
      <img src={assets.header_img} alt="Header"
       className="w-36 h-36 rounded-full mb-6" />
        <h1 className='flex items-center text-4xl sm:text-3xl gap-2 font-medium mb-2'>
            Welcome to Our Application,{userData ?userData.name:'Developer'}!!
             <img className='w-8 aspect-square' src={assets.hand_wave} alt="Hand Wave" />
            </h1>
       
        <h2 className='text-3xl sm:text-5xl font-semibold text-gray-600'>Your one-stop solution for all your needs</h2>
        <p className='text-gray-500 mb-8 max-w-md'>We provide a wide range of services to help you succeed.</p>
        <button className='mt-4 px-6 py-2 hover:bg-gray-200 border border-gray-500 rounded-full cursor-pointer'>
          Get Started
        </button>
    </div>
  )
}

export default Header
