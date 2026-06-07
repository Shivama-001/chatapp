import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

const ProfilePage = () => {

  const { authUser, updateProfile}= useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio ]= useState(authUser.bio)

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!selectedImg){
      // If no new image is selected, just update the profile with the existing profile picture and new name and bio
      await updateProfile({fullName: name, bio})
       navigate('/')
       return;
    }

    // If a new image is selected, convert it to base64 and update the profile with the new image, name and bio
    const render = new FileReader();
    render.readAsDataURL(selectedImg)
    // On successful conversion of image to base64, call updateProfile function from context to update the profile and navigate to home page
    render.onload = async () =>{
      const base64Image = render.result;
      await updateProfile({profilePic: base64Image, fullName: name, bio})
       navigate('/')
    }

  }


  return (
    <div>
       <div className="min-h-scree h-screen bg-cover bg-no-repeat flex items-center justify-center ">
         <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:col-reverse rounded-lg">
             <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
                <h3 className="text-lg">Profile details</h3>




                <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
                  <input onChange={(e)=> setSelectedImg(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden/>
                  <img src={selectedImg ? URL.createObjectURL(selectedImg) : '/src/assets/avatar_icon.png'} alrt="profile pic not found" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} />
                  upload profile image

                </label>

                <input onChange={(e)=> setName(e.target.value)} value={name} type="text" required placeholder="Your Name" className="p-2 border text-black border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"/>
                 <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder='Write Profile Bio' required className="p-2 border text-black border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" rows={4} />
                <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>


             </form>
             <img className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || '/src/assets/logo_icon.png'}/>
         </div>
       </div>
    </div>
  )
}

export default ProfilePage
