import React, { useEffect, useState } from "react"
import useSocketForLiveChat from "../../data-access/useSocketForLiveChat"
import Chatbox from "./components/Chatbox/Chatbox"
import styles from "./LiveChat.module.scss"

const LiveChat = ({ teamCdn }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false)
  const [chatbotConfig, setChatbotConfig] = useState()

  const [msgList, setMsgList] = useState([])
  const [socket] = useSocketForLiveChat(setMsgList)

  return (
    <div className={styles.liveChatContainer + " " + styles.opened}>
      <Chatbox socket={socket} allMessages={msgList} setAllMessages={setMsgList} teamCdn={teamCdn} chatbotConfig={chatbotConfig} setIsBoxOpen={setIsBoxOpen} />
    </div>
  )
}

export default LiveChat
