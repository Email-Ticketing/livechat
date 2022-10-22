import React, { useState } from "react"
import styles from "./Chatbox.module.scss"
import { RiSendPlane2Fill } from "react-icons/ri"
import VideoPlayer from "./VideoPlayer/VideoPlayer"
import { useEffect } from "react"
import useSocketForStream from "../../../../data-access/useSocketForStream"
import { v4 as uuid } from "uuid"
import { usePeer } from "../../../../context/PeerContext"
import { BsFillCameraVideoFill } from "react-icons/bs"
import { Attachment, ChatSupport, Send } from "../../../../libs/icons/icon"
import moment from "moment/moment"
import { useCookies } from "react-cookie"
import stripHTML from "../../../../libs/utils/stripHtml"
const addToCall = (user, myPeer, myStream) => {
  const call = myPeer.call(user.user_id, myStream)
}
const Chatbox = ({ socket, allMessages, username, teamCdn }) => {
  const [inputMsg, setInputMsg] = useState("")
  const [myStream, setMyStream] = useState()
  const [latestActivityFromStreamSocket, setLatestActivityFromStreamSocket] = useState()
  const [cookies, setCookies] = useCookies()
  const [peerSocket] = useSocketForStream(setLatestActivityFromStreamSocket, myStream)
  const { peerState } = usePeer()
  useEffect(() => {
    if (peerState?.myPeer?._id) {
      peerSocket.current.emit("join-room", username, peerState.myPeer._id, null, "tech1")
    }
  }, [])
  useEffect(() => {
    peerState?.myPeer.on("open", (id) => {
      console.log("My id:", id)
    })
  })
  const clickHandler = async () => {
    console.log("teamChatCdn", teamCdn)
    if (inputMsg) {
      await socket.current.emit("chat-message", inputMsg, "customer", cookies.chat_room_id, teamCdn)
    }
    setInputMsg("")
  }
  const vidClickHandler = async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia()
    setMyStream(stream)
    peerState?.users?.map((user) => {
      if (user.username !== username) {
        const call = peerState.myPeer.call(user.user_id, stream)
      }
    })
  }

  return (
    <div className={styles.chatBox}>
      <header>
        <div className={styles.chatHeader}>
          {" "}
          <ChatSupport /> Live chat
        </div>
      </header>
      <main>
        {allMessages.map((msg) => {
          return (
            msg.content && (
              <div className={styles.msgContainerLeft + " " + (username === msg?.user?.username && styles.msgContainerRight)}>
                <div className={styles.msg + " " + (username === msg?.user?.username && styles.userMsg)}>{stripHTML(msg.content)}</div>
                <p className={styles.msgInfo}>{moment(msg?.created_at).format("Do MMMM YYYY, h:mm a")}</p>
              </div>
            )
          )
        })}
        <div className={styles.videoPlayer}>{peerState?.remoteMediaStream && <VideoPlayer stream={peerState.remoteMediaStream} />}</div>
      </main>
      <footer>
        <div className={styles.sendMessage}>
          <input type="text" placeholder="Write here ..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} />
          <div className={styles.sendOptions}>
            <Attachment className={styles.icon} />
            <Send className={styles.icon} onClick={clickHandler} />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Chatbox
