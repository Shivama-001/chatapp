import React , { useRef, useEffect, useContext, useState } from 'react'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)

  const scrollEnd = useRef()
  const [input, setInput] = useState('')

  // Send Text Message
  const handleSendMessage = async (e) => {
    e.preventDefault()

    if(input.trim() === "") return

    await sendMessage({
      text: input.trim(),
      receiverId: selectedUser._id   //  FIX
    })

    setInput("")
  }

  // Send Image
  const handleSendImage = async (e) => {

    const file = e.target.files[0]

    if(!file || !file.type.startsWith("image/")){
      toast.error("Select an image file")
      return
    }

    const reader = new FileReader()

    reader.onloadend = async () => {

      await sendMessage({
        image: reader.result,
        receiverId: selectedUser._id   //  FIX
      })

      e.target.value = ""
    }

    reader.readAsDataURL(file)
  }

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id)
    }
  },[selectedUser])

  useEffect(()=>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior:"smooth"})
    }
  },[messages])

  return selectedUser ? (

    <div className="h-full overflow-hidden relative backdrop-blur-lg">

      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={selectedUser.profilePic || '/src/assets/profile_martin.png'} className="w-8 rounded-full" />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}

          {onlineUsers.includes(selectedUser._id) &&
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          }

        </p>

        <img onClick={()=>setSelectedUser(null)} src="/src/assets/arrow_icon.png" className="md:hidden max-w-7"/>
        <img src="/src/assets/help_icon.png" className="max-md:hidden max-w-7"/>
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">

        {messages.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>

            {msg.image ? (
              <img src={msg.image} alt="" className="max-w-[230px] border border-gray-700 rounded-lg mb-8"/>
            ) : (
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
              </p>
            )}

            <div className="text-center text-xs">
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || '/src/assets/avatar_icon.png' : selectedUser?.profilePic || '/src/assets/profile_martin.png'} className="w-7 rounded-full"/>
              <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
            </div>

          </div>
        ))}

        <div ref={scrollEnd}></div>

      </div>

      {/* Bottom Input */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">

        <div className="flex-1 flex items-center bg-gray-100/10 px-3 rounded-full">

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none outline-none text-white bg-transparent"
          />

          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <img src="/src/assets/gallery_icon.svg" className="w-5 mr-2 cursor-pointer"/>
          </label>

        </div>

        <img onClick={handleSendMessage} src="/src/assets/send_button.svg" className="w-7 cursor-pointer"/>

      </div>

    </div>

  ) : (

    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src="/src/assets/logo_icon.svg" className="max-w-16"/>
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>

  )
}

export default ChatContainer
