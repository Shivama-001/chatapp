import React , { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {

  const [ currState, setCurrState ] = useState("Sign up")
  const [ fullName, setFullName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ bio, setBio ] = useState("")
  const [ isDataSubmitted, setIsDataSubmitted ] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event) => {

    event.preventDefault();
    if(currState === 'Sign up' && !isDataSubmitted){
      setIsDataSubmitted(true)
      return ;
    }

    /// call login function from context to perform login or signup based on current state
    login(currState === "Sign up" ? 'signup' : 'login', {fullName, email, password, bio})

  }


  return (
    <div  className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">

               {/* ------left----- */}
               <img src="/logo_big.svg" className="w-[min(30vw,250px)]" />

               {/* ----------right------- */}


               <form
  onSubmit={onSubmitHandler}
  className="border-2 bg-white/8 text-white p-6 flex border-gray-500 flex-col gap-6 rounded-lg shadow-lg"
>
  <h2 className="font-medium text-2xl text-white-50 text-center flex justify-between items-center ">
    {currState}

    {isDataSubmitted && (
      <img
        onClick={() => setIsDataSubmitted(false)}
       src="/src/assets/arrow_icon.png"
        className="w-5 cursor-pointer"
      />
    )}
  </h2>

  {/* FULL NAME */}
  {currState === "Sign up" && !isDataSubmitted && (
    <input
      onChange={(e) => setFullName(e.target.value)}
      value={fullName}
      type="text"
      className="p-2 border border-gray-500 rounded-md focus:outline-none text-black "
      placeholder="Full Name"
      required
    />
  )}

  {/* EMAIL & PASSWORD */}
  {!isDataSubmitted && (
    <>
      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email Address"
        required
        className="p-2 text-black border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        required
        className="p-2 text-black border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </>
  )}

  {/* BIO STEP */}
  {currState === "Sign up" && isDataSubmitted && (
    <textarea
      onChange={(e) => setBio(e.target.value)}
      value={bio}
      rows={4}
      className="p-2 text-black border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      placeholder="Provide a short bio"
      required
    />
  )}

  {/* BUTTON */}
  <button
    type="submit"
    className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
  >
    {currState === "Sign up" && !isDataSubmitted
      ? "Next"
      : currState === "Sign up"
      ? "Create Account"
      : "Login Now"}
  </button>

  {/* TERMS */}
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <input type="checkbox" />
    <p>Agree to the terms of use & privacy policy</p>
  </div>

  {/* SWITCH LOGIN / SIGNUP */}
  <div className="flex flex-col gap-2">
    {currState === "Sign up" ? (
      <p className="text-sm text-gray-600">
        Already have an account
        <span
          onClick={() => {
            setCurrState("Login");
            setIsDataSubmitted(false);
          }}
          className="font-medium text-violet-500 cursor-pointer"
        >
          Login here
        </span>
      </p>
    ) : (
      <p className="text-sm text-gray-600">
        Create an account
        <span
          onClick={() => setCurrState("Sign up")}
          className="font-medium text-violet-500 cursor-pointer"
        >
          Click here
        </span>
      </p>
    )}
  </div>
</form>
    </div>
  )
}

export default LoginPage
