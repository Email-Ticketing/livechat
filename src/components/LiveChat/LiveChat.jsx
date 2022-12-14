

import React, { useEffect, useState } from "react"
import { BsFillChatFill } from "react-icons/bs"
import useSocketForLiveChat from "../../data-access/useSocketForLiveChat"
import Chatbox from "./components/Chatbox/Chatbox"
import styles from "./LiveChat.module.scss"
import { v4 as uuid } from "uuid"
import { usePeer } from "../../context/PeerContext"
import { ChatSupport } from "../../libs/icons/icon"
import { useCookies } from "react-cookie"
import useChat from "../../data-access/useChat"
import defaultIcons from "../../libs/icons/defaultIcons/defaultIcons";

const LiveChat = ({ teamCdn }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [latestActivityFromSocket, setLatestActivityFromSocket] = useState()
  const [cookies, setCookies] = useCookies(["chat_room_id", "chat_session_id", "chat_user_id", "support_chat_id"])
  const [chatbotConfig,setChatbotConfig] = useState();
  const [icon,setIcon] = useState();
  // const [isButtonClicked,setIsButtonClicked]=useState(false)

  const [socket] = useSocketForLiveChat(setLatestActivityFromSocket)
  const [msgList, setMsgList] = useState([])

  const { getChatBotConfigData } = useChat()

  const customChatStyles = {
    float_btn: {
      display: "grid",
      placeItems: "center",
      width: "50px",
      height: "50px",
      background: chatbotConfig?.color,
      color: "white",
      borderRadius: "50%",
      cursor: "pointer",
      position: "absolute",
      bottom: "0",
      right: "0",
      zIndex: "1000"
    },
    float_btn_disabled:{
      display: "grid",
      placeItems: "center",
      width: "50px",
      height: "50px",
      background: "grey",
      color: "white",
      borderRadius: "50%",
      position: "absolute",
      bottom: "0",
      right: "0",
      zIndex: "1000"
    }
  }

  const joinClickHandler = async () => {
    if (!isBoxOpen) {
      console.log("teamCdn:",teamCdn)
      await socket.current.emit("join-chat", cookies.chat_user_id ? cookies.chat_user_id : uuid(), cookies.chat_room_id, teamCdn)
      setIsLoggedIn(true)
    }
  }

  useEffect(()=>{
    getChatBotConfigData(teamCdn).then((res)=>{
      setChatbotConfig(res.data.data);
      setIcon(defaultIcons[res.data.data.default_chatbot_icon-1]?.IconName);
    }).catch((error)=>{
      console.log("LIVE CHAT ERROR",error);
    })
  },[teamCdn])

  useEffect(() => {
    console.log("ICON",defaultIcons[chatbotConfig?.default_chatbot_icon]?.IconName)
    if (latestActivityFromSocket) {
      console.log("LATEST ACTIVITY FROM SOCKET",latestActivityFromSocket)
      if (latestActivityFromSocket?.chatRoom?.chat_session_id) {
        setCookies(
          "chat_session_id",
          latestActivityFromSocket?.chatRoom?.chat_session_id,
          {
            path: "/",
          }
        );
      }
      if (latestActivityFromSocket?.userJoined?.chat_user_id) {
        setCookies(
          "chat_user_id",
          latestActivityFromSocket?.userJoined?.chat_user_id,
          {
            path: "/",
          }
        );
      }
      if (latestActivityFromSocket?.support_chat_id) {
        setCookies(
          "support_chat_id",
          latestActivityFromSocket?.support_chat_id,
          {
            path: "/",
          }
        );
      }

      setMsgList((list) => [...list, latestActivityFromSocket]);
    }
    setLatestActivityFromSocket(null);
  }, [latestActivityFromSocket]);
  // console.log(myPeer)

  return (

    <div className={styles.liveChatContainer}>
      {chatbotConfig?.chatbot_visibility&&<div
        style={customChatStyles.float_btn}
        onClick={() => {
          setIsBoxOpen(!isBoxOpen);
          joinClickHandler();
        }}
      >
        {icon}
      </div>}
      {isBoxOpen && isLoggedIn && <Chatbox socket={socket} allMessages={msgList} teamCdn={teamCdn} chatbotConfig={chatbotConfig} setIsBoxOpen={setIsBoxOpen}/>}
    </div>
  )
}

export default LiveChat;
