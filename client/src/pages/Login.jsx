import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();

  const { backendUrl ,setIsLoggedIn, getUserData} = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const onSubmitHandler = async (e) => {
  e.preventDefault();
  axios.defaults.withCredentials = true;

  try {
    let response;

    if (state === "Sign Up") {
      response = await axios.post(
        `${backendUrl}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
    } else {
      response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
    }

    const data = response.data;

    if (data.success) {
      setIsLoggedIn(true);
      getUserData();
      navigate("/");
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message);
    } else if (error.request) {
      toast.error("No response from server. Please try again later.");
    } else {
      toast.error(error.message);
    }
  }
};


  return (
    <div
      className="flex items-center justify-center min-h-screen px-6
    sm:px-0 bg-gradient-to-b from-blue-200 to-purple-400"
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Login"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div
        className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96
      text-indigo-300 text-sm"
      >
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create an Account" : "Login to Your Account"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Please fill in the details to create an account."
            : "Please enter your credentials to login."}
        </p>
        <form onSubmit={onSubmitHandler}>
          {state === "Sign Up" && (
            <div
              className="mb-4 flex item-center gap-3 w-full px-5 py-2.5
            rounded-full bg-[#333A5C]"
            >
              <img src={assets.person_icon} alt="Person Icon" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="bg-transparent border-none outline-none text-white placeholder:text-white"
                type="text"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          <div
            className="mb-4 flex item-center gap-3 w-full px-5 py-2.5
            rounded-full bg-[#333A5C]"
          >
            <img src={assets.mail_icon} alt="Mail Icon" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="bg-transparent border-none outline-none text-white placeholder:text-white"
              type="email"
              placeholder="Email ID"
              required
            />
          </div>
          <div
            className="mb-4 flex item-center gap-3 w-full px-5 py-2.5
            rounded-full bg-[#333A5C]"
          >
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="bg-transparent border-none outline-none text-white placeholder:text-white"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <p
            onClick={() => navigate("/reset-password")}
            className=" mb-4 cursor-pointer text-indigo-500"
          >
            Forgot Password?
          </p>
          <button
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-900 
            text-white cursor-pointer text-white font-medium"
          >
            {" "}
            {state === "Sign Up" ? "Sign Up" : "Login"}{" "}
          </button>
        </form>
        {state == "Sign Up" ? (
          <p className="text-center text-gray-400 text-xs mt-4">
            Already have an account?{" "}
            <span
              className="cursor-pointer text-blue-400 underline"
              onClick={() => setState("Login")}
            >
              {" "}
              Login
            </span>
          </p>
        ) : (
          <p className="text-center text-gray-400 text-xs mt-4">
            Don't have an account?{" "}
            <span
              className="cursor-pointer text-blue-400 underline"
              onClick={() => setState("Sign Up")}
            >
              {" "}
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
