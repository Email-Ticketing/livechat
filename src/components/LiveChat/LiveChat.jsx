import React, { useEffect, useState } from "react";
import { BsFillChatFill } from "react-icons/bs";
import useSocketForLiveChat from "../../data-access/useSocketForLiveChat";
import Chatbox from "./components/Chatbox/Chatbox";
import styles from "./LiveChat.module.css";
const LiveChat = ({teamCdn}) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isLoggedIn,setIsLoggedIn]=useState(false)
  const [inputDetails,setInputDetails]=useState({
    username:'',
    room:''
  })
  const [latestActivityFromSocket,setLatestActivityFromSocket]=useState()
  // const [isButtonClicked,setIsButtonClicked]=useState(false)
  const [socket]=useSocketForLiveChat(setLatestActivityFromSocket)
  const [msgList,setMsgList]=useState([])

  const joinClickHandler=async()=>{
    console.log(teamCdn)
    await socket.current.emit('join-chat',inputDetails.username,inputDetails.room,teamCdn)
    setIsBoxOpen(false)
    setIsLoggedIn(true)
  }
  const setDetails=(e)=>{
    setInputDetails(details=>({...details,[e.target.name]:e.target.value}))
  }
  useEffect(()=>{
    if(latestActivityFromSocket){
      setMsgList(list=>[...list,latestActivityFromSocket])
    }
    setLatestActivityFromSocket(null)
  },[latestActivityFromSocket])
  return (
    <div className={styles.liveChatContainer}>
      <div className={styles.floatBtn} onClick={() => {
        setIsBoxOpen(!isBoxOpen)
        setInputDetails({
          username:'',
          room:''
        })
        setIsLoggedIn(false)
        socket.current.emit('leave-room')
      }}>
        <BsFillChatFill />
      </div>
      {isBoxOpen && (
        <div className={styles.detailsBox}>
          <header>
            <h2>Live chat</h2>
          </header>
          <main>
            <div className={styles.inputField}>
              <label htmlFor="">Username:</label>
              <input type="text" name="username" value={inputDetails.username} onChange={setDetails}/>
            </div>
            <div className={styles.inputField}>
              <label htmlFor="">Room name:</label>
              <input type="text" name="room" value={inputDetails.room} onChange={setDetails}/>
            </div>
          </main>
          <button className={styles.joinBtn} onClick={joinClickHandler}>Join room</button>
        </div>
      )}
      {
        isLoggedIn && <Chatbox socket={socket} allMessages={msgList} username={inputDetails.username} />
      }
    </div>
  );
};

export default LiveChat;
