import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const {backendUrl, isLoggedIn,userData, getUserData}=useContext(AppContext)
  const navigate = useNavigate();
  const inputRefs= React.useRef([]);
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text");
    if (/^\d{4}$/.test(pastedData)) {
      pastedData.split("").forEach((char, i) => {
        inputRefs.current[i].value = char;
        if (i < 3) {
          inputRefs.current[i + 1].focus();
        }
      });
    }
  };

  const onSubmitHandler = async (e) => {
    
    try {
      e.preventDefault();
      const otpArray= inputRefs.current.map(e => e.value);
      const otp=otpArray.join('');
      const {data}=await axios.post(backendUrl+'/api/auth/verify-account',{otp});
      if(data.success){
        toast.success(data.message);
        getUserData();
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
    toast.error(error.response.data.message); 
  } else {
    toast.error(error.message); 
  }
      
    }
  };
  useEffect(()=>{
    isLoggedIn && userData && userData.isVerified && navigate('/');
  },[isLoggedIn,userData])
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-200 to-purple-400">
       <img
              onClick={() => navigate("/")}
              src={assets.logo}
              alt="Email verify"
              className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />
        <form className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm' onSubmit={onSubmitHandler}>
            <h1 className='text-white text-2xl font-semibold text-center mb-4'>
              Email Verification
            </h1>
            <p className='text-center mb-6 text-indigo-300'>
              Enter the 4-digit code sent to your Email ID
            </p>
            <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(4).fill(0).map((_,index)=>(
                <input type="text" maxLength='1' key={index} required
                className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md'
                ref={el => inputRefs.current[index] = el}
                onInput={(el) => {
                  if (el.target.value.length === 1 && index < 3) {
                    inputRefs.current[index + 1].focus();
                  }
                }}
                onKeyDown={(event) => handleKeyDown(event, index)}
                
                />
              ))}
            </div>
            <button
              type="submit"
              className='w-full py-2 mt-4 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full transition-colors duration-200 hover:from-indigo-700 hover:to-indigo-950'
            >
              Verify Email
            </button>
        </form>
    </div>
  )
}

export default EmailVerify
