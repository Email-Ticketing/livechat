import React, { useEffect, useState } from "react"
import { BsFillChatFill } from "react-icons/bs"
import useSocketForLiveChat from "../../data-access/useSocketForLiveChat"
import Chatbox from "./components/Chatbox/Chatbox"
import styles from "./LiveChat.module.scss"
import { v4 as uuid } from "uuid"
import { usePeer } from "../../context/PeerContext"
import { ChatSupport } from "../../libs/icons/icon"
import { useCookies } from "react-cookie"
const LiveChat = ({ teamCdn }) => {
  const [isBoxOpen, setIsBoxOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState()
  const [latestActivityFromSocket, setLatestActivityFromSocket] = useState()
  const [cookies, setCookies] = useCookies(["chat_room_id", "support_chat_id", "chat_user_id"])
  // const [isButtonClicked,setIsButtonClicked]=useState(false)

  const [socket] = useSocketForLiveChat(setLatestActivityFromSocket)
  const [msgList, setMsgList] = useState([])
  const joinClickHandler = async () => {
    console.log("teamCdn:", teamCdn)
    await socket.current.emit("join-chat", username, cookies.chat_room_id, teamCdn)
    setIsBoxOpen(false)
    setIsLoggedIn(true)
  }
  useEffect(() => {
    if (!cookies.chat_room_id) {
      setCookies("chat_room_id", uuid(), {
        path: "/",
      })
    }

    if (latestActivityFromSocket) {
      if (latestActivityFromSocket?.support_chat_id) {
        setCookies("support_chat_id", latestActivityFromSocket?.support_chat_id, {
          path: "/",
        })
        // console.log(latestActivityFromSocket.support_chat_id)
      }
      if (latestActivityFromSocket?.chat_user_id) {
        setCookies("chat_user_id", latestActivityFromSocket?.chat_user_id, {
          path: "/",
        })
      }

      setMsgList((list) => [...list, latestActivityFromSocket])
    }
    setLatestActivityFromSocket(null)
  }, [latestActivityFromSocket])
  // console.log(myPeer)
  return (
    <div className={styles.liveChatContainer}>
      <div
        className={styles.floatBtn}
        onClick={() => {
          setIsBoxOpen(!isBoxOpen)
          setUsername("")
          setIsLoggedIn(false)
          socket.current.emit("leave-room")
        }}
      >
        <ChatSupport />
      </div>
      {isBoxOpen && (
        <div className={styles.detailsBox}>
          <header>
            <div className={styles.chatHeader}>
              {" "}
              <ChatSupport /> Live chat
            </div>
          </header>
          <main>
            <div className={styles.inputField}>
              <label htmlFor="">Username:</label>
              <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          </main>
          <button className={styles.joinBtn} onClick={joinClickHandler}>
            Join room
          </button>
        </div>
      )}
      {isLoggedIn && <Chatbox socket={socket} allMessages={msgList} username={username} teamCdn={teamCdn} />}
    </div>
  )
}

export default LiveChat
